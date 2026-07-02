import 'dotenv/config';
import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db';

const app = express();
const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
