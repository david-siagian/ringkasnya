import { useState } from "react";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import {
  ARTICLE_FORMATS,
  formatArticlePublishedDate,
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

  const availableFormats = ARTICLE_FORMATS.map((format) => ({
    ...format,
    count: items.filter((item) => item.format === format.id).length,
  })).filter((format) => format.count > 0);

  const pillBaseClass =
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40";
  const pillActiveClass =
    "border-accent-strong bg-accent-strong text-white";
  const pillInactiveClass =
    "border-line bg-surface text-ink-secondary hover:border-accent-line hover:text-accent-text";

  return (
    <div className="mt-6">
      {/* Filter Pills Rubrik */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter rubrik artikel"
          className="-mx-4 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0"
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

          {availableFormats.map((format) => {
            const isActive = selectedFormat === format.id;
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
                <span
                  className={`text-[11px] ${
                    isActive ? "text-white/80" : "text-ink-subtle"
                  }`}
                >
                  {format.count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="hidden shrink-0 text-right text-xs text-ink-subtle sm:block">
          {filteredItems.length} artikel
        </p>
      </div>

      {/* Daftar Artikel atau Empty State "Akan Segera Hadir" */}
      {filteredItems.length > 0 ? (
        <section
          aria-label="Daftar Artikel"
          className="mt-6 grid grid-cols-1 gap-3.5 md:grid-cols-2 sm:gap-4"
        >
          {filteredItems.map((article) => (
            <a
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className="group flex items-start gap-3.5 rounded-xl border border-line/85 bg-surface p-3.5 transition-colors duration-150 hover:border-accent-line hover:bg-surface-subtle/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 sm:gap-4 sm:p-4"
            >
              {article.coverImage && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-950 ring-1 ring-line/60 sm:h-20 sm:w-20">
                  <img
                    src={article.coverImage}
                    alt={`Ilustrasi ${article.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="truncate font-semibold text-accent-text">
                      {article.accentBadge}
                    </span>
                    <span aria-hidden="true" className="text-ink-faint">
                      •
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-ink-subtle">
                      <Calendar className="h-3 w-3 text-ink-faint" />
                      {formatArticlePublishedDate(article.publishedAt)}
                    </span>
                  </div>

                  <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors group-hover:text-accent-strong sm:text-base">
                    {article.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                    {article.subtitle}
                  </p>
                </div>
              </div>

              <ArrowRight className="mt-1 hidden h-4 w-4 shrink-0 text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-strong sm:block" />
            </a>
          ))}
        </section>
      ) : (
        <section
          aria-live="polite"
          className="mt-6 rounded-xl border border-dashed border-line bg-surface/70 px-6 py-10 text-center sm:px-10 sm:py-12"
        >
          <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent-line bg-accent-soft text-accent-strong">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="mt-3.5 text-base font-bold tracking-tight text-ink sm:text-lg">
            {activeFormatMeta
              ? `${activeFormatMeta.label} Akan Segera Hadir`
              : "Artikel Akan Segera Hadir"}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
            {activeFormatMeta?.comingSoonDescription ??
              "Artikel untuk rubrik ini sedang kami siapkan."}
          </p>
          <button
            type="button"
            onClick={() => setSelectedFormat("semua")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent-line bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent-text transition hover:border-accent-strong hover:bg-accent-strong hover:text-white"
          >
            <span>Lihat Artikel yang Tersedia</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>
      )}
    </div>
  );
}
