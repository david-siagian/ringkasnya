import { useState, useMemo, useEffect } from "react";
import type { BookSummary, BookCategory } from "@/types/book";
import { CATEGORIES } from "@/data/books";
import BookCard from "./BookCard";
import { smoothScrollToElement } from "./SmoothNavigation";
import { ArrowRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

interface CatalogSectionProps {
  books: BookSummary[];
  mode?: "preview" | "full";
  maxPreviewItems?: number;
  itemsPerPage?: number;
}

const DEFAULT_PREVIEW_LIMIT = 5;
const DEFAULT_ITEMS_PER_PAGE = 20;

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
  maxPreviewItems = DEFAULT_PREVIEW_LIMIT,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: CatalogSectionProps) {
  const isFull = mode === "full";
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | "Semua">("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isFull) return;
    const params = new URLSearchParams(window.location.search);
    const pageParam = Number(params.get("page"));
    if (Number.isInteger(pageParam) && pageParam > 1) {
      setCurrentPage(pageParam);
    }
  }, [isFull]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === "Semua" || book.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.tagline.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [books, selectedCategory, searchQuery]);

  const totalPages = isFull
    ? Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage))
    : 1;
  const safePage = Math.min(currentPage, totalPages);

  const displayedBooks = useMemo(() => {
    if (!isFull) {
      return filteredBooks.slice(0, maxPreviewItems);
    }
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBooks, isFull, maxPreviewItems, safePage, itemsPerPage]);

  const syncPageUrl = (page: number) => {
    if (!isFull || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (page <= 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", String(page));
    }
    window.history.replaceState(null, "", url.pathname + url.search);
  };

  const handleCategoryChange = (category: BookCategory | "Semua") => {
    setSelectedCategory(category);
    setCurrentPage(1);
    syncPageUrl(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    syncPageUrl(1);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    if (nextPage === safePage) return;
    setCurrentPage(nextPage);
    syncPageUrl(nextPage);
    smoothScrollToElement("katalog", 500);
  };

  const startItem = filteredBooks.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safePage * itemsPerPage, filteredBooks.length);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <section
      id="katalog"
      className={`scroll-mt-20 mx-auto max-w-6xl px-4 sm:px-6 ${
        isFull ? "py-10 sm:py-14" : "py-14"
      }`}
    >
      {isFull && (
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <a href="/" className="hover:text-emerald-600 transition-colors">
            Beranda
          </a>
          <span>/</span>
          <span className="font-semibold text-slate-700">Katalog Buku</span>
        </nav>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            {isFull ? "Katalog Lengkap" : "Perpustakaan Kurasi"}
          </span>
          {isFull ? (
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Daftar Semua Buku
            </h1>
          ) : (
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Pilih Buku, Serap Intisarinya
            </h2>
          )}
          <p className="mt-1.5 text-sm text-slate-600">
            Dirangkum dengan metode poin inti & langkah aksi nyata dalam Bahasa Indonesia.
          </p>
        </div>

        {/* Kolom Pencarian */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari judul buku, penulis, topik..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange("Semua")}
          className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
            selectedCategory === "Semua"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          Semua ({books.length})
        </button>
        {CATEGORIES.map((category) => {
          const count = books.filter((b) => b.category === category).length;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Daftar Buku */}
      {displayedBooks.length > 0 ? (
        <div
          key={`${selectedCategory}-${searchQuery}-${safePage}`}
          className={`animate-fade-slide mt-8 grid ${
            isFull
              ? "grid-cols-2 gap-3 sm:gap-6"
              : "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {displayedBooks.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-base font-semibold text-slate-800">
            Buku yang kamu cari belum ditemukan
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Coba gunakan kata kunci lain atau pilih kategori &ldquo;Semua&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              handleCategoryChange("Semua");
              handleSearchChange("");
            }}
            className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Tombol Lihat Semua Buku (Mode Preview) */}
      {!isFull && (
        <div className="mt-10 flex justify-center">
          <a
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-700 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-600 hover:text-white active:scale-[0.98]"
          >
            <span>Lihat Semua Buku</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}

      {/* Pagination (Mode Full) */}
      {isFull && filteredBooks.length > 0 && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row">
          <p className="text-xs sm:text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-semibold text-slate-700">
              {startItem}–{endItem}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-700">
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
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {pageNumbers.map((item, idx) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs font-semibold text-slate-400"
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
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}
    </section>
  );
}
