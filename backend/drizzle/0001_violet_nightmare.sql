ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;