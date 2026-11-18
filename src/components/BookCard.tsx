import Link from "next/link";
import { BookSummary } from "@/types/book";
import { ArrowRight, Clock, Layers, Star, Zap } from "lucide-react";

interface BookCardProps {
  book: BookSummary;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/buku/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      {/* Visual Sampul Buku */}
      <div
        className={`relative flex w-full flex-col justify-between bg-slate-900 bg-gradient-to-br ${book.coverGradient} p-5 text-white`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
            {book.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
            {book.rating}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          {book.coverImage && (
            <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-black/20 shadow-[0_12px_24px_-6px_rgba(0,0,0,0.45)] ring-1 ring-white/25">
              <img
                src={book.coverImage}
                alt={`Ilustrasi sampul buku ${book.title}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
              {book.author}
            </p>
            <h3 className="mt-1 text-xl font-extrabold leading-snug tracking-tight text-white drop-shadow-sm">
              {book.title}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/90">
              <span className="inline-flex items-center gap-1 font-medium">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                Kilat {book.quickTimeMinutes} mnt
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {book.readingTimeMinutes} mnt
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Kartu */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${book.coverAccent}`}
            >
              {book.badgeText}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              {book.keyTakeaways.length} Poin Inti
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
            {book.tagline}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs font-semibold text-emerald-700 group-hover:text-emerald-600">
          <span>Baca Ringkasan & Praktek</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
