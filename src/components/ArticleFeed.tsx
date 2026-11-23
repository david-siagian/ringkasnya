import { useState } from "react";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import {
  ARTICLE_FORMATS,
  type ArticleFeedItem,
  type ArticleFormat,
} from "@/types/article";

interface ArticleFeedProps {
  items: ArticleFeedItem[];
}

type FilterValue = "semua" | ArticleFormat;

export default function ArticleFeed({ items }: ArticleFeedProps) {
  const [selectedFormat, setSelectedFormat] = useState<FilterValue>("semua");

  const filteredItems =
    selectedFormat === "semua"
      ? items
      : items.filter((item) => item.format === selectedFormat);

  const activeFormatMeta =
    selectedFormat === "semua"
      ? undefined
      : ARTICLE_FORMATS.find((format) => format.id === selectedFormat);

  const showFeatured =
    selectedFormat === "semua" && filteredItems.length > 1;
  const featuredItem = showFeatured ? filteredItems[0] : undefined;
  const gridItems = showFeatured ? filteredItems.slice(1) : filteredItems;

  const pillBaseClass =
    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 sm:text-sm";
  const pillActiveClass =
    "border-accent-strong bg-accent-strong text-white shadow-xs";
  const pillInactiveClass =
    "border-line bg-surface text-ink-secondary hover:border-accent-line hover:bg-accent-soft/60 hover:text-accent-text";

  return (
    <div className="mt-7 sm:mt-8">
      {/* Filter Pills Rubrik */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter rubrik artikel"
          className="flex flex-wrap items-center justify-center gap-2 sm:justify-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedFormat === "semua"}
            onClick={() => setSelectedFormat("semua")}
            className={`${pillBaseClass} ${
              selectedFormat === "semua" ? pillActiveClass : pillInactiveClass
            }`}
          >
            <span>Semua</span>
            <span
              className={`text-[11px] ${
                selectedFormat === "semua" ? "text-white/80" : "text-ink-subtle"
              }`}
            >
              {items.length}
            </span>
          </button>

          {ARTICLE_FORMATS.map((format) => {
            const isActive = selectedFormat === format.id;
            const count = items.filter((item) => item.format === format.id).length;
            return (
              <button
                key={format.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedFormat(format.id)}
                className={`${pillBaseClass} ${
                  isActive ? pillActiveClass : pillInactiveClass
                }`}
              >
                <span>{format.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[11px] ${
                      isActive ? "text-white/80" : "text-ink-subtle"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs font-medium text-ink-subtle sm:text-right">
          Menampilkan {filteredItems.length} artikel
        </p>
      </div>

      {/* Daftar Artikel atau Empty State "Akan Segera Hadir" */}
      {filteredItems.length > 0 ? (
        <section aria-label="Daftar Artikel" className="mt-7 space-y-6 sm:mt-8">
          {featuredItem && (
            <a
              href={`/artikel/${featuredItem.slug}`}
              className="group flex flex-col items-stretch overflow-hidden rounded-2xl border border-accent-line/90 bg-gradient-to-br from-accent-soft/90 via-surface to-warm-soft/50 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 md:flex-row"
            >
              {featuredItem.coverImage && (
                <div
                  className={`flex w-full shrink-0 items-center justify-center bg-slate-900 bg-gradient-to-br ${featuredItem.coverGradient} p-6 sm:p-8 md:w-72 lg:w-80`}
                >
                  <div className="relative aspect-square w-40 overflow-hidden rounded-xl bg-black/20 shadow-[0_18px_36px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/25 sm:w-48 md:w-52">
                    <img
                      src={featuredItem.coverImage}
                      alt={`Ilustrasi artikel ${featuredItem.title}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-7">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-accent-line bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-text">
                      Artikel Pilihan
                    </span>
                    <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                      {featuredItem.accentBadge}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                    {featuredItem.originLabel}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold leading-snug tracking-tight text-ink group-hover:text-accent-text sm:text-3xl">
                    {featuredItem.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1 font-medium text-ink-secondary">
                      <Clock className="h-3.5 w-3.5 text-accent-strong" />
                      {featuredItem.readingTimeMinutes} menit baca
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-ink-faint" />
                      {featuredItem.category}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {featuredItem.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line-subtle pt-4 text-xs font-semibold text-accent-text group-hover:text-accent-strong sm:text-sm">
                  <span>Baca Artikel Lengkap</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          )}

          {gridItems.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {gridItems.map((article) => (
                <a
                  key={article.slug}
                  href={`/artikel/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line/90 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent-line hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                >
                  {article.coverImage && (
                    <div className="p-3 pb-0">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-950 shadow-sm ring-1 ring-line/70">
                        <img
                          src={article.coverImage}
                          alt={`Ilustrasi ${article.title}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <span className="inline-block max-w-full truncate rounded-full bg-surface-subtle px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
                        {article.category}
                      </span>

                      <p className="mt-2.5 truncate text-[11px] font-semibold uppercase tracking-widest text-ink-subtle">
                        {article.accentBadge}
                      </p>
                      <h2 className="mt-1 line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent-text sm:text-lg">
                        {article.title}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted sm:text-sm">
                        {article.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-line-subtle pt-3 text-xs text-ink-subtle">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-ink-faint" />
                        <span>{article.readingTimeMinutes} menit baca</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-strong" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section
          aria-live="polite"
          className="mt-7 rounded-2xl border border-dashed border-line bg-surface/70 px-6 py-12 text-center sm:mt-8 sm:px-10 sm:py-14"
        >
          <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-line bg-accent-soft text-accent-strong">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            {activeFormatMeta
              ? `${activeFormatMeta.label} Akan Segera Hadir`
              : "Artikel Akan Segera Hadir"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            {activeFormatMeta?.comingSoonDescription ??
              "Artikel untuk rubrik ini sedang kami siapkan."}
          </p>
          <button
            type="button"
            onClick={() => setSelectedFormat("semua")}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent-line bg-accent-soft px-4 py-2 text-xs font-semibold text-accent-text transition hover:border-accent-strong hover:bg-accent-strong hover:text-white"
          >
            <span>Lihat Artikel yang Tersedia</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>
      )}
    </div>
  );
}
