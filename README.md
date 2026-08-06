# TypeShit

> ERSTELLT MIT CLAUDE!!!

Vollständige Projektdokumentation (Nutzung, Setup, Architektur, Webdesign, Eigenleistung): siehe
[`docs/`](docs/README.md).

## Project Structure

```
TypeShit/
├── frontend/          # Next.js 16 + React 19 (TypeScript)
├── backend/           # Express 5 + Drizzle ORM + Postgres (TypeScript)
├── scripts/            # setup.sh / setup.ps1 – Entwicklungsumgebung einrichten
├── docs/               # Projektdokumentation
├── docker-compose.yml  # Run the full project (incl. eigenständiger lokaler DB) with one command
└── .gitignore
```

## Quickstart with Docker

```bash
docker compose up --build
```

Startet eine eigenständige lokale Postgres-Datenbank, wendet die Migrationen automatisch an und startet
danach Backend und Frontend – **kein** externer Datenbank-Account nötig (siehe
[`docs/02-entwicklungsumgebung.md`](docs/02-entwicklungsumgebung.md#datenbank-für-lokale-tests)).

- Frontend → http://localhost:3000
- Backend → http://localhost:3001

## Manual Setup

```bash
npm run setup   # installiert Abhängigkeiten in frontend/ und backend/, legt .env-Dateien an

# Terminal 1 — frontend
npm run dev --prefix frontend

# Terminal 2 — backend
npm run dev --prefix backend
```

Für den manuellen Start (ohne Docker) muss `backend/.env` zusätzlich mit einer gültigen `DATABASE_URL`
befüllt werden (lokale Postgres-Instanz oder Neon) – siehe [`docs/02-entwicklungsumgebung.md`](docs/02-entwicklungsumgebung.md)
und [`backend/README.md`](./backend/README.md).
