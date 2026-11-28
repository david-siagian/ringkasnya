import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BookCatalogItem } from "@/types/book";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArrowRight, Bookmark, BookOpen, CheckCircle2, Clock, Target, X, Zap } from "lucide-react";

interface BookPreviewModalProps {
  book: BookCatalogItem | null;
  onClose: () => void;
}

export default function BookPreviewModal({
  book,
  onClose,
}: BookPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
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

  const saved = isBookmarked(book.slug);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md dark:bg-black/75"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-book-title"
    >
      <div
        className="animate-fade-slide relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl ring-1 ring-line"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Bookmark & X tetap fixed di pojok kanan atas card */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(book.slug);
            }}
            aria-label={
              saved
                ? `Hapus ${book.title} dari daftar tersimpan`
                : `Simpan ${book.title} ke daftar favorit`
            }
            aria-pressed={saved}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition focus:outline-none focus:ring-2 focus:ring-white/70 ${
              saved
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-900/50 text-white hover:bg-slate-900/70"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup preview buku"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/50 text-white shadow-sm backdrop-blur-md transition hover:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Header Preview: Buku beserta background gradasinya */}
        <div
          className={`bg-slate-900 bg-gradient-to-br ${book.coverGradient} p-6 sm:p-8 text-white`}
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
            {book.coverImage && (
              <div className="relative aspect-[3/4] w-36 sm:w-40 shrink-0 overflow-hidden rounded-2xl bg-black/20 shadow-[0_18px_36px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/25">
                <img
                  src={book.coverImage}
                  alt={`Ilustrasi sampul buku ${book.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="min-w-0 w-full flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {book.category}
                </span>
              </div>

              <h2
                id="preview-book-title"
                className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                {book.title}
              </h2>
              {book.originalTitle && (
                <p className="mt-1 text-xs sm:text-sm italic text-white/80">
                  {book.originalTitle}
                </p>
              )}

              <p className="mt-2 text-sm sm:text-base font-semibold text-white/95">
                {book.author} • {book.year}
              </p>

              {/* Kecepatan Baca */}
              <div className="mt-4 flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-xl bg-black/25 px-2.5 py-1.5 text-[11px] sm:px-3 sm:text-xs font-semibold text-white backdrop-blur-sm">
                  <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-amber-300" />
                  Mode Kilat: {book.quickTimeMinutes} Mnt
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-xl bg-black/25 px-2.5 py-1.5 text-[11px] sm:px-3 sm:text-xs font-semibold text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-white/85" />
                  Mode Mendalam: {book.readingTimeMinutes} Mnt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sinopsis & Target Pembaca */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent-strong">
            Sinopsis Buku
          </h3>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-ink-secondary">
            {book.synopsis}
          </p>

          <div className="mt-5 rounded-xl border border-line-subtle bg-page p-4 sm:p-5">
            <h4 className="flex items-center gap-2 text-xs font-bold text-ink sm:text-sm">
              <Target className="h-4 w-4 text-accent-strong" />
              Buku Ini Sangat Cocok Untuk:
            </h4>
            <ul className="mt-2.5 space-y-2">
              {book.whoIsItFor.map((target, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-secondary"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                  <span>{target}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        </div>

        {/* Footer Sticky: Tombol Baca selalu terlihat tanpa perlu scroll */}
        <div className="flex shrink-0 justify-center border-t border-line-subtle bg-surface px-6 py-4 sm:px-8 sm:py-5">
          <a
            href={`/buku/${book.slug}`}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98]"
          >
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Baca</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
