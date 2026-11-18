export type BookCategory =
  | "Kebiasaan & Produktivitas"
  | "Keuangan & Bisnis"
  | "Psikologi & Mindset"
  | "Kreativitas & Karier";

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
  badgeText: string;
  tagline: string;
  synopsis: string;
  whoIsItFor: string[];
  keyTakeaways: BookTakeaway[];
  actionChecklist: string[];
  quotes: string[];
  conclusion: string;
}
