import type { BookSummary, BookCategory } from "@/types/book";
import { atomicHabits } from "./books/atomic-habits";
import { psychologyOfMoney } from "./books/psychology-of-money";
import { deepWork } from "./books/deep-work";
import { showYourWork } from "./books/show-your-work";
import { filosofiTeras } from "./books/filosofi-teras";
import { essentialism } from "./books/essentialism";

export const CATEGORIES: BookCategory[] = [
  "Kebiasaan & Produktivitas",
  "Keuangan & Bisnis",
  "Psikologi & Mindset",
  "Kreativitas & Karier",
];

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
function withCalculatedReadingTimes(book: BookSummary): BookSummary {
  const quickTexts = [
    book.synopsis,
    ...book.whoIsItFor,
    ...book.actionChecklist,
    ...book.quotes,
    book.conclusion,
    ...book.keyTakeaways.flatMap((t) => [
      t.title,
      t.quickSummary,
      t.practicalTip,
    ]),
  ];
  const deepTexts = book.keyTakeaways.flatMap((t) => t.deepContent);

  const quickWords = quickTexts.reduce((sum, text) => sum + countWords(text), 0);
  const deepWords = deepTexts.reduce((sum, text) => sum + countWords(text), 0);

  return {
    ...book,
    quickTimeMinutes: estimateMinutes(quickWords),
    readingTimeMinutes: estimateMinutes(quickWords + deepWords),
  };
}

export const BOOKS: BookSummary[] = [
  atomicHabits,
  psychologyOfMoney,
  deepWork,
  showYourWork,
  filosofiTeras,
  essentialism,
].map(withCalculatedReadingTimes);

export function getBookBySlug(slug: string): BookSummary | undefined {
  return BOOKS.find((book) => book.slug === slug);
}
