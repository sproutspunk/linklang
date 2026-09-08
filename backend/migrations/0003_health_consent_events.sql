CREATE TABLE `health_consent_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`client_id` integer NOT NULL,
	`action` text NOT NULL,
	`channel` text NOT NULL,
	`language` text NOT NULL,
	`consent_text` text,
	`consent_version` text NOT NULL,
	`privacy_policy_version` text NOT NULL,
	`received_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`recorded_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`admin_id` integer,
	`request_id` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `health_consent_events_request_id_unique` ON `health_consent_events` (`request_id`);
--> statement-breakpoint
CREATE INDEX `health_consent_events_order_id_idx` ON `health_consent_events` (`order_id`);