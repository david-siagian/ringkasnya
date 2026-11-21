export type BookCategory =
  | "Kebiasaan & Produktivitas"
  | "Keuangan & Bisnis"
  | "Psikologi & Mindset"
  | "Kreativitas & Karier"
  | "Sains & Alam Semesta"
  | "Sejarah & Masyarakat";

export interface BookTakeaway {
  number: number;
  title: string;
  quickSummary: string;
  deepContent: string[];
  practicalTip: string;
}

export interface BookSummary {
  slug: string;
  title: string;
  originalTitle?: string;
  author: string;
  year: number;
  category: BookCategory;
  readingTimeMinutes: number;
  quickTimeMinutes: number;
  rating: number;
  coverGradient: string;
  coverAccent: string;
  coverImage?: string;
  badgeText: string;
  tagline: string;
  synopsis: string;
  whoIsItFor: string[];
  keyTakeaways: BookTakeaway[];
  actionChecklist: string[];
  quotes: string[];
  conclusion: string;
}

/**
 * Metadata ringan buku untuk daftar katalog, preview modal, dan rekomendasi
 * agar konten panjang (`keyTakeaways`, `actionChecklist`, `quotes`, `conclusion`)
 * tidak ikut ter-serialize ke HTML halaman beranda/katalog.
 */
export interface BookCatalogItem
  extends Omit<
    BookSummary,
    "keyTakeaways" | "actionChecklist" | "quotes" | "conclusion"
  > {
  takeawaysCount: number;
}
