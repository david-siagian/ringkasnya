import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BOOKS, getBookBySlug } from "@/data/books";
import BookReader from "@/components/BookReader";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BOOKS.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return {
      title: "Buku Tidak Ditemukan — ringkasnya.id",
    };
  }

  return {
    title: `Ringkasan Buku ${book.title} (${book.author}) — ringkasnya.id`,
    description: `${book.tagline} Baca ringkasan ${book.title} dalam ${book.quickTimeMinutes}-${book.readingTimeMinutes} menit lengkap dengan Action Checklist.`,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const relatedBooks = BOOKS.filter((b) => b.slug !== book.slug).slice(0, 2);

  return <BookReader book={book} relatedBooks={relatedBooks} />;
}
