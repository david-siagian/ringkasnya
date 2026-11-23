-- Fase 3.1: Tabel Autentikasi User, Sesi, Akun OAuth/Credential, Verifikasi,
-- Progres Baca (Fase 3.2), dan Langganan (Fase 3.3)

CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT 0 NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_users_email` ON `users` (`email`);

CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_sessions_token` ON `sessions` (`token`);
CREATE INDEX IF NOT EXISTS `idx_sessions_user_id` ON `sessions` (`user_id`);
CREATE INDEX IF NOT EXISTS `idx_sessions_expires_at` ON `sessions` (`expires_at`);

CREATE TABLE IF NOT EXISTS `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`password` text,
	`access_token` text,
	`refresh_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`id_token` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_accounts_provider_account` ON `accounts` (`provider_id`, `account_id`);
CREATE INDEX IF NOT EXISTS `idx_accounts_user_id` ON `accounts` (`user_id`);

CREATE TABLE IF NOT EXISTS `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

CREATE INDEX IF NOT EXISTS `idx_verifications_identifier` ON `verifications` (`identifier`);

-- Fase 3.2: Sinkronisasi progres baca, bookmark, & action checklist
CREATE TABLE IF NOT EXISTS `user_book_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`book_slug` text NOT NULL,
	`is_bookmarked` integer DEFAULT 0 NOT NULL,
	`last_mode` text DEFAULT 'quick' NOT NULL,
	`progress_percent` integer DEFAULT 0 NOT NULL,
	`checklist_json` text DEFAULT '[]' NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_progress_user_book` ON `user_book_progress` (`user_id`, `book_slug`);
CREATE INDEX IF NOT EXISTS `idx_progress_user_id` ON `user_book_progress` (`user_id`);

-- Fase 3.3: Fondasi monetisasi & Payment Gateway
CREATE TABLE IF NOT EXISTS `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan_code` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_provider` text NOT NULL,
	`external_id` text NOT NULL,
	`current_period_start` integer,
	`current_period_end` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `idx_subscriptions_user_id` ON `subscriptions` (`user_id`);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_subscriptions_external_id` ON `subscriptions` (`external_id`);
