import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Neon (and most managed Postgres providers) require TLS ("sslmode=require" in the URL);
// a local Postgres (e.g. the "postgres" service in docker-compose.yml) does not use TLS at all.
const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: true } : false,
});

export const db = drizzle({ client: pool, schema });
