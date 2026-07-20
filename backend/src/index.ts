import 'dotenv/config';
import express from 'express';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { tasks, users } from './schema';

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

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden Token' });
    }
    req.user = decodedUser as { userId: number; email: string; role: string };
    next();
  });
};

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

    res.status(201).json({ token, email });
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

    res.status(200).json({ token, email });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.status(200).json({ success: true });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-Mail fehlt' });
  res.status(200).json({ success: true });
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
// Hier muss ich in die post route noch die Validierung vom Datum einbauen! 
app.post('/api/tasks', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const {title, description, priority, dueDate } = req.body;
    const userId = req.user!.userId;
    const validPriorities = ['Hoch', 'Mittel', 'Niedrig'];

    if (typeof title !== 'string' || !title || title.length > 300 || title.trim() === '') {
      return res.status(400).json({ error: 'Ungültiger Titel' });
    }

    if (description && (description.length > 5000 || typeof description !== 'string')) {
      return res.status(400).json({ error: 'Beschreibung zu lang' });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Ungültige Priorität' });
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