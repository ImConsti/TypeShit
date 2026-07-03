# API-Struktur

> Die Anwendung ist aktuell vollständig clientseitig (kein Deployment). Die folgende Tabelle beschreibt die **geplante REST-API**, die bei einer Backend-Anbindung implementiert werden würde.

Basis-URL: `/api`

---

## Tasks

| Aktion | Methode | Endpunkt | Input | Output |
|---|---|---|---|---|
| Alle Tasks abrufen | `GET` | `/api/tasks` | – | `Task[]` |
| Einzelnen Task abrufen | `GET` | `/api/tasks/:id` | `id` (URL-Parameter) | `Task` |
| Neuen Task erstellen | `POST` | `/api/tasks` | `{ title, description, priority, dueDate? }` | `Task` (neu erstellt, inkl. `id`) |
| Task aktualisieren | `PUT` | `/api/tasks/:id` | `id` + `{ title?, description?, priority?, dueDate? }` | `Task` (aktualisiert) |
| Task als erledigt markieren | `PATCH` | `/api/tasks/:id/complete` | `id` | `Task` (mit `isDone: true`, `doneAt` gesetzt) |
| Task wiederherstellen | `PATCH` | `/api/tasks/:id/restore` | `id` | `Task` (mit `isDone: false`, `doneAt` entfernt) |
| Task löschen | `DELETE` | `/api/tasks/:id` | `id` (URL-Parameter) | `{ success: true }` |

---

## Auth

| Aktion | Methode | Endpunkt | Input | Output |
|---|---|---|---|---|
| Registrieren | `POST` | `/api/auth/register` | `{ email, password }` | `{ token, email }` (Status `201`) |
| Einloggen | `POST` | `/api/auth/login` | `{ email, password }` | `{ token, email }` |
| Ausloggen | `POST` | `/api/auth/logout` | `Authorization`-Header | `{ success: true }` |
| Session prüfen | `GET` | `/api/auth/me` | `Authorization`-Header | `{ email, isAuthenticated }` |
| Passwort zurücksetzen | `POST` | `/api/auth/reset-password` | `{ email }` | `{ success: true }` |

---

## Statistiken

| Aktion | Methode | Endpunkt | Input | Output |
|---|---|---|---|---|
| Statistiken abrufen | `GET` | `/api/statistics` | `Authorization`-Header | `StatisticsData` |

---

## Datenformate

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
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Projektpräsentation vorbereiten",
  "description": "Folien erstellen und Demo testen",
  "priority": "Hoch",
  "dueDate": "2026-06-10",
  "isDone": false,
  "doneAt": null,
  "pinned": false
}
```

### Auth Register (Request)

```json
{
  "email": "benutzer@beispiel.de",
  "password": "sicheresPasswort"
}
```

### Auth Register (Response)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "benutzer@beispiel.de"
}
```

### Auth Reset-Password (Request)

```json
{
  "email": "benutzer@beispiel.de"
}
```

### Auth Reset-Password (Response)

```json
{
  "success": true
}
```

### Auth Login (Request)

```json
{
  "email": "benutzer@beispiel.de",
  "password": "sicheresPasswort"
}
```

### Auth Login (Response)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "benutzer@beispiel.de"
}
```

---

## HTTP-Statuscodes

| Code | Bedeutung |
|---|---|
| `200 OK` | Erfolgreiche Anfrage (GET, PUT, PATCH) |
| `201 Created` | Ressource erfolgreich erstellt (POST) |
| `204 No Content` | Erfolgreich gelöscht (DELETE) |
| `400 Bad Request` | Fehlende oder ungültige Eingabedaten |
| `401 Unauthorized` | Nicht authentifiziert |
| `404 Not Found` | Ressource nicht gefunden |
| `500 Internal Server Error` | Serverfehler |
