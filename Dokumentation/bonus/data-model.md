# Datenmodell

## Ressourcen

### Task (Aufgabe)

Zentrale Ressource der Anwendung. Repräsentiert eine einzelne Aufgabe.

| Eigenschaft | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | `number` | ja | Fortlaufende, von Postgres vergebene ID (`serial`) |
| `userId` | `number` | ja | ID des Besitzers (Fremdschlüssel auf `User.id`) |
| `title` | `string` (max. 300 Zeichen) | ja | Titel der Aufgabe |
| `description` | `string` (max. 5000 Zeichen) | nein | Beschreibung der Aufgabe (kann leer sein) |
| `priority` | `"Hoch" \| "Mittel" \| "Niedrig"` | ja | Prioritätsstufe |
| `dueDate` | `string` | nein | Fälligkeitsdatum, z. B. `"2026-06-10"` |
| `isDone` | `boolean` | ja | `true` wenn erledigt, sonst `false` |
| `doneAt` | `string \| null` | nein | Zeitstempel der Erledigung, z. B. `"2026-06-09T14:32:00.000Z"`, `null` solange offen |


```typescript
type Priority = "Hoch" | "Mittel" | "Niedrig";

type Task = {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate?: string;
    isDone: boolean;
    doneAt?: string;
};
```

---

### User (Benutzer)

Repräsentiert einen registrierten Account.

| Eigenschaft | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | `number` | ja | Fortlaufende, von Postgres vergebene ID |
| `email` | `string` | ja | E-Mail-Adresse, eindeutig |
| `passwordHash` | `string` | ja | mit `bcrypt` gehashtes Passwort (nie im Klartext gespeichert, nie an das Frontend ausgegeben) |
| `role` | `"user" \| "admin"` | ja | Rolle; steuert Zugriff auf den Admin-Bereich (Default `"user"`) |
| `createdAt` | `string` | ja | Zeitstempel der Registrierung |
| `resetToken` | `string \| null` | nein | Token für den Passwort-Reset-Flow, `null` solange keiner angefordert wurde |
| `resetTokenExpiry` | `string \| null` | nein | Ablaufzeitpunkt von `resetToken` (1 Stunde nach Anforderung) |


**Persistenz:** `auth_token` (JWT) und `user_email`/`user_role` in `localStorage`, zusätzlich `auth_token`
als Cookie für die serverseitige Next.js-Middleware (Route Guard). Die eigentlichen User- und Task-Daten
liegen **nicht** mehr im `localStorage`, sondern persistent im Backend (Postgres/Neon).

---

## Beziehungen zwischen Ressourcen

```
User ──── besitzt ────► Task[]
           (1 : n)
```

- Ein **User** hat beliebig viele **Tasks**.
- Jeder **Task** gehört genau einem **User** (`Task.userId` als Fremdschlüssel, `onDelete: cascade`).

---

## Mögliche Aktionen auf Ressourcen

### Task

| Aktion | Auslöser | Beschreibung                                                                 |
|---|---|------------------------------------------------------------------------------|
| `create` | TaskInput-Formular | Neue Aufgabe anlegen (`POST /api/tasks`)                                     |
| `read` | Seitenaufruf | Alle eigenen Tasks laden (`GET /api/tasks`)                                  |
| `update` | Inline-Editor in OpenTask | Titel, Beschreibung, Priorität oder Datum ändern (`PUT /api/tasks/:id`)      |
| `complete` / `restore` | Häkchen bzw. Zurück-Pfeil | `isDone` umschalten, setzt/löscht `doneAt` (`PATCH /api/tasks/:id/complete`) |
| `delete` | Papierkorb-Symbol | Aufgabe dauerhaft löschen (`DELETE /api/tasks/:id`)                          |
| `filter` | Suchfeld in OpenTask | Nach Titel/Beschreibung filtern (rein clientseitig)                          |
| `sort` | Sortier-Dropdown | Nach Fälligkeitsdatum, Priorität oder Erledigungsdatum sortieren             |

### User

| Aktion | Auslöser | Beschreibung |
|---|---|---|
| `register` | Registrierungs-Seite | Account anlegen (`POST /api/auth/register`) |
| `login` | Login-Seite | Anmelden (`POST /api/auth/login`) |
| `logout` | Dashboard | Session beenden, `localStorage` leeren (`POST /api/auth/logout`) |
| `promote` | Admin-Bereich | Anderen Nutzer zum Admin befördern, nur für Rolle `admin` (`PATCH /api/users/:id/promote`) |
| `requestReset` | "Passwort vergessen"-Formular | Reset-Token erzeugen (`POST /api/auth/request-reset`)|


---

## Persistenz

Alle Task- und User-Daten liegen persistent in Postgres (Neon, serverless) und werden ausschließlich
über die Backend-REST-API gelesen/geschrieben. Im Browser (`localStorage`/Cookie) liegt nur noch der
Auth-Zustand (Token, E-Mail, Rolle), keine Task-Daten mehr.
