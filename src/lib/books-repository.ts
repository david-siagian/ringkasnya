import type {
  BookCatalogItem,
  BookCategory,
  BookEditorialTier,
  BookKeyConcept,
  BookSummary,
  BookTakeaway,
} from "@/types/book";

export const PUBLIC_PAGE_CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=3600";

interface BookRow {
  slug: string;
  title: string;
  original_title: string | null;
  author: string;
  year: number;
  category: string;
  reading_time_minutes: number;
  quick_time_minutes: number;
  rating: number;
  goodreads_ratings: number;
  editorial_tier: number;
  cover_gradient: string;
  cover_accent: string;
  cover_image: string | null;
  badge_text: string;
  tagline: string;
  synopsis: string;
  who_is_it_for_json: string;
  takeaways_count: number;
}

interface BookFullRow extends BookRow {
  key_takeaways_json: string;
  key_concepts_json: string;
  quotes_json: string;
  conclusion: string;
}

function safeParseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toEditorialTier(value: number): BookEditorialTier {
  if (value === 1 || value === 2 || value === 3) {
    return value;
  }
  return 2;
}

function mapRowToCatalogItem(row: BookRow): BookCatalogItem {
  const item: BookCatalogItem = {
    slug: row.slug,
    title: row.title,
    author: row.author,
    year: row.year,
    category: row.category as BookCategory,
    readingTimeMinutes: row.reading_time_minutes,
    quickTimeMinutes: row.quick_time_minutes,
    rating: row.rating,
    goodreadsRatings: row.goodreads_ratings,
    editorialTier: toEditorialTier(row.editorial_tier),
    coverGradient: row.cover_gradient,
    coverAccent: row.cover_accent,
    badgeText: row.badge_text,
    tagline: row.tagline,
    synopsis: row.synopsis,
    whoIsItFor: safeParseJson<string[]>(row.who_is_it_for_json, []),
    takeawaysCount: row.takeaways_count,
  };

  if (row.original_title) {
    item.originalTitle = row.original_title;
  }
  if (row.cover_image) {
    item.coverImage = row.cover_image;
  }

  return item;
}

function mapRowToBookSummary(row: BookFullRow): BookSummary {
  const { takeawaysCount: _takeawaysCount, ...catalogBase } =
    mapRowToCatalogItem(row);

  return {
    ...catalogBase,
    keyTakeaways: safeParseJson<BookTakeaway[]>(row.key_takeaways_json, []),
    keyConcepts: safeParseJson<BookKeyConcept[]>(row.key_concepts_json, []),
    quotes: safeParseJson<string[]>(row.quotes_json, []),
    conclusion: row.conclusion,
  };
}

const CATALOG_SELECT_COLUMNS = `
  slug,
  title,
  original_title,
  author,
  year,
  category,
  reading_time_minutes,
  quick_time_minutes,
  rating,
  goodreads_ratings,
  editorial_tier,
  cover_gradient,
  cover_accent,
  cover_image,
  badge_text,
  tagline,
  synopsis,
  who_is_it_for_json,
  takeaways_count
`;

export async function getBookCatalog(
  db: D1Database | undefined
): Promise<BookCatalogItem[]> {
  if (!db) return [];

  const { results } = await db
    .prepare(
      `SELECT ${CATALOG_SELECT_COLUMNS}
       FROM books
       WHERE is_published = 1
       ORDER BY editorial_tier ASC, goodreads_ratings DESC, rating DESC, title ASC`
    )
    .all<BookRow>();

  return (results ?? []).map(mapRowToCatalogItem);
}

export async function getBookBySlug(
  db: D1Database | undefined,
  slug: string
): Promise<BookSummary | null> {
  if (!db || !slug) return null;

  const row = await db
    .prepare(
      `SELECT
         b.slug,
         b.title,
         b.original_title,
         b.author,
         b.year,
         b.category,
         b.reading_time_minutes,
         b.quick_time_minutes,
         b.rating,
         b.goodreads_ratings,
         b.editorial_tier,
         b.cover_gradient,
         b.cover_accent,
         b.cover_image,
         b.badge_text,
         b.tagline,
         b.synopsis,
         b.who_is_it_for_json,
         b.takeaways_count,
         c.key_takeaways_json,
         c.key_concepts_json,
         c.quotes_json,
         c.conclusion
       FROM books b
       INNER JOIN book_contents c ON c.book_slug = b.slug
       WHERE b.slug = ? AND b.is_published = 1
       LIMIT 1`
    )
    .bind(slug)
    .first<BookFullRow>();

  return row ? mapRowToBookSummary(row) : null;
}

export async function getPublishedBookCount(
  db: D1Database | undefined
): Promise<number> {
  if (!db) return 0;

  const row = await db
    .prepare(`SELECT COUNT(*) AS total FROM books WHERE is_published = 1`)
    .first<{ total: number }>();

  return Number(row?.total ?? 0);
}
