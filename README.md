# TypeShit

> ERSTELLT MIT CLAUDE!!!

## Project Structure

```
TypeShit/
├── frontend/          # Next.js 16 + React 19 (TypeScript)
├── backend/           # Express 5 + Drizzle ORM + Neon Postgres (TypeScript)
├── docker-compose.yml # Run the full project with one command
└── .gitignore
```

## Quickstart with Docker

```bash
docker compose up
```

- Frontend → http://localhost:3000
- Backend → http://localhost:3001

## Manual Setup

```bash
# Terminal 1 — frontend
cd frontend && npm install && npm run dev

# Terminal 2 — backend
cd backend && npm install && npm run dev
```

See [`backend/README.md`](./backend/README.md) for backend-specific setup (env vars, database migrations).
