-- Migrasi 0028: Skema 2 tabel (vertical partitioning) untuk katalog dan konten artikel Ringkasnya
-- Tabel `articles` menyimpan metadata ringan untuk beranda (/), /artikel, dan popover istilah di BookReader.
-- Tabel `article_contents` menyimpan payload baca panjang yang hanya di-JOIN pada halaman /artikel/[slug].

CREATE TABLE IF NOT EXISTS articles (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  term TEXT NOT NULL,
  aliases_json TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('bedah-istilah', 'lintas-buku', 'sains-aktual', 'kisah-eksperimen')),
  reading_time_minutes INTEGER NOT NULL,
  short_definition TEXT NOT NULL,
  origin_label TEXT NOT NULL,
  cover_gradient TEXT NOT NULL,
  cover_image TEXT,
  accent_badge TEXT NOT NULL,
  published_at TEXT NOT NULL,
  related_book_slugs_json TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS article_contents (
  article_slug TEXT PRIMARY KEY REFERENCES articles(slug) ON DELETE CASCADE,
  lead_paragraph TEXT NOT NULL,
  sections_json TEXT NOT NULL,
  key_takeaways_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_articles_published_order
  ON articles (is_published, published_at DESC, sort_order DESC, title ASC);

CREATE INDEX IF NOT EXISTS idx_articles_format
  ON articles (is_published, format);
