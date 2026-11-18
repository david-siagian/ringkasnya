import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <BookOpen className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl">
        Halaman atau Buku Tidak Ditemukan
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Maaf, ringkasan buku yang Anda cari belum tersedia atau alamat URL telah
        berubah.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}
