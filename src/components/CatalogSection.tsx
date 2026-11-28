import { useState, useMemo, useEffect, useRef } from "react";
import type { BookCatalogItem, BookCategory } from "@/types/book";
import { CATEGORIES } from "@/lib/book-constants";
import {
  CATALOG_SEARCH_FOCUS_PARAM,
  CATALOG_SEARCH_INPUT_ID,
} from "@/lib/search";
import BookCard from "./BookCard";
import BookPreviewModal from "./BookPreviewModal";
import CategoryDropdown, { type CategoryOption } from "./CategoryDropdown";
import { smoothScrollToElement } from "./SmoothNavigation";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import {
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Search,
  Shuffle,
  X,
  Zap,
} from "lucide-react";
import {
  createRandomSeed,
  shuffleWithSeed,
} from "@/lib/shuffle";

interface CatalogSectionProps {
  books: BookCatalogItem[];
  mode?: "preview" | "full";
  itemsPerPage?: number;
}

const MAX_PREVIEW_OTHER_BOOKS = 6;
const DEFAULT_PREVIEW_COLS = 5;
const DEFAULT_ITEMS_PER_PAGE = 20;
const CATALOG_SHUFFLE_SEED_KEY = "ringkasnya:catalog-shuffle-seed";

type CatalogStatusFilter = "Semua" | "Tersimpan" | "Proses" | "Selesai";
type CatalogSortOption = "terpopuler" | "terbaru";

const STATUS_URL_MAP: Record<CatalogStatusFilter, string | null> = {
  Semua: null,
  Tersimpan: "tersimpan",
  Proses: "proses",
  Selesai: "selesai",
};

function parseStatusParam(raw: string | null): CatalogStatusFilter | null {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "tersimpan") return "Tersimpan";
  if (normalized === "proses") return "Proses";
  if (normalized === "selesai") return "Selesai";
  if (normalized === "semua") return "Semua";
  return null;
}

function parseCreatedAtMs(raw?: string): number {
  if (!raw) return 0;
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T") + "Z";
  const ms = Date.parse(normalized);
  return Number.isFinite(ms) ? ms : 0;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

export default function CatalogSection({
  books,
  mode = "preview",
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: CatalogSectionProps) {
  const isFull = mode === "full";
  const [selectedCategory, setSelectedCategory] = useState<
    BookCategory | "Semua"
  >("Semua");
  const [selectedStatus, setSelectedStatus] =
    useState<CatalogStatusFilter>("Semua");
  const [sortBy, setSortBy] = useState<CatalogSortOption>("terpopuler");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shuffleSeed, setShuffleSeed] = useState<string | null>(null);
  const [previewBook, setPreviewBook] = useState<BookCatalogItem | null>(null);
  const [previewCols, setPreviewCols] = useState(DEFAULT_PREVIEW_COLS);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previewGridRef = useRef<HTMLDivElement>(null);
  const { isBookmarked } = useBookmarks();
  const { isCompleted } = useCompletedBooks();
  const { getProgressPercent, isLoggedIn } = useReadingProgress();

  useEffect(() => {
    if (!isFull) return;

    const params = new URLSearchParams(window.location.search);

    if (params.get(CATALOG_SEARCH_FOCUS_PARAM) === "1") {
      searchInputRef.current?.focus();
      params.delete(CATALOG_SEARCH_FOCUS_PARAM);
      const nextSearch = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (nextSearch ? `?${nextSearch}` : "")
      );
    }

    const categoryParam = params.get("kategori");
    if (categoryParam && CATEGORIES.includes(categoryParam as BookCategory)) {
      setSelectedCategory(categoryParam as BookCategory);
    }

    const statusParam = parseStatusParam(params.get("status"));
    if (statusParam) {
      setSelectedStatus(statusParam);
    } else if (categoryParam === "Tersimpan") {
      setSelectedStatus("Tersimpan");
    }

    const sortParam = params.get("urut")?.trim().toLowerCase();
    if (sortParam === "terbaru" || sortParam === "terpopuler") {
      setSortBy(sortParam);
    }

    const pageParam = Number(params.get("page"));
    if (Number.isInteger(pageParam) && pageParam > 1) {
      setCurrentPage(pageParam);
    }

    try {
      const savedSeed = window.sessionStorage.getItem(CATALOG_SHUFFLE_SEED_KEY);
      if (savedSeed) {
        setShuffleSeed(savedSeed);
      }
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }, [isFull]);

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const counts = new Map<BookCategory, number>();
    for (const book of books) {
      counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
    }
    return [
      { value: "Semua", label: "Semua Kategori", count: books.length },
      ...CATEGORIES.map((category) => ({
        value: category,
        label: category,
        count: counts.get(category) ?? 0,
      })),
    ];
  }, [books]);

  const orderedBooks = useMemo(() => {
    if (isFull && shuffleSeed) {
      return shuffleWithSeed(books, shuffleSeed);
    }
    if (isFull && sortBy === "terbaru") {
      return [...books].sort((a, b) => {
        const diff = parseCreatedAtMs(b.createdAt) - parseCreatedAtMs(a.createdAt);
        if (diff !== 0) return diff;
        return b.year - a.year;
      });
    }
    return books;
  }, [books, isFull, shuffleSeed, sortBy]);

  const baseFilteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return orderedBooks.filter((book) => {
      const matchesCategory =
        selectedCategory === "Semua" || book.category === selectedCategory;
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.tagline.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [orderedBooks, selectedCategory, searchQuery]);

  const statusCounts = useMemo(() => {
    let saved = 0;
    let inProgress = 0;
    let completed = 0;
    for (const book of baseFilteredBooks) {
      if (isBookmarked(book.slug)) saved++;
      if (isCompleted(book.slug)) {
        completed++;
      } else if (isLoggedIn) {
        const pct = getProgressPercent(book.slug);
        if (pct > 0 && pct < 100) inProgress++;
      }
    }
    return {
      all: baseFilteredBooks.length,
      saved,
      inProgress,
      completed,
    };
  }, [baseFilteredBooks, isBookmarked, isCompleted, isLoggedIn, getProgressPercent]);

  const filteredBooks = useMemo(() => {
    if (!isFull || selectedStatus === "Semua") return baseFilteredBooks;
    return baseFilteredBooks.filter((book) => {
      if (selectedStatus === "Tersimpan") {
        return isBookmarked(book.slug);
      }
      if (selectedStatus === "Selesai") {
        return isCompleted(book.slug);
      }
      const pct = getProgressPercent(book.slug);
      return isLoggedIn && !isCompleted(book.slug) && pct > 0 && pct < 100;
    });
  }, [
    baseFilteredBooks,
    isFull,
    selectedStatus,
    isBookmarked,
    isCompleted,
    getProgressPercent,
    isLoggedIn,
  ]);

  const hasPreviewOtherBooks = !isFull && filteredBooks.length > 1;

  useEffect(() => {
    if (isFull) return;
    const gridEl = previewGridRef.current;
    if (!gridEl) return;

    const updateCols = () => {
      const tracks = getComputedStyle(gridEl)
        .gridTemplateColumns.trim()
        .split(/\s+/)
        .filter((track) => track && track !== "none");
      const cols = tracks.length;
      if (cols >= 1) {
        setPreviewCols((prev) => (prev === cols ? prev : cols));
      }
    };

    updateCols();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateCols);
      observer.observe(gridEl);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, [isFull, hasPreviewOtherBooks]);

  const totalPages = isFull
    ? Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage))
    : 1;
  const safePage = Math.min(currentPage, totalPages);

  const displayedBooks = useMemo(() => {
    if (!isFull) {
      const previewOtherCount = Math.max(
        previewCols,
        Math.floor(MAX_PREVIEW_OTHER_BOOKS / previewCols) * previewCols
      );
      return filteredBooks.slice(0, 1 + previewOtherCount);
    }
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBooks, isFull, previewCols, safePage, itemsPerPage]);

  const syncCatalogUrl = (
    page: number,
    category: BookCategory | "Semua" = selectedCategory,
    status: CatalogStatusFilter = selectedStatus,
    sort: CatalogSortOption = sortBy
  ) => {
    if (!isFull || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (page <= 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", String(page));
    }
    if (category === "Semua") {
      url.searchParams.delete("kategori");
    } else {
      url.searchParams.set("kategori", category);
    }
    const statusParam = STATUS_URL_MAP[status];
    if (!statusParam) {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", statusParam);
    }
    if (sort === "terpopuler") {
      url.searchParams.delete("urut");
    } else {
      url.searchParams.set("urut", sort);
    }
    window.history.replaceState(null, "", url.pathname + url.search);
  };

  const handleCategoryChange = (category: BookCategory | "Semua") => {
    setSelectedCategory(category);
    setCurrentPage(1);
    syncCatalogUrl(1, category, selectedStatus, sortBy);
  };

  const handleStatusChange = (status: CatalogStatusFilter) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    syncCatalogUrl(1, selectedCategory, status, sortBy);
  };

  const handleSortChange = (nextSort: CatalogSortOption) => {
    setSortBy(nextSort);
    setShuffleSeed(null);
    setCurrentPage(1);
    syncCatalogUrl(1, selectedCategory, selectedStatus, nextSort);
    try {
      window.sessionStorage.removeItem(CATALOG_SHUFFLE_SEED_KEY);
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    syncCatalogUrl(1);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    if (nextPage === safePage) return;
    setCurrentPage(nextPage);
    syncCatalogUrl(nextPage);
    smoothScrollToElement("katalog", 500);
  };

  const handleShuffleBooks = () => {
    const nextSeed = createRandomSeed();
    setShuffleSeed(nextSeed);
    setCurrentPage(1);
    syncCatalogUrl(1);
    try {
      window.sessionStorage.setItem(CATALOG_SHUFFLE_SEED_KEY, nextSeed);
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  };

  const startItem = filteredBooks.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safePage * itemsPerPage, filteredBooks.length);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <section
      id="katalog"
      className={`scroll-mt-20 mx-auto px-4 sm:px-6 ${
        isFull ? "max-w-7xl py-10 sm:py-14" : "max-w-6xl py-14"
      }`}
    >
      {isFull && (
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-ink-subtle">
          <a href="/" className="hover:text-accent-strong transition-colors">
            Beranda
          </a>
          <span>/</span>
          <span className="font-semibold text-ink-secondary">Katalog Buku</span>
        </nav>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent-strong">
            {isFull ? "Katalog Lengkap" : "Perpustakaan Kurasi"}
          </span>
          {isFull ? (
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Daftar Semua Buku
            </h1>
          ) : (
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Mulai dari Buku-Buku Pilihan
            </h2>
          )}
          {isFull && (
            <p className="mt-1.5 text-sm text-ink-muted">
              Dirangkum dengan metode poin inti &amp; konsep kunci dalam Bahasa Indonesia yang mudah dipahami.
            </p>
          )}
        </div>

        {/* Kolom Pencarian */}
        {isFull && (
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              ref={searchInputRef}
              id={CATALOG_SEARCH_INPUT_ID}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari judul buku, penulis, topik..."
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
                aria-label="Hapus pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Kategori, Urutan (termasuk Acak), & Status */}
      {isFull && (
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <CategoryDropdown
                options={categoryOptions}
                selectedValue={selectedCategory}
                onSelect={handleCategoryChange}
              />

              <div
                role="group"
                aria-label="Urutkan buku"
                className="inline-flex items-center rounded-xl border border-line bg-surface p-1 text-xs font-semibold"
              >
                <span className="hidden sm:inline-flex items-center gap-1 px-2 text-ink-subtle">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Urutkan:
                </span>
                {(
                  [
                    { value: "terpopuler", label: "Terpopuler" },
                    { value: "terbaru", label: "Terbaru" },
                  ] as const
                ).map((option) => {
                  const active = !shuffleSeed && sortBy === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSortChange(option.value)}
                      aria-pressed={active}
                      className={`rounded-lg px-3 py-1.5 transition-all ${
                        active
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={handleShuffleBooks}
                  aria-pressed={Boolean(shuffleSeed)}
                  title={shuffleSeed ? "Klik lagi untuk acak ulang" : "Acak urutan buku"}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 transition-all ${
                    shuffleSeed
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Shuffle className="h-3 w-3" />
                  <span>Acak</span>
                </button>
              </div>
            </div>
          </div>

          {/* Segmented Pills Status Baca */}
          <div
            role="group"
            aria-label="Filter status baca"
            className="flex items-center gap-2 overflow-x-auto pb-1"
          >
            {(
              [
                {
                  value: "Semua",
                  label: "Semua",
                  count: statusCounts.all,
                  icon: null,
                },
                {
                  value: "Tersimpan",
                  label: "Tersimpan",
                  count: statusCounts.saved,
                  icon: Bookmark,
                },
                {
                  value: "Proses",
                  label: "Proses",
                  count: statusCounts.inProgress,
                  icon: BookOpen,
                },
                {
                  value: "Selesai",
                  label: "Selesai",
                  count: statusCounts.completed,
                  icon: CheckCircle2,
                },
              ] as const
            ).map((pill) => {
              const active = selectedStatus === pill.value;
              const Icon = pill.icon;
              return (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => handleStatusChange(pill.value)}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "border border-line bg-surface text-ink-muted hover:border-line-strong hover:bg-page"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        active && pill.value === "Tersimpan" ? "fill-current" : ""
                      }`}
                    />
                  )}
                  <span>{pill.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-surface-subtle text-ink-subtle"
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Daftar Buku */}
      {displayedBooks.length > 0 ? (
        isFull ? (
          <div
            key={`${selectedCategory}-${selectedStatus}-${sortBy}-${searchQuery}-${safePage}-${shuffleSeed ?? "default"}`}
            className="animate-fade-slide mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]"
          >
            {displayedBooks.map((book) => (
              <BookCard key={book.slug} book={book} onSelect={setPreviewBook} />
            ))}
          </div>
        ) : (
          <div
            key={`${selectedCategory}-${searchQuery}-preview`}
            className="animate-fade-slide mt-8 space-y-6"
          >
            {/* 1 Buku Highlight Contoh */}
            {(() => {
              const featuredBook = displayedBooks[0];
              return (
                <a
                  href={`/buku/${featuredBook.slug}`}
                  data-no-transition="true"
                  onClick={(e) => {
                    e.preventDefault();
                    setPreviewBook(featuredBook);
                  }}
                  className="group flex flex-col items-stretch overflow-hidden rounded-2xl border border-accent-line/90 bg-gradient-to-br from-accent-soft/90 via-surface to-warm-soft/50 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-lg md:flex-row"
                >
                  {featuredBook.coverImage && (
                    <div
                      className={`flex w-full shrink-0 items-center justify-center bg-slate-900 bg-gradient-to-br ${featuredBook.coverGradient} p-6 sm:p-8 md:w-72 lg:w-80`}
                    >
                      <div className="relative aspect-[3/4] w-40 sm:w-48 md:w-52 overflow-hidden rounded-xl bg-black/20 shadow-[0_18px_36px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/25">
                        <img
                          src={featuredBook.coverImage}
                          alt={`Ilustrasi sampul buku ${featuredBook.title}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-7">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-accent-line bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-text">
                          Buku Pilihan
                        </span>
                        <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                          {featuredBook.category}
                        </span>
                      </div>

                      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                        {featuredBook.author}
                      </p>
                      <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold leading-snug tracking-tight text-ink group-hover:text-accent-text">
                        {featuredBook.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1 font-medium text-warm-text">
                          <Zap className="h-3.5 w-3.5 text-amber-500" />
                          Mode Kilat {featuredBook.quickTimeMinutes} mnt
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-ink-faint" />
                          Mendalam {featuredBook.readingTimeMinutes} mnt
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-ink-faint" />
                          {featuredBook.takeawaysCount} Poin Inti
                        </span>
                      </div>

                      <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink-muted">
                        {featuredBook.tagline}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-line-subtle pt-4 text-xs sm:text-sm font-semibold text-accent-text group-hover:text-accent-strong">
                      <span>Baca Ringkasan &amp; Konsep Kunci</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              );
            })()}

            {/* Buku Lainnya (Grid Vertikal) */}
            {displayedBooks.length > 1 && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">
                  Jelajahi Buku Lainnya
                </p>
                <div
                  ref={previewGridRef}
                  className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                >
                  {displayedBooks.slice(1).map((book) => (
                    <BookCard
                      key={book.slug}
                      book={book}
                      onSelect={setPreviewBook}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-surface p-12 text-center">
          <p className="text-base font-semibold text-ink">
            {selectedStatus === "Tersimpan" && statusCounts.saved === 0
              ? "Belum ada buku yang disimpan"
              : selectedStatus === "Proses" && statusCounts.inProgress === 0
                ? isLoggedIn
                  ? "Belum ada buku yang sedang dibaca"
                  : "Masuk untuk memantau progres baca"
                : selectedStatus === "Selesai" && statusCounts.completed === 0
                  ? "Belum ada buku yang selesai dibaca"
                  : selectedCategory !== "Semua" &&
                      selectedStatus === "Semua" &&
                      !searchQuery.trim()
                    ? `Belum ada buku di kategori ${selectedCategory}`
                    : "Buku yang kamu cari belum ditemukan"}
          </p>
          <p className="mt-1 text-sm text-ink-subtle">
            {selectedStatus === "Tersimpan" && statusCounts.saved === 0
              ? "Klik ikon bookmark pada kartu buku untuk menyimpannya di sini."
              : selectedStatus === "Proses" && statusCounts.inProgress === 0
                ? isLoggedIn
                  ? "Mulai baca ringkasan buku dan progresmu akan muncul otomatis di sini."
                  : "Filter Proses aktif untuk pengguna yang sudah masuk agar progres baca tersinkronisasi."
                : selectedStatus === "Selesai" && statusCounts.completed === 0
                  ? "Tandai buku sebagai selesai di halaman pembaca untuk melihatnya di sini."
                  : selectedCategory !== "Semua" &&
                      selectedStatus === "Semua" &&
                      !searchQuery.trim()
                    ? "Ringkasan buku untuk kategori ini sedang disiapkan dan akan segera hadir."
                    : isFull
                      ? 'Coba ubah filter kategori/status atau gunakan kata kunci lain.'
                      : "Coba gunakan kata kunci lain."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Semua");
              setSelectedStatus("Semua");
              setSearchQuery("");
              setCurrentPage(1);
              syncCatalogUrl(1, "Semua", "Semua", sortBy);
            }}
            className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            {selectedCategory !== "Semua" || selectedStatus !== "Semua"
              ? "Reset Filter"
              : "Reset Pencarian"}
          </button>
        </div>
      )}

      {/* Tombol Lihat Semua Buku (Mode Preview) */}
      {!isFull && (
        <div className="mt-10 flex justify-center">
          <a
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98]"
          >
            <span>Lihat Semua Buku</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}

      {/* Pagination (Mode Full) */}
      {isFull && filteredBooks.length > 0 && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line/80 pt-6 sm:flex-row">
          <p className="text-xs sm:text-sm text-ink-subtle">
            Menampilkan{" "}
            <span className="font-semibold text-ink-secondary">
              {startItem}–{endItem}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-ink-secondary">
              {filteredBooks.length}
            </span>{" "}
            buku (Halaman {safePage} dari {totalPages})
          </p>

          <nav aria-label="Navigasi halaman katalog" className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage <= 1}
              aria-label="Halaman sebelumnya"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:bg-page disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {pageNumbers.map((item, idx) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs font-semibold text-ink-faint"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePageChange(item)}
                  aria-current={item === safePage ? "page" : undefined}
                  className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2.5 text-xs font-bold transition-colors ${
                    item === safePage
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "border border-line bg-surface text-ink-secondary hover:bg-page"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage >= totalPages}
              aria-label="Halaman berikutnya"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:bg-page disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}
      {/* Modal Preview Buku */}
      <BookPreviewModal
        book={previewBook}
        onClose={() => setPreviewBook(null)}
      />
    </section>
  );
}
