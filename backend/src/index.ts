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

app.put('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, priority, dueDate, pinned } = req.body;
  await db.update(tasks).set({ title, description, priority, dueDate, pinned }).where(eq(tasks.id, id));
  res.json({ message: 'Task updated!' });
});

app.patch('/api/tasks/:id/complete', async (req, res) => {
  const id = Number(req.params.id);
  const { isDone } = req.body;
  await db.update(tasks).set({ isDone, doneAt: isDone ? new Date() : null }).where(eq(tasks.id, id));
  res.json({ message: isDone ? 'Task marked as done!' : 'Task marked as open!' });
});

app.patch('/api/users/:id/promote', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await db.update(users)
      .set({ role: 'admin' })
      .where(eq(users.id, id));

    res.json({ message: `User mit ID ${id} wurde zum Admin befördert.` });
  } catch (error) {
    res.status(500).json({ error: 'Beförderung fehlgeschlagen' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(tasks).where(eq(tasks.id, id));
  res.json({ message: 'Task deleted!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});