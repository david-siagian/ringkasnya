export type BookCategory =
  | "Sains & Nalar Ilmiah"
  | "Psikologi & Perilaku"
  | "Sejarah & Peradaban"
  | "Filsafat & Kebijaksanaan"
  | "Ekonomi & Keuangan"
  | "Organisasi & Bisnis"
  | "Karier & Budaya Kerja"
  | "Produktivitas & Pengembangan Diri";

export interface BookKeyConcept {
  title: string;
  explanation: string;
}

export interface BookTakeaway {
  number: number;
  title: string;
  quickSummary: string;
  deepContent: string[];
  keyNote: string;
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
  goodreadsRatings: number;
  coverGradient: string;
  coverAccent: string;
  coverImage?: string;
  badgeText: string;
  tagline: string;
  synopsis: string;
  whoIsItFor: string[];
  keyTakeaways: BookTakeaway[];
  keyConcepts: BookKeyConcept[];
  quotes: string[];
  conclusion: string;
}

/**
 * Metadata ringan buku untuk daftar katalog, preview modal, dan rekomendasi
 * agar konten panjang (`keyTakeaways`, `keyConcepts`, `quotes`, `conclusion`)
 * tidak ikut ter-serialize ke HTML halaman beranda/katalog.
 */
export interface BookCatalogItem
  extends Omit<
    BookSummary,
    "keyTakeaways" | "keyConcepts" | "quotes" | "conclusion"
  > {
  takeawaysCount: number;
}
