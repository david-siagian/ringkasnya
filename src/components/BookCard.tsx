import type { BookCatalogItem } from "@/types/book";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { ArrowRight, BookOpen, Bookmark, CheckCircle2, Clock, Layers, Zap } from "lucide-react";

interface BookCardProps {
  book: BookCatalogItem;
  onSelect?: (book: BookCatalogItem) => void;
  compact?: boolean;
}

export default function BookCard({
  book,
  onSelect,
  compact = false,
}: BookCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isCompleted } = useCompletedBooks();
  const { getProgressPercent } = useReadingProgress();
  const saved = isBookmarked(book.slug);
  const completed = isCompleted(book.slug);
  const progressPercent = getProgressPercent(book.slug);
  const inProgress = !completed && progressPercent > 0 && progressPercent < 100;
  return (
    <a
      href={`/buku/${book.slug}`}
      data-no-transition={onSelect ? "true" : undefined}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(book);
        }
      }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line/90 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent-line hover:shadow-lg"
    >
      {/* Sampul Buku Saja (Tanpa Background Warna) */}
      {book.coverImage && (
        <div className={compact ? "p-2.5 sm:p-3 pb-0" : "p-3 sm:p-4 pb-0"}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-line/70">
            <img
              src={book.coverImage}
              alt={`Ilustrasi sampul buku ${book.title}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {completed ? (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3" />
                <span>Selesai</span>
              </span>
            ) : inProgress ? (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-amber-600/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                <BookOpen className="h-3 w-3" />
                <span>Proses • {progressPercent}%</span>
              </span>
            ) : null}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(book.slug);
              }}
              aria-label={
                saved
                  ? `Hapus ${book.title} dari daftar tersimpan`
                  : `Simpan ${book.title} ke daftar favorit`
              }
              aria-pressed={saved}
              className={`absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition ${
                saved
                  ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                  : "bg-black/35 text-white/90 hover:bg-black/55 hover:text-white"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      )}

      {/* Konten Kartu */}
      <div
        className={`flex flex-1 flex-col justify-between ${
          compact ? "p-3 sm:p-4" : "p-3.5 sm:p-5"
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="max-w-full truncate rounded-full bg-surface-subtle px-2 py-0.5 sm:px-2.5 text-[10px] sm:text-[11px] font-medium text-ink-muted">
              {book.category}
            </span>
          </div>

          <p className="mt-2.5 truncate text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-ink-subtle">
            {book.author}
          </p>
          <h3
            className={`mt-0.5 line-clamp-2 font-extrabold leading-snug tracking-tight text-ink group-hover:text-accent-text ${
              compact ? "text-sm sm:text-base" : "text-sm sm:text-lg"
            }`}
          >
            {book.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-ink-subtle">
            <span className="inline-flex items-center gap-1 font-medium text-warm-text">
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
              Kilat {book.quickTimeMinutes} mnt
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ink-faint" />
              {book.readingTimeMinutes} mnt
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-block rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold ${book.coverAccent}`}
            >
              {book.badgeText}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-ink-subtle">
              <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-ink-faint" />
              {book.takeawaysCount} Poin Inti
            </span>
          </div>
        </div>

        <div
          className={`flex items-center justify-between border-t border-line-subtle text-[11px] sm:text-xs font-semibold text-accent-text group-hover:text-accent-strong ${
            compact ? "mt-3 pt-2.5" : "mt-4 sm:mt-5 pt-3"
          }`}
        >
          <span>Baca Ringkasan</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
}
