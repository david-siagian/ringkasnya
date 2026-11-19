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

export const BOOKS: BookSummary[] = [
  atomicHabits,
  psychologyOfMoney,
  deepWork,
  showYourWork,
  filosofiTeras,
  essentialism,
];

export function getBookBySlug(slug: string): BookSummary | undefined {
  return BOOKS.find((book) => book.slug === slug);
}
