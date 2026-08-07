# 2. Entwicklungsumgebung vorbereiten

Die Anwendung ist plattformunabhängig. Für die lokale
Entwicklung werden ausschließlich Standard-Tools benötigt.

## Benötigte Tools

| Tool                              | Version | Zweck                                                          | Installation                                                                   |
|-----------------------------------|---|----------------------------------------------------------------|--------------------------------------------------------------------------------|
| Node.js                           | ≥ 20 | Frontend (Next.js) & Backend (Express) ausführen               | z. B. via nvm oder brew für macOS                                              |
| npm                               | ≥ 10 (wird mit Node.js installiert) | Paketverwaltung                                                | in Node.js enthalten                                                           |
| Docker + Docker Compose           | ≥ 24 | Frontend + Backend mit einem Befehl starten in einem Container | Docker Desktop (Windows/macOS)                      |

## Datenbank für lokale Tests

> **Hinweis zur Erstellung:** Die Idee und der grundsätzliche Aufbau der lokalen Datenbank
>(Postgres-Instanz und automatische Migration in
> `docker-compose.yml`) stammen von einer KI (Claude). Die konkrete Umsetzung habe ich selbst
> vorgenommen und geprüft.

Damit die Anwendung **ohne eigenen Neon-Account** lokal getestet werden kann, bringt docker-compose.yml eine lokale
Postgres-Instanz mit, die von der in der Production genutzten Datenbank unabhängig ist:

```bash
docker compose up --build
```

Das startet automatisch, in dieser Reihenfolge:

1. `postgres` – ein lokaler Postgres-Container mit leerer Datenbank `typeshit` (Nutzer/Passwort: `typeshit`)
2. `migrate` – wendet einmalig das aktuelle Schema aus [`backend/drizzle/`](../backend/drizzle/) auf diese
   lokale Datenbank an und beendet sich danach
3. `backend` – verbindet sich mit dieser lokalen Datenbank (`DATABASE_URL` wird dafür in
   `docker-compose.yml` automatisch gesetzt)
4. `frontend` – kommuniziert mit dem Backend

Nach `docker compose up --build` ist die App unter `http://localhost:3000` mit leerer Datenbank nutzbar. Mit `docker compose down -v` werden Container **und** die lokalen Testdaten wieder entfernt.


## Umgebungsvariablen

### Backend (`backend/.env`)

Nur `DATABASE_URL` wird für den manuellen Start verwendet:

```env
DATABASE_URL=***
```


### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Zeigt auf die URL des Backends. Lokal: `http://localhost:3001`, Deployed: die URL von der Produktion.

## Datenbankschema anwenden (nur beim manuellen Start ohne Docker)

Nur wenn Backend manuell per `npm run dev --prefix backend` gegen eine selbst gewählte `DATABASE_URL` gestartet wird,
müssen die Migrationen einmalig manuell ausgeführt werden:

```bash
npm run db:migrate --prefix backend
```
