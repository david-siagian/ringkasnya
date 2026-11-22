import type { BookCategory } from "@/types/book";

export type ArticleFormat = "bedah-istilah";

export interface ArticleHighlightBox {
  label: string;
  text: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  highlightBox?: ArticleHighlightBox;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  term: string;
  /** Frasa/alias yang otomatis di-highlight di ringkasan buku (case-insensitive, word-boundary). */
  aliases: string[];
  format: ArticleFormat;
  category: BookCategory;
  readingTimeMinutes: number;
  /** Ringkasan 2-3 kalimat untuk pratinjau cepat (Opsi A popover/drawer) di halaman reader buku. */
  shortDefinition: string;
  originLabel: string;
  coverGradient: string;
  coverImage?: string;
  accentBadge: string;
  publishedAt: string;
  relatedBookSlugs: string[];
  leadParagraph: string;
  sections: ArticleSection[];
  keyTakeaways: string[];
}

/** Metadata ringan istilah artikel untuk dipakai di BookReader tanpa membundel isi artikel penuh. */
export interface ArticleTermEntry {
  slug: string;
  term: string;
  aliases: string[];
  category: BookCategory;
  readingTimeMinutes: number;
  shortDefinition: string;
  originLabel: string;
}
