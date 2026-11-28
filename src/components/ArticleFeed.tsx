import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpDown, Calendar, Search, Shuffle, Sparkles, X } from "lucide-react";
import {
  createRandomSeed,
  shuffleWithSeed,
} from "@/lib/shuffle";
import {
  ARTICLE_FORMATS,
  formatArticlePublishedDate,
  type ArticleFeedItem,
  type ArticleFormat,
} from "@/types/article";

interface ArticleFeedProps {
  items: ArticleFeedItem[];
}

type FormatFilterValue = "semua" | ArticleFormat;
const ARTICLE_SHUFFLE_SEED_KEY = "ringkasnya:article-shuffle-seed";

function ArticleCardItem({ article }: { article: ArticleFeedItem }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isMultiLineTitle, setIsMultiLineTitle] = useState(true);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const updateLineCount = () => {
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
      if (!Number.isFinite(lineHeight) || lineHeight <= 0) return;
      setIsMultiLineTitle(el.getBoundingClientRect().height > lineHeight * 1.5);
    };

    updateLineCount();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateLineCount);
    observer.observe(el);
    return () => observer.disconnect();
  }, [article.title]);

  return (
    <a
      href={`/artikel/${article.slug}`}
      className="group flex h-full min-h-[120px] items-stretch overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 sm:min-h-[136px]"
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

          <h2
            ref={titleRef}
            className="mt-1 line-clamp-2 text-[13px] font-bold leading-tight text-ink transition-colors group-hover:text-accent-text sm:text-sm"
          >
            {article.title}
          </h2>
          <p
            className={`mt-1 text-[11px] leading-snug text-ink-muted sm:text-xs ${
              isMultiLineTitle ? "line-clamp-1" : "line-clamp-2"
            }`}
          >
            {article.subtitle}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-line-subtle pt-1.5 text-[11px] font-semibold text-accent-strong group-hover:text-accent-text">
          <span>Baca Artikel</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
        </div>
      </div>
    </a>
  );
}

export default function ArticleFeed({ items }: ArticleFeedProps) {
  const [selectedFormat, setSelectedFormat] =
    useState<FormatFilterValue>("semua");
  const [searchQuery, setSearchQuery] = useState("");
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

  const itemsMatchingSearch = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return orderedItems;
    return orderedItems.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [orderedItems, searchQuery]);

  const filteredItems = useMemo(
    () =>
      selectedFormat === "semua"
        ? itemsMatchingSearch
        : itemsMatchingSearch.filter((item) => item.format === selectedFormat),
    [itemsMatchingSearch, selectedFormat]
  );

  const activeFormatMeta =
    selectedFormat === "semua"
      ? undefined
      : ARTICLE_FORMATS.find((format) => format.id === selectedFormat);

  const availableFormats = useMemo(
    () =>
      ARTICLE_FORMATS.map((format) => ({
        ...format,
        count: itemsMatchingSearch.filter((item) => item.format === format.id)
          .length,
        totalCount: items.filter((item) => item.format === format.id).length,
      })).filter((format) => format.totalCount > 0),
    [items, itemsMatchingSearch]
  );

  const resetFilters = () => {
    setSelectedFormat("semua");
    setSearchQuery("");
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
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-ink-subtle">
        <a href="/" className="hover:text-accent-strong transition-colors">
          Beranda
        </a>
        <span>/</span>
        <span className="font-semibold text-ink-secondary">Artikel</span>
      </nav>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-accent-strong">
          Artikel
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Artikel &amp; Gagasan Ilmiah
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
          Catatan singkat 4–6 menit seputar istilah ilmiah, eksperimen klasik, dan konsep penting di balik buku-buku Ringkasnya.
        </p>
      </div>

      {/* Pencarian, Urutan (Terbaru/Acak), & Rubrik */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5 sm:flex-initial">
            <div className="relative min-w-0 flex-1 sm:w-[280px] sm:flex-initial">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul artikel..."
                aria-label="Cari artikel"
                className="w-full rounded-xl border border-line bg-surface py-2 pl-10 pr-9 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div
              role="group"
              aria-label="Urutkan artikel"
              className="inline-flex shrink-0 items-center rounded-xl border border-line bg-surface p-1 text-xs font-semibold"
            >
              <span className="hidden sm:inline-flex items-center gap-1 px-2 text-ink-subtle">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Urutkan:
              </span>
              <button
                type="button"
                onClick={handleResetShuffle}
                aria-pressed={!shuffleSeed}
                className={`rounded-lg px-3 py-1.5 transition-all ${
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

          <p className="shrink-0 text-right text-xs text-ink-subtle">
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
              {itemsMatchingSearch.length}
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
          key={`${searchQuery}-${selectedFormat}-${shuffleSeed ?? "default"}`}
          aria-label="Daftar Artikel"
          className="animate-fade-slide mt-6 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {filteredItems.map((article) => (
            <ArticleCardItem key={article.slug} article={article} />
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
            {searchQuery.trim()
              ? "Artikel Tidak Ditemukan"
              : activeFormatMeta
                ? `${activeFormatMeta.label} Akan Segera Hadir`
                : "Artikel Akan Segera Hadir"}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
            {searchQuery.trim()
              ? `Tidak ada artikel yang cocok dengan "${searchQuery.trim()}"${activeFormatMeta ? ` di rubrik ${activeFormatMeta.label}` : ""}.`
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
    </section>
  );
}
