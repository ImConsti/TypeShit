# TypeShit

> DIESE README IST ERSTELLT MIT CLAUDE!!!

Vollständige Projektdokumentation (Nutzung, Setup, Architektur, Webdesign, Eigenleistung): siehe
[`Dokumentation/`](Dokumentation/README.md).

## Project Structure

```
TypeShit/
├── frontend/          # Next.js 16 + React 19 (TypeScript)
├── backend/           # Express 5 + Drizzle ORM + Postgres (TypeScript)
├── Dokumentation/               # Projektdokumentation
├── docker-compose.yml  # Run the full project (incl. eigenständiger lokaler DB) with one command
└── .gitignore
```

## Quickstart with Docker

```bash
docker compose up --build
```

Startet eine eigenständige lokale Postgres-Datenbank, wendet die Migrationen automatisch an und startet
danach Backend und Frontend – **kein** externer Datenbank-Account nötig (siehe
[`Dokumentation/02-entwicklungsumgebung.md`](Dokumentation/02-entwicklungsumgebung.md)).

- Frontend → http://localhost:3000
- Backend → http://localhost:3001

## Manual Setup

```bash
# Terminal 1 — frontend
npm run dev --prefix frontend

# Terminal 2 — backend
npm run dev --prefix backend
```

Für den manuellen Start (ohne Docker) muss `backend/.env` zusätzlich mit einer gültigen `DATABASE_URL`
befüllt werden (lokale Postgres-Instanz oder Neon) – siehe [`Dokumentation/02-entwicklungsumgebung.md`](Dokumentation/02-entwicklungsumgebung.md)
und [`backend/README.md`](./backend/README.md).
