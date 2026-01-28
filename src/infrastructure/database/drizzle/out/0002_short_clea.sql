ALTER TABLE `session_v2` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `user_v2` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `user_v2` ADD `banned` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `user_v2` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `user_v2` ADD `ban_expires` integer;