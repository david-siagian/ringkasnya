import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const ROOT_DIR = process.cwd();
const OUTPUT_SQL = path.join(ROOT_DIR, "scripts", "seed-books.sql");

function sqlString(value) {
  if (value === undefined || value === null) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }
  return String(num);
}

async function main() {
  const result = await build({
    entryPoints: [path.join(ROOT_DIR, "src", "data", "books.ts")],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    alias: {
      "@": path.join(ROOT_DIR, "src"),
    },
    logLevel: "silent",
  });

  const code = result.outputFiles[0].text;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(code, "utf8").toString("base64")}`;
  const mod = await import(dataUrl);
  const books = mod.BOOKS;
  const secondaryCategories = mod.SECONDARY_CATALOG_CATEGORIES;

  if (!Array.isArray(books) || books.length === 0) {
    throw new Error("BOOKS export is empty or missing.");
  }

    const lines = [
      "-- Auto-generated idempotent seed file for Cloudflare D1 (books + book_contents)",
      `-- Generated at: ${new Date().toISOString()}`,
      `-- Total books: ${books.length}`,
      "",
    ];

    for (const book of books) {
      const effectiveTier = secondaryCategories.has(book.category)
        ? 3
        : book.editorialTier;

      lines.push(
        `INSERT INTO books (
  slug, title, original_title, author, year, category,
  reading_time_minutes, quick_time_minutes, rating, goodreads_ratings,
  editorial_tier, cover_gradient, cover_accent, cover_image,
  badge_text, tagline, synopsis, who_is_it_for_json, takeaways_count,
  is_published, is_premium, updated_at
) VALUES (
  ${sqlString(book.slug)},
  ${sqlString(book.title)},
  ${sqlString(book.originalTitle ?? null)},
  ${sqlString(book.author)},
  ${sqlNumber(book.year)},
  ${sqlString(book.category)},
  ${sqlNumber(book.readingTimeMinutes)},
  ${sqlNumber(book.quickTimeMinutes)},
  ${sqlNumber(book.rating)},
  ${sqlNumber(book.goodreadsRatings)},
  ${sqlNumber(effectiveTier)},
  ${sqlString(book.coverGradient)},
  ${sqlString(book.coverAccent)},
  ${sqlString(book.coverImage ?? null)},
  ${sqlString(book.badgeText)},
  ${sqlString(book.tagline)},
  ${sqlString(book.synopsis)},
  ${sqlString(JSON.stringify(book.whoIsItFor))},
  ${sqlNumber(book.keyTakeaways.length)},
  1,
  0,
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  original_title = excluded.original_title,
  author = excluded.author,
  year = excluded.year,
  category = excluded.category,
  reading_time_minutes = excluded.reading_time_minutes,
  quick_time_minutes = excluded.quick_time_minutes,
  rating = excluded.rating,
  goodreads_ratings = excluded.goodreads_ratings,
  editorial_tier = excluded.editorial_tier,
  cover_gradient = excluded.cover_gradient,
  cover_accent = excluded.cover_accent,
  cover_image = excluded.cover_image,
  badge_text = excluded.badge_text,
  tagline = excluded.tagline,
  synopsis = excluded.synopsis,
  who_is_it_for_json = excluded.who_is_it_for_json,
  takeaways_count = excluded.takeaways_count,
  updated_at = datetime('now');`
      );

      lines.push(
        `INSERT INTO book_contents (
  book_slug, key_takeaways_json, key_concepts_json, quotes_json, conclusion, updated_at
) VALUES (
  ${sqlString(book.slug)},
  ${sqlString(JSON.stringify(book.keyTakeaways))},
  ${sqlString(JSON.stringify(book.keyConcepts))},
  ${sqlString(JSON.stringify(book.quotes))},
  ${sqlString(book.conclusion)},
  datetime('now')
)
ON CONFLICT(book_slug) DO UPDATE SET
  key_takeaways_json = excluded.key_takeaways_json,
  key_concepts_json = excluded.key_concepts_json,
  quotes_json = excluded.quotes_json,
  conclusion = excluded.conclusion,
  updated_at = datetime('now');`
      );

      lines.push("");
    }

    await fs.writeFile(OUTPUT_SQL, lines.join("\n"), "utf8");
    const stats = await fs.stat(OUTPUT_SQL);
    console.log(
      `Generated ${OUTPUT_SQL} for ${books.length} books (${(stats.size / 1024).toFixed(1)} KiB).`
    );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
