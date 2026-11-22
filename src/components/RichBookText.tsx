import { Fragment } from "react";
import type { ArticleTermEntry } from "@/types/article";
import { segmentTextWithArticleTerms } from "@/lib/article-terms";

interface RichBookTextProps {
  text: string;
  terms: readonly ArticleTermEntry[];
  onSelectTerm?: (entry: ArticleTermEntry) => void;
  /** Opsional: bagikan Set antar paragraf dalam satu bagian agar tiap istilah hanya disorot pada kemunculan pertama. */
  matchedSlugs?: Set<string>;
}

/**
 * Merender teks ringkasan buku dengan sorotan halus pada istilah yang memiliki Artikel.
 * Klik pada istilah membuka pratinjau cepat (Opsi A) tanpa memutus posisi baca.
 */
export function RichBookText({
  text,
  terms,
  onSelectTerm,
  matchedSlugs,
}: RichBookTextProps) {
  if (!onSelectTerm || terms.length === 0) {
    return <>{text}</>;
  }

  const segments = segmentTextWithArticleTerms(text, terms, matchedSlugs);
  if (segments.length === 1 && segments[0]?.type === "text") {
    return <>{text}</>;
  }

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <Fragment key={index}>{segment.value}</Fragment>
        ) : (
          <button
            key={`${segment.entry.slug}-${index}`}
            type="button"
            onClick={() => onSelectTerm(segment.entry)}
            title={`Lihat penjelasan singkat: ${segment.entry.term}`}
            aria-label={`Lihat penjelasan singkat tentang ${segment.entry.term}`}
            className="inline cursor-pointer rounded-sm px-0.5 -mx-0.5 font-semibold text-ink underline decoration-emerald-500/85 decoration-dotted decoration-2 underline-offset-4 transition-colors hover:bg-accent-soft hover:text-accent-text focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {segment.value}
          </button>
        )
      )}
    </>
  );
}
