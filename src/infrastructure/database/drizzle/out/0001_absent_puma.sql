CREATE TABLE `shiba_submission_v2` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`image_ref` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user_v2`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shiba_submission_v2_image_ref_unique` ON `shiba_submission_v2` (`image_ref`);