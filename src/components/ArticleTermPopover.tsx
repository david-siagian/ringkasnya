import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, BookOpen, Clock, Sparkles, X } from "lucide-react";
import type { ArticleTermEntry } from "@/types/article";

interface ArticleTermPopoverProps {
  term: ArticleTermEntry | null;
  bookSlug: string;
  onClose: () => void;
}

/**
 * Opsi A: Pratinjau cepat (bottom sheet di mobile, modal ringkas di desktop)
 * saat pembaca mengklik istilah yang disorot di dalam ringkasan buku.
 */
export function ArticleTermPopover({
  term,
  bookSlug,
  onClose,
}: ArticleTermPopoverProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!term) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [term, onClose]);

  if (!mounted || !term) return null;

  const articleHref = `/artikel/${term.slug}?from=${encodeURIComponent(bookSlug)}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[75] flex items-end justify-center bg-slate-900/55 p-0 backdrop-blur-sm sm:items-center sm:p-4 dark:bg-black/75"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-term-popover-title"
    >
      <div
        className="animate-fade-slide relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line-subtle bg-page/60 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-text">
                <Sparkles className="h-3 w-3 text-accent-strong" />
                <span>Bedah Istilah</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
                <Clock className="h-3.5 w-3.5" />
                <span>{term.readingTimeMinutes} mnt baca</span>
              </span>
            </div>

            <h2
              id="article-term-popover-title"
              className="mt-2 text-lg font-extrabold leading-snug text-ink sm:text-xl"
            >
              {term.term}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau istilah"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-muted transition hover:bg-page hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-6">
          <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
            {term.shortDefinition}
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse sm:items-center">
            <a
              href={articleHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98] sm:w-auto sm:flex-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>Baca Artikel Lengkap ({term.readingTimeMinutes} mnt)</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-xl border border-line bg-page px-4 py-2.5 text-sm font-semibold text-ink-secondary transition hover:border-accent-line hover:text-ink sm:w-auto"
            >
              Lanjut Membaca
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
