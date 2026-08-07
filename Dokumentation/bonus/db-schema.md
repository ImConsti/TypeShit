# DB-Schema

Relationales Datenbankschema für das Backend (Express + Drizzle ORM + Postgres/Neon), umgesetzt in
[`backend/src/schema.ts`](../../backend/src/schema.ts) und per `npm run db:generate` / `npm run db:migrate`
auf die Datenbank angewendet.

## Aktuelles Schema

```typescript
import { pgTable, serial, text, varchar, boolean, date, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['Hoch', 'Mittel', 'Niedrig']);

export const users = pgTable('users', {
  id: serial().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: timestamp().notNull().defaultNow(),
  resetToken: text('reset_token'),
  resetTokenExpiry: timestamp('reset_token_expiry'),
});

export const tasks = pgTable('tasks', {
  id: serial().primaryKey(),
  userId: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 300 }).notNull(),
  description: varchar('description', { length: 5000 }).notNull().default(''),
  priority: priorityEnum().notNull(),
  dueDate: date(),
  isDone: boolean().notNull().default(false),
  doneAt: timestamp(),
});
```
