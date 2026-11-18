import Link from "next/link";
import { BOOKS } from "@/data/books";
import CatalogSection from "@/components/CatalogSection";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ListChecks,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/70 via-white to-white pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Serap Ilmu Buku Best-Seller Dunia dalam 10 Menit</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Baca Intinya,{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Praktikkan Ilmunya.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
              Tidak punya waktu membaca buku setebal 300 halaman?{" "}
              <strong className="font-semibold text-slate-800">
                ringkasnya.id
              </strong>{" "}
              merangkum gagasan utama buku-buku terbaik dunia ke dalam Bahasa
              Indonesia yang mengalir, lengkap dengan{" "}
              <span className="underline decoration-emerald-400 decoration-2 underline-offset-4">
                Mode Kilat 3 Menit
              </span>{" "}
              dan{" "}
              <span className="underline decoration-emerald-400 decoration-2 underline-offset-4">
                Action Checklist
              </span>{" "}
              praktis.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="#katalog"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700"
              >
                <span>Jelajahi Katalog Buku</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/buku/atomic-habits"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Coba Baca: Atomic Habits</span>
              </Link>
            </div>

            {/* Statistik Ringkas */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-8 text-center">
              <div>
                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  3–12 <span className="text-sm font-semibold text-emerald-600">Mnt</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Waktu Baca Fleksibel
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  100%
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Bahasa Indonesia Luwes
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Aksi Nyata
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Checklist Praktik Langsung
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Buku Interaktif */}
      <CatalogSection books={BOOKS} />

      {/* Seksi Metode Membaca (ATM Value Proposition) */}
      <section
        id="metode"
        className="border-t border-slate-200/80 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Mengapa ringkasnya.id?
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Dirancang Agar Ilmu Buku Tidak Sekadar Lewat di Kepala
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Kami memadukan struktur poin inti bergaya aplikasi ringkasan kelas
              dunia dengan checklist aksi yang relevan untuk keseharian Anda.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                1. Mode Baca Dwi-Kecepatan
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sedang buru-buru? Aktifkan <strong>Mode Kilat (3 Menit)</strong>{" "}
                untuk membaca intisari 1 kalimat per bab. Ingin menyelami contoh
                dan konteks lengkap? Gunakan{" "}
                <strong>Mode Mendalam (10 Menit)</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ListChecks className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                2. Action Checklist Interaktif
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Membaca tanpa praktik tidak akan mengubah apa pun. Setiap buku
                dilengkapi daftar langkah aksi yang bisa Anda centang langsung di
                browser.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                3. Kutipan Pilihan Siap Bagikan
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Temukan kutipan paling berkesan dari setiap buku dan salin dalam
                1 klik untuk dibagikan ke teman, grup belajar, atau media sosial
                Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
