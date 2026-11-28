export type ArticleFormat =
  | "bedah-istilah"
  | "lintas-buku"
  | "sains-aktual"
  | "kisah-eksperimen";

export interface ArticleFormatMeta {
  id: ArticleFormat;
  /** Label ringkas maksimal 2 kata untuk pill navigasi. */
  label: string;
  /** Penjelasan singkat yang tampil pada empty state saat rubrik belum terisi. */
  comingSoonDescription: string;
}

export const ARTICLE_FORMATS: readonly ArticleFormatMeta[] = [
  {
    id: "bedah-istilah",
    label: "Bedah Istilah",
    comingSoonDescription:
      "Artikel singkat yang membedah prinsip ilmiah, efek psikologis, dan istilah penting dari buku-buku Ringkasnya.",
  },
  {
    id: "lintas-buku",
    label: "Lintas Buku",
    comingSoonDescription:
      "Sintesis gagasan yang mempertemukan dan membandingkan sudut pandang dari beberapa buku sekaligus untuk satu tema besar.",
  },
  {
    id: "sains-aktual",
    label: "Sains Aktual",
    comingSoonDescription:
      "Membaca fenomena sehari-hari dan isu terkini lewat kacamata sains, ekonomi perilaku, dan riset ilmiah.",
  },
  {
    id: "kisah-eksperimen",
    label: "Kisah Eksperimen",
    comingSoonDescription:
      "Cerita di balik eksperimen legendaris dan pemikir klasik yang mengubah cara manusia memahami dunia.",
  },
] as const;

export interface ArticleFeedItem {
  slug: string;
  title: string;
  subtitle: string;
  format: ArticleFormat;
  publishedAt: string;
  coverImage?: string;
  coverGradient: string;
  accentBadge: string;
  originLabel: string;
}

const INDONESIAN_SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

/** Memformat tanggal ISO `YYYY-MM-DD` menjadi format ringkas Bahasa Indonesia (mis. `22 Nov 2026`). */
export function formatArticlePublishedDate(publishedAt: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(publishedAt.trim());
  if (!match) return publishedAt;
  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const monthLabel = INDONESIAN_SHORT_MONTHS[monthIndex];
  if (!monthLabel || Number.isNaN(day)) return publishedAt;
  return `${day} ${monthLabel} ${year}`;
}

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
  readingTimeMinutes: number;
  shortDefinition: string;
  originLabel: string;
}
