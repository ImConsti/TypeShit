import { pgTable, serial, text, boolean, date, timestamp, pgEnum, integer, varchar } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['Hoch', 'Mittel', 'Niedrig']);

export const users = pgTable('users', {
  id: serial().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password').notNull(),
  role: text('role').notNull().default('user').notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 300 }).notNull(),
  description: varchar('description', { length: 5000 }).notNull().default(''),
  priority: priorityEnum().notNull(),
  dueDate: date(),
  isDone: boolean().notNull().default(false),
  doneAt: timestamp(),
});

