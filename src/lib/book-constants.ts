import type {
  BookCatalogItem,
  BookCategory,
  BookEditorialTier,
  BookSummary,
} from "@/types/book";

export const CATEGORIES: BookCategory[] = [
  "Sains & Alam Semesta",
  "Teknologi & Masa Depan",
  "Nalar & Berpikir Kritis",
  "Psikologi & Perilaku",
  "Sejarah & Peradaban",
  "Filsafat & Kebijaksanaan",
  "Ekonomi & Keuangan",
  "Organisasi & Bisnis",
  "Tubuh & Kesehatan",
  "Produktivitas & Pengembangan Diri",
];

export const SECONDARY_CATALOG_CATEGORIES: ReadonlySet<BookCategory> = new Set([
  "Organisasi & Bisnis",
  "Produktivitas & Pengembangan Diri",
]);

export function getEffectiveEditorialTier(
  book: Pick<BookSummary, "category" | "editorialTier">
): BookEditorialTier {
  if (SECONDARY_CATALOG_CATEGORIES.has(book.category)) {
    return 3;
  }
  return book.editorialTier;
}

export function compareBooksForCatalog(
  a: Pick<
    BookSummary,
    "category" | "editorialTier" | "goodreadsRatings" | "rating" | "title"
  >,
  b: Pick<
    BookSummary,
    "category" | "editorialTier" | "goodreadsRatings" | "rating" | "title"
  >
): number {
  const tierA = getEffectiveEditorialTier(a);
  const tierB = getEffectiveEditorialTier(b);
  if (tierA !== tierB) return tierA - tierB;
  if (b.goodreadsRatings !== a.goodreadsRatings) {
    return b.goodreadsRatings - a.goodreadsRatings;
  }
  if (b.rating !== a.rating) return b.rating - a.rating;
  return a.title.localeCompare(b.title);
}

const WORDS_PER_MINUTE = 200;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateMinutes(words: number): number {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Menghitung durasi baca Mode Kilat dan Mode Mendalam secara dinamis
 * berdasarkan jumlah kata aktual pada konten masing-masing buku.
 */
export function withCalculatedReadingTimes(book: BookSummary): BookSummary {
  const quickTexts = [
    book.synopsis,
    ...book.whoIsItFor,
    ...book.keyConcepts.flatMap((c) => [c.title, c.explanation]),
    ...book.quotes,
    book.conclusion,
    ...book.keyTakeaways.flatMap((t) => [
      t.title,
      t.quickSummary,
      t.keyNote,
    ]),
  ];
  const deepTexts = book.keyTakeaways.flatMap((t) => t.deepContent);

  const quickWords = quickTexts.reduce(
    (sum, text) => sum + countWords(text),
    0
  );
  const deepWords = deepTexts.reduce((sum, text) => sum + countWords(text), 0);

  return {
    ...book,
    quickTimeMinutes: estimateMinutes(quickWords),
    readingTimeMinutes: estimateMinutes(quickWords + deepWords),
  };
}

/**
 * Memproyeksikan data buku penuh menjadi metadata katalog ringan.
 */
export function toBookCatalogItem(book: BookSummary): BookCatalogItem {
  const {
    keyTakeaways: _keyTakeaways,
    keyConcepts: _keyConcepts,
    quotes: _quotes,
    conclusion: _conclusion,
    ...catalogFields
  } = book;

  return {
    ...catalogFields,
    takeawaysCount: _keyTakeaways.length,
  };
}
