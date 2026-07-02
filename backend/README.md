# Backend

> ERSTELLT MIT CLAUDE!!!

Express 5 REST API written in TypeScript, using Drizzle ORM with a Neon (serverless Postgres) database.

## Structure

```
backend/
├── src/
│   ├── index.ts      # Express server & routes
│   ├── db.ts         # Neon connection + Drizzle instance
│   └── schema.ts     # Database table definitions (add your tables here)
├── drizzle/          # Generated migration files
├── drizzle.config.ts # Drizzle CLI config
├── Dockerfile
├── tsconfig.json
└── .env              # Local environment variables (not committed)
```

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Create a `.env` file**

Copy `.env.example` and fill in your values from the Neon/Netlify dashboard:
```bash
cp .env.example .env
```

The backend only requires `DATABASE_URL` to run. The other variables (`PGHOST`, `POSTGRES_*`, etc.) are provided by Neon for convenience but are not used directly.

**3. Start the dev server**
```bash
npm run dev
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server via ts-node on http://localhost:3001 |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate` | Apply pending migrations to Neon |
| `npm run db:studio` | Open Drizzle Studio to browse data |

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server health check |
| GET | `/health/db` | Database connection check |

## Adding database tables

1. Define your table in `src/schema.ts`
2. Run `npm run db:generate` to create a migration
3. Run `npm run db:migrate` to apply it to Neon
