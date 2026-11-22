import type {
  BookSummary,
  BookCatalogItem,
  BookCategory,
  BookEditorialTier,
} from "@/types/book";
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
import { whatEvolutionIs } from "./books/what-evolution-is";
import { origins } from "./books/origins";
import { barkingUpTheWrongTree } from "./books/barking-up-the-wrong-tree";
import { whyIsSexFun } from "./books/why-is-sex-fun";
import { theOriginOfHumankind } from "./books/the-origin-of-humankind";
import { theJoyOfScience } from "./books/the-joy-of-science";
import { shadowsOfForgottenAncestors } from "./books/shadows-of-forgotten-ancestors";
import { outlive } from "./books/outlive";
import { enlightenmentNow } from "./books/enlightenment-now";
import { quiet } from "./books/quiet";
import { aGuideToTheGoodLife } from "./books/a-guide-to-the-good-life";
import { greatAtWork } from "./books/great-at-work";
import { goodToGreat } from "./books/good-to-great";
import { hiddenPotential } from "./books/hidden-potential";
import { theDeathOfExpertise } from "./books/the-death-of-expertise";
import { aBriefHistoryOfTime } from "./books/a-brief-history-of-time";
import { predictablyIrrational } from "./books/predictably-irrational";
import { influence } from "./books/influence";
import { mindset } from "./books/mindset";
import { grit } from "./books/grit";
import { outliers } from "./books/outliers";
import { neverSplitTheDifference } from "./books/never-split-the-difference";
import { theSubtleArtOfNotGivingAFck } from "./books/the-subtle-art-of-not-giving-a-fck";
import { meditations } from "./books/meditations";
import { ikigai } from "./books/ikigai";
import { gettingThingsDone } from "./books/getting-things-done";
import { makeTime } from "./books/make-time";
import { theAlmanackOfNavalRavikant } from "./books/the-almanack-of-naval-ravikant";
import { richDadPoorDad } from "./books/rich-dad-poor-dad";
import { theRichestManInBabylon } from "./books/the-richest-man-in-babylon";
import { theLeanStartup } from "./books/the-lean-startup";
import { startWithWhy } from "./books/start-with-why";
import { stealLikeAnArtist } from "./books/steal-like-an-artist";

export const CATEGORIES: BookCategory[] = [
  "Sains & Alam Semesta",
  "Nalar & Berpikir Kritis",
  "Psikologi & Perilaku",
  "Sejarah & Peradaban",
  "Filsafat & Kebijaksanaan",
  "Ekonomi & Keuangan",
  "Organisasi & Bisnis",
  "Kesehatan & Medis",
  "Karier & Budaya Kerja",
  "Produktivitas & Pengembangan Diri",
];

export const SECONDARY_CATALOG_CATEGORIES: ReadonlySet<BookCategory> = new Set([
  "Organisasi & Bisnis",
  "Karier & Budaya Kerja",
  "Produktivitas & Pengembangan Diri",
]);

function getEffectiveEditorialTier(book: BookSummary): BookEditorialTier {
  if (SECONDARY_CATALOG_CATEGORIES.has(book.category)) {
    return 3;
  }
  return book.editorialTier;
}

function compareBooksForCatalog(a: BookSummary, b: BookSummary): number {
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
  whatEvolutionIs,
  origins,
  barkingUpTheWrongTree,
  whyIsSexFun,
  theOriginOfHumankind,
  theJoyOfScience,
  shadowsOfForgottenAncestors,
  outlive,
  enlightenmentNow,
  quiet,
  aGuideToTheGoodLife,
  greatAtWork,
  goodToGreat,
  hiddenPotential,
  theDeathOfExpertise,
  aBriefHistoryOfTime,
  predictablyIrrational,
  influence,
  mindset,
  grit,
  outliers,
  neverSplitTheDifference,
  theSubtleArtOfNotGivingAFck,
  meditations,
  ikigai,
  gettingThingsDone,
  makeTime,
  theAlmanackOfNavalRavikant,
  richDadPoorDad,
  theRichestManInBabylon,
  theLeanStartup,
  startWithWhy,
  stealLikeAnArtist,
].map(withCalculatedReadingTimes).sort(compareBooksForCatalog);

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
