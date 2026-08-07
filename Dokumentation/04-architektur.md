# 4. Architektur & Struktur

## Projektstruktur

```
TypeShit/
├── frontend/               # Next.js + React (TypeScript)
├── backend/                # Express + Drizzle + Neon Postgres (TypeScript)
├── docs/                   # diese Dokumentation
├── docker-compose.yml      # Frontend + Backend gemeinsam starten
└── frontend/.github/workflows/ # Build- und Vercel-Deployment-Pipeline
```

## Frontend (`frontend/`)

```
frontend/src/
├── app/
│   ├── page.tsx                 # Dashboard „/“
│   ├── layout.tsx               # Root-Layout
│   ├── login/page.tsx           # Login-Formular
│   ├── register/page.tsx        # Registrierungs-Formular
│   ├── forgot-password/page.tsx # Passwort-vergessen-Formular (fordert Reset-Token an)
│   ├── reset-password/page.tsx  # Formular zum Setzen des neuen Passworts mit Reset-Token
│   ├── statistics/page.tsx      # lädt GET /api/statistics und rendert StatisticsPage
│   ├── admin/page.tsx           # Nutzerverwaltung mit "admin"-Rolle
│   ├── TaskPanel/
│   │   ├── TasksPanel.tsx       # lädt/erstellt/ändert Tasks über Backend
│   │   └── TaskInput.tsx        # Formular zum Erstellen einer neuen Aufgabe
│   ├── OpenTask/OpenTask.tsx    # Tabelle offener Aufgaben mit Suche/Filter und Edit-Funktion
│   ├── CloseTask/CloseTask.tsx  # Tabelle erledigter Aufgaben und Wiederherstellen &L öschen
│   ├── components/
│   │   ├── StatisticsPage.tsx   # Darstellung der Statistik-Daten
│   │   ├── ConfirmModal.tsx     # Bestätigungs-Modal vor dem Löschen
│   │   └── DeleteButton.tsx     # Lösch-Button
│   └── services/userService.ts  # fetch-Wrapper für /api/users, /api/users/:id/promote
└── contexts/
    └── AuthContext.tsx          # Auth-State + login/register/logout, clientseitiger Route Guard (leitet ohne Token in sessionStorage auf /login um)
```

Styling ist über CSS Modules (`*.module.css`), globale Variablen liegen in [`frontend/src/app/globals.css`](../frontend/src/app/globals.css).


## Backend (`backend/`)

```
backend/src/
├── index.ts       # Express-App: Middleware, API-Routen, JWT-Auth-Middleware
├── db.ts          # Neon Connection
└── schema.ts       # Tabellenschema
backend/drizzle/     # generierte SQL-Migrationen
```

## Datenmodell & API

Ein **User** besitzt beliebig viele **Tasks** (`userId` referenziert `users.id`, `onDelete` löscht
die zugehörigen Tasks mit).

### Tabelle `users`

| Spalte               | Typ         | Constraints                    |
|-----------------------|-------------|---------------------------------|
| `id`                  | `SERIAL`    | `PRIMARY KEY`                   |
| `email`               | `TEXT`      | `UNIQUE`, `NOT NULL`             |
| `password`            | `TEXT`      | `NOT NULL` (bcrypt-Hash)         |
| `createdAt`           | `TIMESTAMP` | `NOT NULL`, `DEFAULT now()`      |
| `role`                | `TEXT`      | `NOT NULL`, `DEFAULT 'user'`     |
| `reset_token`         | `TEXT`      | –                                |
| `reset_token_expiry`  | `TIMESTAMP` | –                                |

### Tabelle `tasks`

| Spalte        | Typ              | Constraints                    |
|----------------|------------------|---------------------------------|
| `id`           | `SERIAL`         | `PRIMARY KEY`                   |
| `userId`       | `INTEGER`        | `NOT NULL`, FK → `users.id`      |
| `title`        | `VARCHAR(300)`   | `NOT NULL`                      |
| `description`  | `VARCHAR(5000)`  | `NOT NULL`, `DEFAULT ''`         |
| `priority`     | `priority` (Enum)| `NOT NULL`                      |
| `dueDate`      | `DATE`           | –                                |
| `isDone`       | `BOOLEAN`        | `NOT NULL`, `DEFAULT false`      |
| `doneAt`       | `TIMESTAMP`      | –                                |

### Implementierte API-Endpunkte


| Methode | Endpunkt | Auth | Beschreibung                                          |
|---|---|---|-------------------------------------------------------|
| GET | `/health` | – | Health-Check                                          |
| GET | `/health/db` | – | DB-Verbindung prüfen                                  |
| POST | `/api/auth/register` | – | Account anlegen, gibt `{ token, email, role }` zurück |
| POST | `/api/auth/login` | – | Anmelden, gibt `{ token, email, role }` zurück        |
| POST | `/api/auth/logout` | – | Bestätigt Logout                                      |
| POST | `/api/auth/request-reset` | – | Erzeugt Reset-Token für die angegebene E-Mail, `404` falls nicht vorhanden |
| POST | `/api/auth/reset-password` | – | Setzt das Password des Nutzers zurück                 |
| GET | `/api/tasks` | JWT | eigene Aufgaben laden                                 |
| POST | `/api/tasks` | JWT | Aufgabe anlegen                                       |
| PUT | `/api/tasks/:id` | JWT | Aufgabe aktualisieren                                 |
| PATCH | `/api/tasks/:id/complete` | JWT | `isDone` umschalten, setzt/löscht `doneAt`            |
| DELETE | `/api/tasks/:id` | JWT | Aufgabe löschen                                       |
| GET | `/api/statistics` | JWT | erstellt Kennzahlen für die eigene Aufgabenliste      |
| GET | `/api/users` | JWT + Rolle `admin` | Liste aller Nutzer                                    |
| PATCH | `/api/users/:id/promote` | JWT + Rolle `admin` | setzt `role` eines Nutzers auf `admin`                |
| PATCH | `/api/users/:id/demote` | JWT + Rolle `admin` | setzt `role` eines Nutzers auf `user`                 |
| DELETE | `/api/users/:id` | JWT + Rolle `admin` | löscht einen Nutzer                                   |


## Sicherheitsaspekte (aktueller Stand)

| Umgesetzte                                                                            | Noch zu verbessern in Zukunft         |
|---------------------------------------------------------------------------------------|---------------------------------------|
| Passwörter werden mit `bcrypt` gehasht, nie im Klartext gespeichert                   | CORS ist aktuell auf `*` konfiguriert |
| Zugriff auf Tasks/Endpunkte per JWT abgesichert (`authenticateToken`)                 | -                                     |
| Eigentümerprüfung bei Update/Delete/Complete von Tasks (`userId` muss übereinstimmen) | -                                     |
| Server-seitige Validierung von Titel-/Beschreibungslänge und Priorität                | -                                     |

