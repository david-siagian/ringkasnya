import { useState, useMemo } from "react";
import type { BookSummary, BookCategory } from "@/types/book";
import { CATEGORIES } from "@/data/books";
import BookCard from "./BookCard";
import { Search, X } from "lucide-react";

interface CatalogSectionProps {
  books: BookSummary[];
}

export default function CatalogSection({ books }: CatalogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | "Semua">("Semua");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <section id="katalog" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Perpustakaan Kurasi
          </span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Pilih Buku, Serap Intisarinya
          </h2>
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul buku, penulis, topik..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
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
          onClick={() => setSelectedCategory("Semua")}
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
              onClick={() => setSelectedCategory(category)}
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
      {filteredBooks.length > 0 ? (
        <div
          key={`${selectedCategory}-${searchQuery}`}
          className="animate-fade-slide mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredBooks.map((book) => (
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
              setSelectedCategory("Semua");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </section>
  );
}
