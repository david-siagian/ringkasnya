import type { BookSummary, BookCatalogItem, BookCategory } from "@/types/book";
import { atomicHabits } from "./books/atomic-habits";
import { psychologyOfMoney } from "./books/psychology-of-money";
import { deepWork } from "./books/deep-work";
import { showYourWork } from "./books/show-your-work";
import { essentialism } from "./books/essentialism";
import { sapiens } from "./books/sapiens";
import { thinkingFastAndSlow } from "./books/thinking-fast-and-slow";
import { theSelfishGene } from "./books/the-selfish-gene";
import { theDemonHauntedWorld } from "./books/the-demon-haunted-world";
import { gunsGermsAndSteel } from "./books/guns-germs-and-steel";
import { whyNationsFail } from "./books/why-nations-fail";
import { whyWeSleep } from "./books/why-we-sleep";
import { howToWinFriendsAndInfluencePeople } from "./books/how-to-win-friends-and-influence-people";
import { nudge } from "./books/nudge";
import { factfulness } from "./books/factfulness";
import { digitalMinimalism } from "./books/digital-minimalism";
import { theShallows } from "./books/the-shallows";
import { mansSearchForMeaning } from "./books/mans-search-for-meaning";
import { the7HabitsOfHighlyEffectivePeople } from "./books/the-7-habits-of-highly-effective-people";
import { freakonomics } from "./books/freakonomics";
import { thinkAgain } from "./books/think-again";
import { theSimplePathToWealth } from "./books/the-simple-path-to-wealth";
import { range } from "./books/range";
import { theGrandDesign } from "./books/the-grand-design";
import { everybodyLies } from "./books/everybody-lies";

export const CATEGORIES: BookCategory[] = [
  "Sains & Nalar Ilmiah",
  "Sejarah & Masyarakat",
  "Ekonomi & Politik",
  "Psikologi & Perilaku",
  "Organisasi & Budaya Kerja",
  "Produktivitas & Pengembangan Diri",
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

  const quickWords = quickTexts.reduce((sum, text) => sum + countWords(text), 0);
  const deepWords = deepTexts.reduce((sum, text) => sum + countWords(text), 0);

  return {
    ...book,
    quickTimeMinutes: estimateMinutes(quickWords),
    readingTimeMinutes: estimateMinutes(quickWords + deepWords),
  };
}

export const BOOKS: BookSummary[] = [
  sapiens,
  thinkingFastAndSlow,
  whyNationsFail,
  theSelfishGene,
  theDemonHauntedWorld,
  gunsGermsAndSteel,
  factfulness,
  whyWeSleep,
  nudge,
  psychologyOfMoney,
  deepWork,
  essentialism,
  atomicHabits,
  howToWinFriendsAndInfluencePeople,
  showYourWork,
  digitalMinimalism,
  theShallows,
  mansSearchForMeaning,
  the7HabitsOfHighlyEffectivePeople,
  freakonomics,
  thinkAgain,
  theSimplePathToWealth,
  range,
  theGrandDesign,
  everybodyLies,
].map(withCalculatedReadingTimes);

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

export const BOOK_CATALOG: BookCatalogItem[] = BOOKS.map(toBookCatalogItem);

export function getBookBySlug(slug: string): BookSummary | undefined {
  return BOOKS.find((book) => book.slug === slug);
}
