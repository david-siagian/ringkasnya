import { useState, useEffect } from "react";
import type { BookSummary } from "@/types/book";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Lightbulb,
  ListChecks,
  Quote,
  Sparkles,
  Star,
  Target,
  Type,
  Zap,
} from "lucide-react";

interface BookReaderProps {
  book: BookSummary;
  relatedBooks: BookSummary[];
}

const FONT_SCALES = {
  sm: {
    micro: "text-[10px]",
    label: "text-[11px]",
    subtext: "text-[11px] sm:text-xs",
    compact: "text-xs",
    lead: "text-xs sm:text-sm",
    body: "text-sm leading-relaxed",
    conclusion: "text-base leading-relaxed",
    sectionHeading: "text-base",
    conclusionHeading: "text-base sm:text-lg",
    blockHeading: "text-lg",
    takeawayTitle: "text-lg sm:text-xl",
  },
  base: {
    micro: "text-[11px]",
    label: "text-xs",
    subtext: "text-xs sm:text-sm",
    compact: "text-sm",
    lead: "text-sm sm:text-base",
    body: "text-base leading-relaxed",
    conclusion: "text-lg leading-relaxed",
    sectionHeading: "text-lg",
    conclusionHeading: "text-lg sm:text-xl",
    blockHeading: "text-xl",
    takeawayTitle: "text-xl sm:text-2xl",
  },
  lg: {
    micro: "text-xs",
    label: "text-sm",
    subtext: "text-sm sm:text-base",
    compact: "text-base",
    lead: "text-base sm:text-lg",
    body: "text-lg leading-relaxed",
    conclusion: "text-xl leading-relaxed",
    sectionHeading: "text-xl",
    conclusionHeading: "text-xl sm:text-2xl",
    blockHeading: "text-2xl",
    takeawayTitle: "text-2xl sm:text-3xl",
  },
} as const;

export default function BookReader({ book, relatedBooks }: BookReaderProps) {
  const [readMode, setReadMode] = useState<"deep" | "quick">("deep");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copiedQuoteIdx, setCopiedQuoteIdx] = useState<number | null>(null);

  const storageKey = `ringkasnya_checklist_${book.slug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems({});
      }
    } catch {
      setCheckedItems({});
    }
  }, [storageKey]);

  const toggleChecklist = (index: number) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [index]: !prev[index] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
      return updated;
    });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalChecklist = book.actionChecklist.length;
  const progressPercent =
    totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;

  const handleCopyQuote = (quote: string, index: number) => {
    const textToCopy = `"${quote}" — ${book.title} (${book.author}) via ringkasnya.id`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuoteIdx(index);
    setTimeout(() => setCopiedQuoteIdx(null), 2000);
  };

  const fs = FONT_SCALES[fontSize];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 dark:bg-slate-950">
      {/* Banner Header Buku */}
      <div className={`bg-slate-900 bg-gradient-to-br ${book.coverGradient} text-white`}>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <a
            href="/katalog"
            className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-black/30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Katalog
          </a>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            {book.coverImage && (
              <div className="relative aspect-[3/4] w-36 shrink-0 overflow-hidden rounded-2xl bg-black/20 shadow-[0_18px_36px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/25 sm:w-44">
                <img
                  src={book.coverImage}
                  alt={`Ilustrasi sampul buku ${book.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {book.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  {book.rating} / 5.0
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-xs font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {readMode === "quick"
                    ? `${book.quickTimeMinutes} menit baca (Mode Kilat)`
                    : `${book.readingTimeMinutes} menit baca (Mode Mendalam)`}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {book.title}
              </h1>
              {book.originalTitle && (
                <p className="mt-1 text-sm text-white/80 italic">
                  {book.originalTitle}
                </p>
              )}
              <p className="mt-2 text-base font-semibold text-white/95">
                {book.author} ({book.year})
              </p>

              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/90">
                {book.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Reader Toolbar (Mode Baca & Ukuran Huruf) */}
      <div className="sticky top-[61px] z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Toggle Mode Kilat vs Mendalam */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setReadMode("deep")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                readMode === "deep"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Mendalam ({book.readingTimeMinutes} mnt)</span>
            </button>
            <button
              type="button"
              onClick={() => setReadMode("quick")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                readMode === "quick"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Kilat ({book.quickTimeMinutes} mnt)</span>
            </button>
          </div>

          {/* Kontrol Ukuran Teks */}
          <div className="flex items-center gap-1.5">
            <Type className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setFontSize("sm")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "sm"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/70 dark:text-emerald-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize("base")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "base"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/70 dark:text-emerald-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize("lg")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "lg"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/70 dark:text-emerald-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Konten Utama Ringkasan */}
      <main className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        {/* Banner Info Mode Kilat */}
        {readMode === "quick" && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-200">
            <Zap className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className={`${fs.subtext} font-medium`}>
              <strong>Mode Kilat Aktif:</strong> Menampilkan intisari 1 kalimat
              dan tips praktis dari setiap bab agar Anda bisa menangkap ide utama
              buku ini dalam {book.quickTimeMinutes} menit.
            </p>
          </div>
        )}

        {/* Seksi Sinopsis & Untuk Siapa Buku Ini */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className={`${fs.sectionHeading} font-bold text-slate-900 dark:text-slate-50`}>
            Sinopsis
          </h2>
          <p className={`mt-2.5 text-slate-700 dark:text-slate-300 ${fs.body}`}>
            {book.synopsis}
          </p>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
            <h3 className={`flex items-center gap-2 ${fs.compact} font-bold text-slate-900 dark:text-slate-100`}>
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Buku Ini Sangat Cocok Untuk:
            </h3>
            <ul className="mt-3 space-y-2">
              {book.whoIsItFor.map((target, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-2.5 ${fs.compact} text-slate-700 dark:text-slate-300`}
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{target}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Daftar Isi Cepat */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className={`${fs.label} font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400`}>
            Daftar Poin Inti ({book.keyTakeaways.length} Bab Ringkas)
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {book.keyTakeaways.map((item) => (
              <a
                key={item.number}
                href={`#poin-${item.number}`}
                className={`flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 ${fs.subtext} font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 hover:text-emerald-800 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {item.number}
                </span>
                <span className="line-clamp-1">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Poin Inti Bab per Bab */}
        <div className="mt-8 space-y-6">
          {book.keyTakeaways.map((takeaway) => (
            <article
              key={takeaway.number}
              id={`poin-${takeaway.number}`}
              className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">
                  {takeaway.number}
                </span>
                <span className={`${fs.label} font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400`}>
                  Poin Inti #{takeaway.number}
                </span>
              </div>

              <h3 className={`mt-3 ${fs.takeawayTitle} font-extrabold text-slate-900 dark:text-slate-50`}>
                {takeaway.title}
              </h3>

              {/* Box Intisari Kilat */}
              <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/70 p-4 dark:bg-emerald-950/40">
                <p className={`${fs.label} font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300`}>
                  ⚡ Intisari 1 Kalimat
                </p>
                <p className={`mt-1 ${fs.lead} font-semibold text-slate-900 dark:text-slate-100`}>
                  {takeaway.quickSummary}
                </p>
              </div>

              {/* Penjelasan Mendalam (Hanya muncul di Mode Mendalam) */}
              {readMode === "deep" && (
                <div className={`animate-fade-slide mt-5 space-y-4 text-slate-700 dark:text-slate-300 ${fs.body}`}>
                  {takeaway.deepContent.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Tips Praktis */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 dark:border-amber-800/50 dark:bg-amber-950/40">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className={`${fs.label} font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300`}>
                    Tips Praktis Langsung Coba:
                  </span>
                  <p className={`mt-0.5 ${fs.compact} text-slate-800 dark:text-amber-100/90`}>
                    {takeaway.practicalTip}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Kesimpulan Akhir */}
        <section className="mt-8 rounded-2xl border-2 border-emerald-300/90 border-l-[6px] border-l-emerald-600 bg-gradient-to-br from-emerald-100/75 via-emerald-50/70 to-teal-50/80 p-6 sm:p-8 shadow-md shadow-emerald-950/5 dark:border-emerald-800/70 dark:border-l-emerald-500 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <span className={`block ${fs.micro} font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400`}>
                  Final Takeaway
                </span>
                <h2 className={`${fs.conclusionHeading} font-extrabold text-slate-900 dark:text-slate-50`}>
                  Kesimpulan Akhir
                </h2>
              </div>
            </div>
          </div>
          <div className={`mt-4 space-y-4 font-semibold text-slate-900 dark:text-slate-100 ${fs.conclusion}`}>
            {book.conclusion
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
          </div>
        </section>

        {/* Fitur Khas ringkasnya.id: Action Checklist Interaktif */}
        <section className="mt-8 rounded-2xl border-2 border-emerald-500/30 bg-white p-6 sm:p-8 shadow-sm dark:border-emerald-700/40 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ListChecks className="h-5 w-5" />
                <span className={`${fs.label} font-bold uppercase tracking-wider`}>
                  Action Checklist Interaktif
                </span>
              </div>
              <h2 className={`mt-1 ${fs.blockHeading} font-extrabold text-slate-900 dark:text-slate-50`}>
                Jangan Hanya Dibaca—Mari Praktikkan!
              </h2>
              <p className={`mt-1 ${fs.subtext} text-slate-600 dark:text-slate-300`}>
                Centang langkah-langkah di bawah ini setelah Anda mempraktikkannya.
                Progres Anda tersimpan otomatis di perangkat ini.
              </p>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {completedCount} dari {totalChecklist} Selesai ({progressPercent}%)
              </span>
              <div className="mt-1.5 h-2.5 w-36 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {book.actionChecklist.map((action, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <label
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all ${
                    isChecked
                      ? "border-emerald-300 bg-emerald-50/60 text-slate-500 line-through dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-slate-400"
                      : "border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900"
                  />
                  <span className={`${fs.lead} font-medium`}>
                    {action}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Kutipan Berkesan (Shareable Quotes) */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
            <Quote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className={`${fs.blockHeading} font-extrabold`}>
              Kutipan Berkesan ({book.quotes.length})
            </h2>
          </div>
          <p className={`mt-1 ${fs.subtext} text-slate-500 dark:text-slate-400`}>
            Klik tombol salin untuk membagikan kutipan favoritmu ke WhatsApp atau
            media sosial.
          </p>

          <div className="mt-5 grid gap-4">
            {book.quotes.map((quote, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50 sm:flex-row sm:items-center"
              >
                <blockquote className={`${fs.lead} font-semibold italic text-slate-800 dark:text-slate-100`}>
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <button
                  type="button"
                  onClick={() => handleCopyQuote(quote, idx)}
                  className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400 sm:self-center"
                >
                  {copiedQuoteIdx === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Kutipan</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Rekomendasi Buku Lainnya */}
        {relatedBooks.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
              Lanjutkan Membaca Buku Lainnya
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedBooks.map((other) => (
                <a
                  key={other.slug}
                  href={`/buku/${other.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
                >
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {other.category}
                    </span>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 dark:text-slate-50 dark:group-hover:text-emerald-400">
                      {other.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {other.author} • {other.readingTimeMinutes} menit baca
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                      {other.tagline}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Baca Ringkasan →
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
