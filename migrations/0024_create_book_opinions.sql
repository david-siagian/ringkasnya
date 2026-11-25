-- Fase 3: Tabel Opini Pembaca & Apresiasi Bermanfaat
-- Terhubung ke `books(slug)` dan `users(id)` dengan cascade delete.

CREATE TABLE IF NOT EXISTS `book_opinions` (
  `id` text PRIMARY KEY NOT NULL,
  `book_slug` text NOT NULL,
  `user_id` text NOT NULL,
  `content` text NOT NULL,
  `helpful_count` integer DEFAULT 0 NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`book_slug`) REFERENCES `books`(`slug`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `idx_book_opinions_slug_created`
  ON `book_opinions` (`book_slug`, `created_at` DESC);

CREATE INDEX IF NOT EXISTS `idx_book_opinions_slug_helpful`
  ON `book_opinions` (`book_slug`, `helpful_count` DESC, `created_at` DESC);

CREATE INDEX IF NOT EXISTS `idx_book_opinions_user_id`
  ON `book_opinions` (`user_id`);

CREATE TABLE IF NOT EXISTS `book_opinion_votes` (
  `id` text PRIMARY KEY NOT NULL,
  `opinion_id` text NOT NULL,
  `user_id` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`opinion_id`) REFERENCES `book_opinions`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_opinion_votes_unique`
  ON `book_opinion_votes` (`opinion_id`, `user_id`);

CREATE INDEX IF NOT EXISTS `idx_opinion_votes_user_id`
  ON `book_opinion_votes` (`user_id`);
