import 'dotenv/config';
import express from 'express';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { tasks, users } from './schema';
import crypto from 'crypto';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'typeshit-super-secret-jwt-key';

export interface AuthRequest extends express.Request {
  user?: { userId: number; email: string; role: string };
}

const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Kein Token vorhanden' });

  // https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden Token' });
    }
    req.user = decodedUser as { userId: number; email: string; role: string };
    next();
  });
};

/** Time zone used for date-based statistics and German date formatting. */
const APP_TIME_ZONE = 'Europe/Berlin';

/** Number of future days included in the upcoming-deadlines section. */
const DEADLINE_WINDOW_DAYS = 7;

/**
 * Converts a JavaScript Date into a stable YYYY-MM-DD key in the application
 * time zone. This prevents UTC/local-time differences from moving a task to
 * the wrong calendar day.
 */


function dateKeyInTimeZone(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Datum konnte nicht formatiert werden');
  }

  return `${year}-${month}-${day}`;
}


/**
 * Parses a date-only value (YYYY-MM-DD) as UTC midnight so later date
 * calculations do not depend on the machine's local time zone.
 */
function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}


/** Returns a new Date shifted by the requested number of UTC calendar days. */

function addUtcDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/** Extracts the YYYY-MM-DD part of a UTC date. */
function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}


/**
 * Counts consecutive days, starting today and moving backwards, on which the
 * user completed at least one task. Multiple completions on the same day count
 * as one streak day.
 */


function calculateStreakDays(doneDates: Array<Date | null>): number {
  const completionDays = new Set(
    doneDates
      .filter((date): date is Date => date instanceof Date)
      .map(dateKeyInTimeZone)
  );

  let currentDay = parseDateKey(dateKeyInTimeZone(new Date()));
  let streakDays = 0;

  while (completionDays.has(utcDateKey(currentDay))) {
    streakDays += 1;
    currentDay = addUtcDays(currentDay, -1);
  }

  return streakDays;
}

/**
 * Builds a readable display name from the local part of an email address.
 * Example: max.mustermann@example.com -> Max Mustermann.

*/

function displayNameFromEmail(email: string): string {
  const localPart = email.split('@')[0];

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

app.use(express.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.options(/.*/, (_req, res) => res.sendStatus(204));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/db', async (_req, res) => {
  try {
    const result = await db.execute(sql`SELECT NOW() AS time`);
    res.json({ status: 'ok', time: result.rows[0]?.time });
  } catch (err) {
    res.status(500).json({ status: 'error', message: (err as Error).message });
  }
});

/**
 * Returns the complete statistics payload required by StatisticsPage.
 * authenticateToken validates the JWT first, so the route can only read data
 * belonging to the currently logged-in user.
 */
app.get('/api/statistics', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    // The user ID comes exclusively from the verified JWT, never from the body
    // or query string. This prevents requesting another user's statistics.
    const userId = req.user!.userId;

    // Fetch the user's tasks and account information in parallel.
    const [userTasks, userRows] = await Promise.all([
      db.select().from(tasks).where(eq(tasks.userId, userId)),
      db.select().from(users).where(eq(users.id, userId)),
    ]);

    // Drizzle returns an array even though a primary-key lookup can match only
    // one user.
    const user = userRows[0];
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }


    // Build reusable task groups for the summary and detailed lists. In this
    // project, priority "Hoch" is the agreed definition of an important task.
    const finishedTasks = userTasks.filter((task) => task.isDone === true);
    const openTasks = userTasks.filter((task) => task.isDone === false);
    const importantTasks = userTasks.filter((task) => task.priority === 'Hoch');


    // Normalize "today" once so all deadline calculations use the same date.
    const todayKey = dateKeyInTimeZone(new Date());
    const today = parseDateKey(todayKey);


    // Convert open tasks with a due date into the exact structure expected by
    // the frontend. Overdue tasks are retained; future tasks are limited to the
    // configured deadline window.
    const upcomingDeadlines = openTasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const dueDate = parseDateKey(task.dueDate!);
        const daysUntil = Math.round((dueDate.getTime() - today.getTime()) / 86400000);

        return {
          title: task.title,
          priority: task.priority,
          dueDate: task.dueDate!,
          label: new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            timeZone: APP_TIME_ZONE,
          }).format(dueDate),
          daysUntil,
          overdue: daysUntil < 0,
        };
      })
      // Negative daysUntil values represent overdue tasks and therefore also
      // satisfy this condition.
      .filter((item) => item.daysUntil <= DEADLINE_WINDOW_DAYS)
      // Show the most overdue or nearest deadline first.
      .sort((a, b) => a.daysUntil - b.daysUntil);

    const now = new Date();

    // Keep this response contract synchronized with StatisticsData in
    // frontend/src/app/components/StatisticsPage.tsx.
    return res.status(200).json({
      user: {
        // The users table currently has no dedicated name column.
        name: displayNameFromEmail(user.email),
        email: user.email,
        weekday: new Intl.DateTimeFormat('de-DE', {
          weekday: 'long',
          timeZone: APP_TIME_ZONE,
        }).format(now),
        date: new Intl.DateTimeFormat('de-DE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: APP_TIME_ZONE,
        }).format(now),
      },
      // Aggregate counters displayed in the summary cards.
      summary: {
        totalTasks: userTasks.length,
        finished: finishedTasks.length,
        inProgress: openTasks.length,
        important: importantTasks.length,
        streakDays: calculateStreakDays(
          finishedTasks.map((task) => task.doneAt)
        ),
      },
      // Return only the fields needed by the open-tasks table.
      openTasks: openTasks.map((task) => ({
        title: task.title,
        priority: task.priority,
        due: task.dueDate ?? '',
      })),
      // The important-tasks panel requires title strings rather than objects.
      importantTasks: importantTasks.map((task) => task.title),
      upcomingDeadlines,
    });
  } catch (error) {
    console.error('Fehler beim Laden der Statistiken:', error);
    return res.status(500).json({ error: 'Statistiken konnten nicht geladen werden' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Ungueltige Eingaben' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({
      email,
      passwordHash: hashed,
    }).returning();
    
    const token = jwt.sign(
      { userId: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // HIER das , role: newUser[0].role ergänzen:
    res.status(201).json({ token, email, role: newUser[0].role });
    
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'E-Mail existiert bereits' });
    }
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (!user) {
      return res.status(401).json({ error: 'Falsche Daten' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Falsche Daten' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.status(200).json({ success: true });
});

app.post('/api/auth/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-Mail fehlt' });
    
    const userResult = await db.select().from(users).where(eq(users.email, email));
    
    if (!userResult[0]) {
      return res.status(404).json({ error: 'E-Mail nicht gefunden' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);

    await db.update(users)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(users.id, userResult[0].id));
    
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Ungueltige Eingaben' });
    }

    const userResult = await db.select().from(users).where(eq(users.resetToken, token));
    const user = userResult[0];

    if (!user || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Token ungueltig oder abgelaufen' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.update(users)
      .set({ passwordHash: hashed, resetToken: null, resetTokenExpiry: null })
      .where(eq(users.id, user.id));

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.userId;
    const { title, description, priority, dueDate } = req.body;
    const validPriorities = ['Hoch', 'Mittel', 'Niedrig'];

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Ungültige Task-ID' });
    }

    if (typeof title !== 'string' || !title || title.length > 300 || title.trim() === '') {
      return res.status(400).json({ error: 'Ungültiger Titel' });
    }

    if (description && (description.length > 5000 || typeof description !== 'string')) {
      return res.status(400).json({ error: 'Beschreibung zu lang' });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Ungültige Priorität' });
    }

    const existing = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!existing[0]) {
      return res.status(404).json({ error: 'Task nicht gefunden' });
    }
    if (existing[0].userId !== userId) {
      return res.status(403).json({ error: 'Kein Zugriff auf diese Task' });
    }

    await db.update(tasks).set({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority,
      dueDate
    }).where(eq(tasks.id, id));
    res.json({ message: 'Task updated!' });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.patch('/api/tasks/:id/complete', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.userId;
    const { isDone } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Ungültige Task-ID' });
    }

    if (typeof isDone !== 'boolean') {
      return res.status(400).json({ error: 'Ungültiger isDone-Wert' });
    }

    const existing = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!existing[0]) {
      return res.status(404).json({ error: 'Task nicht gefunden' });
    }
    if (existing[0].userId !== userId) {
      return res.status(403).json({ error: 'Kein Zugriff auf diese Task' });
    }

    await db.update(tasks).set({ isDone, doneAt: isDone ? new Date() : null }).where(eq(tasks.id, id));
    res.json({ message: isDone ? 'Task marked as done!' : 'Task marked as open!' });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.patch('/api/users/:id/promote', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Zugriff verweigert' });
    }
    const id = Number(req.params.id);
    await db.update(users).set({ role: 'admin' }).where(eq(users.id, id));
    res.json({ message: `User mit ID ${id} wurde zum Admin befoerdert.` });
  } catch (error) {
    res.status(500).json({ error: 'Befoerderung fehlgeschlagen' });
  }
});

app.get('/api/users', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Zugriff verweigert' });
    }
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    }).from(users);
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.userId;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Ungültige Task-ID' });
    }

    const existing = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!existing[0]) {
      return res.status(404).json({ error: 'Task nicht gefunden' });
    }
    if (existing[0].userId !== userId) {
      return res.status(403).json({ error: 'Kein Zugriff auf diese Task' });
    }

    await db.delete(tasks).where(eq(tasks.id, id));
    res.json({ message: 'Task deleted!' });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.get('/api/tasks', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user!.userId;
    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.post('/api/tasks', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const {title, description, priority, dueDate } = req.body;
    const userId = req.user!.userId;
    const validPriorities = ['Hoch', 'Mittel', 'Niedrig'];
    const todayString = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

    if (typeof title !== 'string' || !title || title.length > 300 || title.trim() === '') {
      return res.status(400).json({ error: 'Ungültiger Titel' });
    }

    if (description && (description.length > 5000 || typeof description !== 'string')) {
      return res.status(400).json({ error: 'Beschreibung zu lang' });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Ungültige Priorität' });
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: 'Ungültiges Datum' });
    }

    if (dueDate && dueDate < todayString) {
      return res.status(400).json({ error: 'Das Fälligkeitsdatum darf nicht in der Vergangenheit liegen' });
    }
    
    const newTask = await db.insert(tasks).values({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority,
      dueDate,
      userId
    }).returning();
    res.status(201).json(newTask[0]);
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});