import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { BookSummary } from "@/types/book";
import { ArrowRight, BookOpen, Clock, Star, X, Zap } from "lucide-react";

interface BookPreviewModalProps {
  book: BookSummary | null;
  onClose: () => void;
}

export default function BookPreviewModal({
  book,
  onClose,
}: BookPreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!book) return;

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
  }, [book, onClose]);

  if (!mounted || !book) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-book-title"
    >
      <div
        className="animate-fade-slide relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol X di pojok kanan atas card */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup preview buku"
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <X className="h-4 w-4" />
        </button>

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
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  {book.rating} / 5.0
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

        {/* Sinopsis & Tombol Baca */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Sinopsis Buku
          </h3>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-700">
            {book.synopsis}
          </p>

          <div className="mt-7 flex justify-center border-t border-slate-100 pt-6">
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
      </div>
    </div>,
    document.body
  );
}
