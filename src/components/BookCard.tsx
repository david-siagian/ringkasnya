import type { BookSummary } from "@/types/book";
import { ArrowRight, Clock, Layers, Star, Zap } from "lucide-react";

interface BookCardProps {
  book: BookSummary;
  onSelect?: (book: BookSummary) => void;
}

export default function BookCard({ book, onSelect }: BookCardProps) {
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      {/* Sampul Buku Saja (Tanpa Background Warna) */}
      {book.coverImage && (
        <div className="p-3 sm:p-4 pb-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-200/70">
            <img
              src={book.coverImage}
              alt={`Ilustrasi sampul buku ${book.title}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      )}

      {/* Konten Kartu */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="max-w-full truncate rounded-full bg-slate-100 px-2 py-0.5 sm:px-2.5 text-[10px] sm:text-[11px] font-medium text-slate-600">
              {book.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-amber-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {book.rating}
            </span>
          </div>

          <p className="mt-2.5 truncate text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            {book.author}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-sm sm:text-lg font-extrabold leading-snug tracking-tight text-slate-900 group-hover:text-emerald-700">
            {book.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium text-amber-700">
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
              Kilat {book.quickTimeMinutes} mnt
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
              {book.readingTimeMinutes} mnt
            </span>
          </div>

          <div className="mt-2.5 mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-block rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold ${book.coverAccent}`}
            >
              {book.badgeText}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-500">
              <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
              {book.keyTakeaways.length} Poin Inti
            </span>
          </div>

          <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-600">
            {book.tagline}
          </p>
        </div>

        <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] sm:text-xs font-semibold text-emerald-700 group-hover:text-emerald-600">
          <span>Baca Ringkasan</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
}
