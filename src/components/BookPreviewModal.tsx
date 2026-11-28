import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BookCatalogItem } from "@/types/book";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Target, X, Zap } from "lucide-react";

interface BookPreviewModalProps {
  book: BookCatalogItem | null;
  onClose: () => void;
}

export default function BookPreviewModal({
  book,
  onClose,
}: BookPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  const pushedHistoryRef = useRef(false);

  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      onCloseRef.current();
      window.history.back();
      return;
    }
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!book) {
      pushedHistoryRef.current = false;
      return;
    }

    if (!pushedHistoryRef.current) {
      window.history.pushState(
        { ...(window.history.state ?? {}), bookPreview: book.slug },
        ""
      );
      pushedHistoryRef.current = true;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    const handlePopState = () => {
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
        onCloseRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = prevOverflow;
    };
  }, [book, handleClose]);

  if (!mounted || !book) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md dark:bg-black/75"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-book-title"
    >
      <div
        className="animate-fade-slide relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-line"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol X tetap fixed di pojok kanan atas card */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup preview buku"
          className="absolute right-3.5 top-3.5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/50 text-white shadow-sm backdrop-blur-md transition hover:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Header Preview: Buku beserta background gradasinya */}
        <div
          className={`bg-slate-900 bg-gradient-to-br ${book.coverGradient} p-5 sm:p-6 text-white`}
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            {book.coverImage && (
              <div className="relative aspect-[3/4] w-28 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-black/20 shadow-[0_14px_28px_-6px_rgba(0,0,0,0.45)] ring-1 ring-white/25">
                <img
                  src={book.coverImage}
                  alt={`Ilustrasi sampul buku ${book.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="min-w-0 w-full flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
                  {book.category}
                </span>
              </div>

              <h2
                id="preview-book-title"
                className="mt-2.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl"
              >
                {book.title}
              </h2>
              {book.originalTitle && (
                <p className="mt-0.5 text-xs italic text-white/80">
                  {book.originalTitle}
                </p>
              )}

              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-white/95">
                {book.author} • {book.year}
              </p>

              {/* Kecepatan Baca */}
              <div className="mt-3 flex flex-nowrap items-center justify-center gap-1.5 sm:justify-start">
                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Zap className="h-3 w-3 shrink-0 text-amber-300" />
                  Mode Kilat: {book.quickTimeMinutes} Mnt
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3 shrink-0 text-white/85" />
                  Mode Mendalam: {book.readingTimeMinutes} Mnt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sinopsis & Target Pembaca */}
        <div className="p-5 sm:p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-accent-strong">
            Sinopsis Buku
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-secondary">
            {book.synopsis}
          </p>

          <div className="mt-4 rounded-xl border border-line-subtle bg-page p-3.5 sm:p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-ink">
              <Target className="h-3.5 w-3.5 text-accent-strong" />
              Buku Ini Sangat Cocok Untuk:
            </h4>
            <ul className="mt-2 space-y-1.5">
              {book.whoIsItFor.map((target, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-ink-secondary"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-strong" />
                  <span>{target}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        </div>

        {/* Footer Sticky: Tombol Baca selalu terlihat tanpa perlu scroll */}
        <div className="flex shrink-0 justify-center border-t border-line-subtle bg-surface px-5 py-3.5 sm:px-6 sm:py-4">
          <a
            href={`/buku/${book.slug}`}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-2.5 sm:py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98]"
          >
            <BookOpen className="h-4 w-4" />
            <span>Baca</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
