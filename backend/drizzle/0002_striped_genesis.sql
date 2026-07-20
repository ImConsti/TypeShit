ALTER TABLE "tasks" ALTER COLUMN "title" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "description" SET DATA TYPE varchar(5000);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "pinned";