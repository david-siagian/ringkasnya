import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Clock, Search, Sparkles, X } from "lucide-react";
import type { Article } from "@/types/article";

export interface ArticleListItem {
  slug: string;
  title: string;
  subtitle: string;
  term: string;
  category: Article["category"];
  readingTimeMinutes: number;
  originLabel: string;
  coverGradient: string;
  accentBadge: string;
  relatedBookTitles: string[];
}

interface ArticleListSectionProps {
  articles: ArticleListItem[];
}

export default function ArticleListSection({
  articles,
}: ArticleListSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.category)));
    return ["Semua", ...unique];
  }, [articles]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!normalized) return true;

      return (
        article.title.toLowerCase().includes(normalized) ||
        article.subtitle.toLowerCase().includes(normalized) ||
        article.originLabel.toLowerCase().includes(normalized) ||
        article.category.toLowerCase().includes(normalized) ||
        article.relatedBookTitles.some((title) =>
          title.toLowerCase().includes(normalized)
        )
      );
    });
  }, [articles, selectedCategory, query]);

  return (
    <div>
      {/* Kontrol Pencarian & Filter Bidang */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah, tokoh, atau buku terkait (mis. Anna Karenina, Dunning-Kruger)..."
            aria-label="Cari artikel"
            className="w-full rounded-xl border border-line bg-page py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-ink-subtle focus:border-accent-strong focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition hover:bg-surface-subtle hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-line bg-page text-ink-secondary hover:border-accent-line hover:text-accent-text"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Artikel */}
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface px-6 py-12 text-center shadow-sm">
          <p className="text-base font-bold text-ink">
            Artikel yang Anda cari belum ditemukan.
          </p>
          <p className="mt-1.5 text-sm text-ink-muted">
            Coba gunakan kata kunci lain atau pilih filter &ldquo;Semua&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("Semua");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <a
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-strong hover:shadow-md"
            >
              {/* Header Editorial */}
              <div
                className={`bg-slate-900 bg-gradient-to-br ${article.coverGradient} p-5 text-white`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold tracking-wide backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 text-emerald-300" />
                    <span>{article.accentBadge}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-0.5 text-[11px] font-medium text-white/90">
                    <Clock className="h-3 w-3" />
                    <span>{article.readingTimeMinutes} mnt</span>
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-extrabold leading-snug tracking-tight">
                  {article.title}
                </h2>
                <p className="mt-1.5 text-xs font-medium text-white/80">
                  {article.originLabel}
                </p>
              </div>

              {/* Konten Kartu */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent-text">
                    {article.category}
                  </span>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-secondary">
                    {article.subtitle}
                  </p>
                </div>

                <div className="mt-5 border-t border-line-subtle pt-4">
                  {article.relatedBookTitles.length > 0 && (
                    <div className="mb-3 flex items-start gap-1.5 text-xs text-ink-muted">
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-strong" />
                      <span className="line-clamp-1">
                        Terkait: {article.relatedBookTitles.join(", ")}
                      </span>
                    </div>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-text transition group-hover:text-accent-strong">
                    <span>Baca Artikel Lengkap</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
