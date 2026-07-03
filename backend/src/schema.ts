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
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text().notNull(),
  description: text().notNull().default(''),
  priority: priorityEnum().notNull(),
  dueDate: date(),
  isDone: boolean().notNull().default(false),
  doneAt: timestamp(),
  pinned: boolean().notNull().default(false),
});
