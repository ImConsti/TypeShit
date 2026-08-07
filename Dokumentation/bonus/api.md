# API-Struktur

REST-API des Backends ([`backend/src/index.ts`](../../backend/src/index.ts)), Express 5 + Drizzle ORM +
Postgres (Neon). Basis-URL lokal: `http://localhost:3001`.

Mit `JWT` markierte Endpunkte benötigen einen gültigen Header `Authorization: Bearer <token>`, den man aus
`POST /api/auth/register` oder `POST /api/auth/login` erhält. Mit `JWT + admin` markierte Endpunkte
benötigen zusätzlich `role: "admin"` auf dem eingeloggten Account.

---

## Health

| Aktion | Methode | Endpunkt | Auth | Output |
|---|---|---|---|---|
| Server-Health-Check | `GET` | `/health` | – | `{ status: "ok" }` |
| DB-Verbindung prüfen | `GET` | `/health/db` | – | `{ status: "ok", time }` |

---

## Auth

| Aktion | Methode | Endpunkt | Input | Output |
|---|---|---|---|---|
| Registrieren | `POST` | `/api/auth/register` | `{ email, password }` (Passwort ≥ 6 Zeichen) | `{ token, email, role }` (Status `201`) |
| Einloggen | `POST` | `/api/auth/login` | `{ email, password }` | `{ token, email, role }` |
| Ausloggen | `POST` | `/api/auth/logout` | `Authorization`-Header | `{ success: true }` (invalidiert das Token **nicht** serverseitig) |
| Reset-Token anfordern | `POST` | `/api/auth/request-reset` | `{ email }` | `{ success: true, token }` (Status `200`), `404` falls die E-Mail nicht existiert |
| Passwort zurücksetzen | `POST` | `/api/auth/reset-password` | `{ email }` | `{ success: true }`|


### Auth Register / Login (Request)

```json
{
  "email": "benutzer@beispiel.de",
  "password": "sicheresPasswort"
}
```

### Auth Register / Login (Response)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "benutzer@beispiel.de",
  "role": "user"
}
```

---

## Tasks

Alle Task-Endpunkte sind nach Besitzer gescoped: Nutzer sehen und ändern ausschließlich ihre eigenen Tasks
(`userId` kommt ausschließlich aus dem verifizierten JWT, nie aus Body/URL).

| Aktion | Methode | Endpunkt | Auth | Input | Output |
|---|---|---|---|---|---|
| Eigene Tasks abrufen | `GET` | `/api/tasks` | JWT | – | `Task[]` |
| Neuen Task erstellen | `POST` | `/api/tasks` | JWT | `{ title, description?, priority, dueDate? }` | `Task` (Status `201`) |
| Task aktualisieren | `PUT` | `/api/tasks/:id` | JWT | `{ title, description?, priority, dueDate? }` | `{ message: "Task updated!" }` |
| Task erledigen/wiederherstellen | `PATCH` | `/api/tasks/:id/complete` | JWT | `{ isDone: boolean }` | `{ message: string }` |
| Task löschen | `DELETE` | `/api/tasks/:id` | JWT | – | `{ message: "Task deleted!" }` |

Es gibt **keinen** separaten `/restore`-Endpunkt und **keinen** `GET /api/tasks/:id` für einen einzelnen
Task – Wiederherstellen ist derselbe `/complete`-Endpunkt, nur mit `isDone: false` im Body.

### Task (Request Body für POST/PUT)

```json
{
  "title": "Projektpräsentation vorbereiten",
  "description": "Folien erstellen und Demo testen",
  "priority": "Hoch",
  "dueDate": "2026-06-10"
}
```

### Task (Response)

```json
{
  "id": 1,
  "userId": 1,
  "title": "Projektpräsentation vorbereiten",
  "description": "Folien erstellen und Demo testen",
  "priority": "Hoch",
  "dueDate": "2026-06-10",
  "isDone": false,
  "doneAt": null
}
```

### Server-seitige Validierung (Tasks)

| Feld | Regel |
|---|---|
| `title` | Pflicht, max. 300 Zeichen, nicht nur Whitespace |
| `description` | optional, max. 5000 Zeichen |
| `priority` | muss `"Hoch"`, `"Mittel"` oder `"Niedrig"` sein |

---

## Statistiken

| Aktion | Methode | Endpunkt | Auth | Output |
|---|---|---|---|---|
| Statistiken abrufen | `GET` | `/api/statistics` | JWT | siehe unten |

```json
{
  "user": {
    "name": "Max Mustermann",
    "email": "max.mustermann@example.com",
    "weekday": "Montag",
    "date": "10. Juni 2026"
  },
  "summary": {
    "totalTasks": 8,
    "finished": 3,
    "inProgress": 5,
    "important": 2,
    "streakDays": 4
  },
  "openTasks": [
    { "title": "Projektpräsentation vorbereiten", "priority": "Hoch", "due": "2026-06-10" }
  ],
  "importantTasks": ["Projektpräsentation vorbereiten"],
  "upcomingDeadlines": [
    {
      "title": "Projektpräsentation vorbereiten",
      "priority": "Hoch",
      "dueDate": "2026-06-10",
      "label": "10.06",
      "daysUntil": 2,
      "overdue": false
    }
  ]
}
```

`upcomingDeadlines` enthält überfällige Tasks (`overdue: true`) sowie Tasks, die innerhalb der nächsten 7
Tage fällig sind, sortiert nach Dringlichkeit. `user.name` wird aus dem lokalen Teil der E-Mail-Adresse
abgeleitet (siehe `displayNameFromEmail` in [`backend/src/index.ts`](../../backend/src/index.ts)) – es
gibt keine separate `name`-Spalte in der `users`-Tabelle.

---

## Nutzerverwaltung / Admin

| Aktion | Methode | Endpunkt | Auth | Input | Output |
|---|---|---|---|---|---|
| Alle Nutzer abrufen | `GET` | `/api/users` | JWT + admin | – | `{ id, email, role, createdAt }[]` |
| Nutzer zum Admin befördern | `PATCH` | `/api/users/:id/promote` | JWT + admin | – (ID in der URL) | `{ message: string }` |

Nicht-Admin-Accounts erhalten auf beiden Endpunkten `403 Forbidden`.

---

## HTTP-Statuscodes

| Code | Bedeutung |
|---|---|
| `200 OK` | Erfolgreiche Anfrage (GET, PUT, PATCH, DELETE) |
| `201 Created` | Ressource erfolgreich erstellt (POST) |
| `400 Bad Request` | Fehlende oder ungültige Eingabedaten |
| `401 Unauthorized` | Kein `Authorization`-Header vorhanden |
| `403 Forbidden` | Token ungültig/abgelaufen, **oder** fehlende Berechtigung (z. B. kein Zugriff auf einen fremden Task, oder keine `admin`-Rolle) |
| `404 Not Found` | Ressource nicht gefunden |
| `500 Internal Server Error` | Serverfehler |
