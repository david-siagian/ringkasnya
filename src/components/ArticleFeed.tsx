import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, Shuffle, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/book-constants";
import {
  createRandomSeed,
  shuffleWithSeed,
} from "@/lib/shuffle";
import type { BookCategory } from "@/types/book";
import {
  ARTICLE_FORMATS,
  formatArticlePublishedDate,
  type ArticleFeedItem,
  type ArticleFormat,
} from "@/types/article";
import CategoryDropdown, { type CategoryOption } from "./CategoryDropdown";

interface ArticleFeedProps {
  items: ArticleFeedItem[];
}

type FormatFilterValue = "semua" | ArticleFormat;
type CategoryFilterValue = "Semua" | BookCategory;
const ARTICLE_SHUFFLE_SEED_KEY = "ringkasnya:article-shuffle-seed";

export default function ArticleFeed({ items }: ArticleFeedProps) {
  const [selectedFormat, setSelectedFormat] =
    useState<FormatFilterValue>("semua");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>("Semua");
  const [shuffleSeed, setShuffleSeed] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSeed = window.sessionStorage.getItem(ARTICLE_SHUFFLE_SEED_KEY);
      if (savedSeed) {
        setShuffleSeed(savedSeed);
      }
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }, []);

  const orderedItems = useMemo(
    () => (shuffleSeed ? shuffleWithSeed(items, shuffleSeed) : items),
    [items, shuffleSeed]
  );

  const itemsMatchingCategory = useMemo(
    () =>
      selectedCategory === "Semua"
        ? orderedItems
        : orderedItems.filter((item) => item.category === selectedCategory),
    [orderedItems, selectedCategory]
  );

  const itemsMatchingFormat = useMemo(
    () =>
      selectedFormat === "semua"
        ? orderedItems
        : orderedItems.filter((item) => item.format === selectedFormat),
    [orderedItems, selectedFormat]
  );

  const filteredItems = useMemo(
    () =>
      itemsMatchingFormat.filter(
        (item) =>
          selectedCategory === "Semua" || item.category === selectedCategory
      ),
    [itemsMatchingFormat, selectedCategory]
  );

  const activeFormatMeta =
    selectedFormat === "semua"
      ? undefined
      : ARTICLE_FORMATS.find((format) => format.id === selectedFormat);

  const availableFormats = useMemo(
    () =>
      ARTICLE_FORMATS.map((format) => ({
        ...format,
        count: itemsMatchingCategory.filter((item) => item.format === format.id)
          .length,
        totalCount: items.filter((item) => item.format === format.id).length,
      })).filter((format) => format.totalCount > 0),
    [items, itemsMatchingCategory]
  );

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const totalByCategory = new Map<BookCategory, number>();
    const filteredByCategory = new Map<BookCategory, number>();

    for (const item of items) {
      totalByCategory.set(
        item.category,
        (totalByCategory.get(item.category) ?? 0) + 1
      );
    }

    for (const item of itemsMatchingFormat) {
      filteredByCategory.set(
        item.category,
        (filteredByCategory.get(item.category) ?? 0) + 1
      );
    }

    return [
      {
        value: "Semua",
        label: "Semua Kategori",
        count: itemsMatchingFormat.length,
      },
      ...CATEGORIES.filter((category) => (totalByCategory.get(category) ?? 0) > 0).map(
        (category) => ({
          value: category,
          label: category,
          count: filteredByCategory.get(category) ?? 0,
        })
      ),
    ];
  }, [items, itemsMatchingFormat]);

  const resetFilters = () => {
    setSelectedFormat("semua");
    setSelectedCategory("Semua");
  };

  const handleShuffleArticles = () => {
    const nextSeed = createRandomSeed();
    setShuffleSeed(nextSeed);
    try {
      window.sessionStorage.setItem(ARTICLE_SHUFFLE_SEED_KEY, nextSeed);
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  };

  const handleResetShuffle = () => {
    setShuffleSeed(null);
    try {
      window.sessionStorage.removeItem(ARTICLE_SHUFFLE_SEED_KEY);
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  };

  const pillBaseClass =
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40";
  const pillActiveClass =
    "border-accent-strong bg-accent-strong text-white";
  const pillInactiveClass =
    "border-line bg-surface text-ink-secondary hover:border-accent-line hover:text-accent-text";

  return (
    <div className="mt-6">
      {/* Filter Kategori, Urutan (Terbaru/Acak), & Rubrik */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5 sm:flex-initial">
            <CategoryDropdown
              options={categoryOptions}
              selectedValue={selectedCategory}
              onSelect={setSelectedCategory}
              listboxAriaLabel="Daftar kategori artikel"
              className="min-w-0 flex-1 sm:w-[240px] sm:flex-initial"
            />

            <div
              role="group"
              aria-label="Urutkan artikel"
              className="inline-flex shrink-0 items-center rounded-xl border border-line bg-surface p-1 text-xs font-semibold"
            >
              <button
                type="button"
                onClick={handleResetShuffle}
                aria-pressed={!shuffleSeed}
                className={`rounded-lg px-2.5 py-1.5 transition-all ${
                  !shuffleSeed
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Terbaru
              </button>
              <button
                type="button"
                onClick={handleShuffleArticles}
                aria-pressed={Boolean(shuffleSeed)}
                aria-label={shuffleSeed ? "Acak ulang urutan artikel" : "Acak urutan artikel"}
                title={shuffleSeed ? "Klik lagi untuk acak ulang" : "Acak urutan artikel"}
                className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 transition-all ${
                  shuffleSeed
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <Shuffle className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p className="hidden shrink-0 text-right text-xs text-ink-subtle sm:block">
            {filteredItems.length} artikel
          </p>
        </div>

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
              {itemsMatchingCategory.length}
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
      </div>

      {/* Daftar Artikel atau Empty State "Akan Segera Hadir" */}
      {filteredItems.length > 0 ? (
        <section
          key={`${selectedCategory}-${selectedFormat}-${shuffleSeed ?? "default"}`}
          aria-label="Daftar Artikel"
          className="animate-fade-slide mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {filteredItems.map((article) => (
            <a
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className="group flex items-stretch overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              {article.coverImage && (
                <div className="w-24 shrink-0 overflow-hidden border-r border-line/60 bg-slate-950 sm:w-28 md:w-32">
                  <img
                    src={article.coverImage}
                    alt={`Ilustrasi ${article.title}`}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-between px-3.5 py-2.5 sm:px-4 sm:py-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px]">
                    <span className="truncate font-semibold text-accent-text">
                      {article.accentBadge}
                    </span>
                    <span aria-hidden="true" className="text-ink-faint">
                      &middot;
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-ink-subtle">
                      <Calendar className="h-3 w-3 text-ink-faint" />
                      {formatArticlePublishedDate(article.publishedAt)}
                    </span>
                  </div>

                  <h2 className="mt-1 line-clamp-2 text-[13px] font-bold leading-tight text-ink transition-colors group-hover:text-accent-text sm:text-sm">
                    {article.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-[11px] leading-snug text-ink-muted sm:line-clamp-2 sm:text-xs">
                    {article.subtitle}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-line-subtle pt-1.5 text-[11px] font-semibold text-accent-strong group-hover:text-accent-text">
                  <span>Baca Artikel</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
                </div>
              </div>
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
            {selectedCategory !== "Semua"
              ? "Belum Ada Artikel yang Cocok"
              : activeFormatMeta
                ? `${activeFormatMeta.label} Akan Segera Hadir`
                : "Artikel Akan Segera Hadir"}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
            {selectedCategory !== "Semua"
              ? `Belum ada artikel untuk kombinasi ${activeFormatMeta ? `rubrik ${activeFormatMeta.label} dan ` : ""}kategori ${selectedCategory}.`
              : (activeFormatMeta?.comingSoonDescription ??
                "Artikel untuk rubrik ini sedang kami siapkan.")}
          </p>
          <button
            type="button"
            onClick={resetFilters}
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
