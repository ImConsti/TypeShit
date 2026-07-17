import 'dotenv/config';
import express from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from './db';
import { tasks } from './schema';

const app = express();
const PORT = 3001;

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

app.delete('/api/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);

  await db.delete(tasks).where(eq(tasks.id, id));

  res.json({ message: 'Task deleted!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
