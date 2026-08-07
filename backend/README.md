# Backend

> DIESE README IST ERSTELLT MIT CLAUDE!!!

Express 5 REST API written in TypeScript, using Drizzle ORM over standard Postgres (`pg`/node-postgres).
In production this connects to [Neon](https://neon.tech/) (serverless Postgres); for local development
and testing it works identically against a plain local Postgres instance (see
[`../docs/02-entwicklungsumgebung.md`](../docs/02-entwicklungsumgebung.md#datenbank-für-lokale-tests) for
the zero-setup `docker compose up` path).

## Structure

```
backend/
├── src/
│   ├── index.ts      # Express server & routes
│   ├── db.ts         # Postgres connection (pg) + Drizzle instance
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

Only needed if you run the backend directly with `npm run dev` (not via `docker compose up`, which
provisions its own local database automatically). Copy `.env.example` and fill in either a local
Postgres URL or your values from the Neon dashboard:
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
| `npm run db:migrate` | Apply pending migrations to the database in `DATABASE_URL` |
| `npm run db:studio` | Open Drizzle Studio to browse data |

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | – | Server health check |
| GET | `/health/db` | – | Database connection check |
| POST | `/api/auth/register` | – | Create account, returns `{ token, email, role }` |
| POST | `/api/auth/login` | – | Log in, returns `{ token, email, role }` |
| POST | `/api/auth/logout` | – | Confirms logout |
| POST | `/api/auth/request-reset` | – | Generates a reset token for the given email |
| POST | `/api/auth/reset-password` | – | Resets the password using a valid reset token |
| GET | `/api/tasks` | JWT | Load the authenticated user's tasks |
| POST | `/api/tasks` | JWT | Create a task |
| PUT | `/api/tasks/:id` | JWT | Update a task |
| PATCH | `/api/tasks/:id/complete` | JWT | Toggle `isDone`, sets/clears `doneAt` |
| DELETE | `/api/tasks/:id` | JWT | Delete a task |
| GET | `/api/statistics` | JWT | Aggregated stats for the authenticated user's tasks |
| GET | `/api/users` | JWT + role `admin` | List all users |
| PATCH | `/api/users/:id/promote` | JWT + role `admin` | Set a user's role to `admin` |
| PATCH | `/api/users/:id/demote` | JWT + role `admin` | Set a user's role to `user` |
| DELETE | `/api/users/:id` | JWT + role `admin` | Delete a user |

## Adding database tables

1. Define your table in `src/schema.ts`
2. Run `npm run db:generate` to create a migration
3. Run `npm run db:migrate` to apply it to the database in `DATABASE_URL`
