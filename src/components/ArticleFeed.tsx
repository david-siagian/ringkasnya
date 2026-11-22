import { useState } from "react";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
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

  const pillBaseClass =
    "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 sm:text-sm";
  const pillActiveClass =
    "border-accent-strong bg-accent-strong text-white shadow-xs";
  const pillInactiveClass =
    "border-line bg-surface text-ink-secondary hover:border-accent-line hover:bg-accent-soft/60 hover:text-accent-text";

  return (
    <div className="mt-6 sm:mt-7">
      {/* Filter Pills Rubrik */}
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
          Semua
        </button>

        {ARTICLE_FORMATS.map((format) => {
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
              {format.label}
            </button>
          );
        })}
      </div>

      {/* Daftar Artikel atau Empty State "Akan Segera Hadir" */}
      {filteredItems.length > 0 ? (
        <section
          aria-label="Daftar Artikel"
          className="mt-7 space-y-4 sm:mt-8 sm:space-y-5"
        >
          {filteredItems.map((article) => (
            <a
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-strong hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 sm:gap-5 sm:p-5"
            >
              {article.coverImage && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-line/60 sm:h-24 sm:w-24">
                  <img
                    src={article.coverImage}
                    alt={`Ilustrasi ${article.title}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-accent-strong sm:text-lg">
                  {article.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-secondary">
                  {article.subtitle}
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{article.readingTimeMinutes} menit baca</span>
                </div>
              </div>

              <ArrowRight className="hidden h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent-strong sm:block" />
            </a>
          ))}
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
