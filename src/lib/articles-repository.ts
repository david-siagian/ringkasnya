import type {
  Article,
  ArticleFeedItem,
  ArticleFormat,
  ArticleSection,
  ArticleTermEntry,
} from "@/types/article";

interface ArticleFeedRow {
  slug: string;
  title: string;
  subtitle: string;
  format: string;
  published_at: string;
  cover_image: string | null;
  cover_gradient: string;
  accent_badge: string;
  origin_label: string;
}

interface ArticleTermRow {
  slug: string;
  term: string;
  aliases_json: string;
  reading_time_minutes: number;
  short_definition: string;
  origin_label: string;
}

interface ArticleFullRow extends ArticleFeedRow, ArticleTermRow {
  related_book_slugs_json: string;
  lead_paragraph: string;
  sections_json: string;
  key_takeaways_json: string;
}

function safeParseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toArticleFormat(value: string): ArticleFormat {
  if (
    value === "bedah-istilah" ||
    value === "lintas-buku" ||
    value === "sains-aktual" ||
    value === "kisah-eksperimen"
  ) {
    return value;
  }
  return "bedah-istilah";
}

function mapRowToFeedItem(row: ArticleFeedRow): ArticleFeedItem {
  const item: ArticleFeedItem = {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    format: toArticleFormat(row.format),
    publishedAt: row.published_at,
    coverGradient: row.cover_gradient,
    accentBadge: row.accent_badge,
    originLabel: row.origin_label,
  };

  if (row.cover_image) {
    item.coverImage = row.cover_image;
  }

  return item;
}

function mapRowToTermEntry(row: ArticleTermRow): ArticleTermEntry {
  return {
    slug: row.slug,
    term: row.term,
    aliases: safeParseJson<string[]>(row.aliases_json, []),
    readingTimeMinutes: row.reading_time_minutes,
    shortDefinition: row.short_definition,
    originLabel: row.origin_label,
  };
}

function mapRowToArticle(row: ArticleFullRow): Article {
  const feedBase = mapRowToFeedItem(row);
  const termBase = mapRowToTermEntry(row);

  return {
    ...feedBase,
    ...termBase,
    relatedBookSlugs: safeParseJson<string[]>(row.related_book_slugs_json, []),
    leadParagraph: row.lead_paragraph,
    sections: safeParseJson<ArticleSection[]>(row.sections_json, []),
    keyTakeaways: safeParseJson<string[]>(row.key_takeaways_json, []),
  };
}

export async function getArticleFeed(
  db: D1Database | undefined
): Promise<ArticleFeedItem[]> {
  if (!db) return [];

  const { results } = await db
    .prepare(
      `SELECT
         slug,
         title,
         subtitle,
         format,
         published_at,
         cover_image,
         cover_gradient,
         accent_badge,
         origin_label
       FROM articles
       WHERE is_published = 1
       ORDER BY published_at DESC, sort_order DESC, title ASC`
    )
    .all<ArticleFeedRow>();

  return (results ?? []).map(mapRowToFeedItem);
}

export async function getArticleBySlug(
  db: D1Database | undefined,
  slug: string
): Promise<Article | null> {
  if (!db || !slug) return null;

  const row = await db
    .prepare(
      `SELECT
         a.slug,
         a.title,
         a.subtitle,
         a.term,
         a.aliases_json,
         a.format,
         a.reading_time_minutes,
         a.short_definition,
         a.origin_label,
         a.cover_gradient,
         a.cover_image,
         a.accent_badge,
         a.published_at,
         a.related_book_slugs_json,
         c.lead_paragraph,
         c.sections_json,
         c.key_takeaways_json
       FROM articles a
       INNER JOIN article_contents c ON c.article_slug = a.slug
       WHERE a.slug = ? AND a.is_published = 1
       LIMIT 1`
    )
    .bind(slug)
    .first<ArticleFullRow>();

  return row ? mapRowToArticle(row) : null;
}

export async function getArticleTerms(
  db: D1Database | undefined
): Promise<ArticleTermEntry[]> {
  if (!db) return [];

  const { results } = await db
    .prepare(
      `SELECT
         slug,
         term,
         aliases_json,
         reading_time_minutes,
         short_definition,
         origin_label
       FROM articles
       WHERE is_published = 1
       ORDER BY published_at DESC, sort_order DESC, title ASC`
    )
    .all<ArticleTermRow>();

  return (results ?? []).map(mapRowToTermEntry);
}
