-- Migrasi 0001: Skema 2 tabel (vertical partitioning) untuk katalog dan konten buku Ringkasnya
-- Tabel `books` menyimpan metadata katalog ringan untuk /, /katalog, /topik, /tentang, dan rekomendasi.
-- Tabel `book_contents` menyimpan payload baca panjang yang hanya di-JOIN pada halaman /buku/[slug].

CREATE TABLE IF NOT EXISTS books (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  original_title TEXT,
  author TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  reading_time_minutes INTEGER NOT NULL,
  quick_time_minutes INTEGER NOT NULL,
  rating REAL NOT NULL,
  goodreads_ratings INTEGER NOT NULL DEFAULT 0,
  editorial_tier INTEGER NOT NULL DEFAULT 2 CHECK (editorial_tier IN (1, 2, 3)),
  cover_gradient TEXT NOT NULL,
  cover_accent TEXT NOT NULL,
  cover_image TEXT,
  badge_text TEXT NOT NULL,
  tagline TEXT NOT NULL,
  synopsis TEXT NOT NULL,
  who_is_it_for_json TEXT NOT NULL,
  takeaways_count INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  is_premium INTEGER NOT NULL DEFAULT 0 CHECK (is_premium IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS book_contents (
  book_slug TEXT PRIMARY KEY REFERENCES books(slug) ON DELETE CASCADE,
  key_takeaways_json TEXT NOT NULL,
  key_concepts_json TEXT NOT NULL,
  quotes_json TEXT NOT NULL,
  conclusion TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_books_catalog_order
  ON books (is_published, editorial_tier ASC, goodreads_ratings DESC, rating DESC, title ASC);

CREATE INDEX IF NOT EXISTS idx_books_category
  ON books (is_published, category);
