# DB-Schema

Ableitung eines relationalen Datenbankschemas aus [`data-model.md`](./data-model.md) und [`erd.md`](./erd.md) für das Backend (Express + Drizzle ORM + Postgres/Neon).

**Status:** umgesetzt in `backend/src/schema.ts` und per `npm run db:generate` / `npm run db:migrate` auf die Neon-DB angewendet (Migration `0000_flashy_zzzax`).

## Vorheriger Zustand (abgelöst)

- `backend/src/schema.ts` definierte zuvor nur eine minimale `users`-Tabelle (`id`, `name`, `email`).
- `backend/drizzle/0000_plain_amazoness.sql` enthielt zusätzlich `roles`, `permissions`, `role_permissions` sowie `password_hash`/`salt`/`role_id` auf `users` — RBAC-Scaffolding aus einem Test-Commit, das nie tatsächlich auf die DB angewendet wurde (Migrationshistorie war inkonsistent mit dem echten DB-Zustand) und von keinem im Frontend dokumentierten Feature benötigt wird.
- Es gab noch keine `tasks`-Tabelle im Backend; Tasks lagen nur im `localStorage` des Browsers.
- Die alte `users`-Tabelle (0 Zeilen) wurde zusammen mit der veralteten Migrationshistorie zurückgesetzt, bevor das neue Schema angewendet wurde.

## Aktuelles Schema

Nur das abbilden, was `data-model.md` tatsächlich beschreibt: `User (1) ──── (n) Task`.

```typescript
import { pgTable, serial, text, boolean, date, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['Hoch', 'Mittel', 'Niedrig']);

export const users = pgTable('users', {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial().primaryKey(),
  userId: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text().notNull(),
  description: text().notNull().default(''),
  priority: priorityEnum().notNull(),
  dueDate: date(),
  isDone: boolean().notNull().default(false),
  doneAt: timestamp(),
  pinned: boolean().notNull().default(false),
});
```

## Begründung der Abweichungen vom vorherigen Zustand

| Entscheidung | Warum |
|---|---|
| `priority` als Postgres-`enum` statt `text` | Erzwingt die drei erlaubten Werte (`Hoch`/`Mittel`/`Niedrig`) auf DB-Ebene statt nur im Frontend |
| `userId` als FK mit `onDelete: cascade` | Bildet die 1:n-Beziehung aus `erd.md` ab; löscht man einen User, verwaisen keine Tasks |
| `pinned` / `isDone` mit `default(false)` statt nullable | `data-model.md` beschreibt `pinned` als "reserviert, noch nicht genutzt" — ein Default ist ehrlicher als optional/undefined |
| `id` als `serial` statt UUID | `crypto.randomUUID()` war ein localStorage-Artefakt; sobald die DB IDs vergibt, reicht ein einfacher Integer-PK für Joins/Indizes |
| `roles`, `permissions`, `role_permissions` entfernt | Kein Feature in `data-model.md` benötigt RBAC — würde unbenutzte Komplexität einführen |
| `role_id`, `salt` auf `users` entfernt | Nicht Teil des dokumentierten User-Modells; `passwordHash` allein genügt für einfache E-Mail/Passwort-Auth |

## Offene Punkte

- `data-model.md` beschreibt `User.isAuthenticated` als Client-Zustand (kein DB-Feld) — im Schema bewusst weggelassen.
- Es gibt noch keine API-Routen im Backend, die `users`/`tasks` tatsächlich lesen/schreiben (nur `/health` und `/health/db` existieren bisher) — das Frontend nutzt weiterhin `localStorage`.
