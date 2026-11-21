import { useState, useEffect, useRef } from "react";
import type { BookSummary } from "@/types/book";
import {
  AlertCircle,
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

/** Offset scroll untuk tiap Poin Inti: tinggi navbar + toolbar reader (keduanya sticky). */
const TAKEAWAY_SCROLL_MARGIN =
  "calc(var(--header-h) + var(--reader-toolbar-h) + 16px)";

/** Salin teks ke clipboard; fallback ke execCommand untuk browser/webview tanpa Clipboard API. */
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // lanjut ke fallback
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

type CopyFeedback = { index: number; status: "success" | "error" } | null;

export default function BookReader({ book, relatedBooks }: BookReaderProps) {
  const [readMode, setReadMode] = useState<"deep" | "quick">("deep");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const copyTimerRef = useRef<number | undefined>(undefined);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const storageKey = `ringkasnya_checklist_${book.slug}`;

  // Sinkronkan tinggi toolbar sticky (bisa 2 baris di mobile) ke CSS var `--reader-toolbar-h`
  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const root = document.documentElement;
    const updateToolbarHeight = () => {
      root.style.setProperty("--reader-toolbar-h", `${toolbar.offsetHeight}px`);
    };

    updateToolbarHeight();
    const observer = new ResizeObserver(updateToolbarHeight);
    observer.observe(toolbar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--reader-toolbar-h");
    };
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(copyTimerRef.current);
  }, []);

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

  const handleCopyQuote = async (quote: string, index: number) => {
    const textToCopy = `"${quote}" — ${book.title} (${book.author}) via Ringkasnya`;
    const copied = await copyTextToClipboard(textToCopy);
    setCopyFeedback({ index, status: copied ? "success" : "error" });
    window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(
      () => setCopyFeedback(null),
      copied ? 2000 : 3500
    );
  };

  const fs = FONT_SCALES[fontSize];

  return (
    <div className="min-h-screen bg-page pb-20">
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
      <div
        ref={toolbarRef}
        style={{ top: "var(--header-h)" }}
        className="sticky z-40 border-b border-line bg-surface/95 shadow-sm backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Toggle Mode Kilat vs Mendalam */}
          <div className="flex items-center rounded-xl bg-surface-subtle p-1">
            <button
              type="button"
              onClick={() => setReadMode("deep")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                readMode === "deep"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <BookOpen className="h-4 w-4 text-accent-strong" />
              <span>Mendalam ({book.readingTimeMinutes} mnt)</span>
            </button>
            <button
              type="button"
              onClick={() => setReadMode("quick")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                readMode === "quick"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Kilat ({book.quickTimeMinutes} mnt)</span>
            </button>
          </div>

          {/* Kontrol Ukuran Teks */}
          <div className="flex items-center gap-1.5">
            <Type className="h-4 w-4 text-ink-faint mr-1 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setFontSize("sm")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "sm"
                  ? "border-accent-strong bg-accent-soft text-accent-text"
                  : "border-line text-ink-muted hover:bg-page"
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize("base")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "base"
                  ? "border-accent-strong bg-accent-soft text-accent-text"
                  : "border-line text-ink-muted hover:bg-page"
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize("lg")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                fontSize === "lg"
                  ? "border-accent-strong bg-accent-soft text-accent-text"
                  : "border-line text-ink-muted hover:bg-page"
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
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-warm-line bg-warm-soft p-4 text-warm-heading">
            <Zap className="h-5 w-5 shrink-0 text-warm-text" />
            <p className={`${fs.subtext} font-medium`}>
              <strong>Mode Kilat Aktif:</strong> Menampilkan intisari tiap bab
              dan tips praktis agar Anda bisa menangkap ide utama buku ini dalam{" "}
              {book.quickTimeMinutes} menit.
            </p>
          </div>
        )}

        {/* Seksi Sinopsis & Untuk Siapa Buku Ini */}
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
          <h2 className={`${fs.sectionHeading} font-bold text-ink`}>
            Sinopsis
          </h2>
          <p className={`mt-2.5 text-ink-secondary ${fs.body}`}>
            {book.synopsis}
          </p>

          <div className="mt-6 rounded-xl border border-line-subtle bg-page p-5">
            <h3 className={`flex items-center gap-2 ${fs.compact} font-bold text-ink`}>
              <Target className="h-4 w-4 text-accent-strong" />
              Buku Ini Sangat Cocok Untuk:
            </h3>
            <ul className="mt-3 space-y-2">
              {book.whoIsItFor.map((target, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-2.5 ${fs.compact} text-ink-secondary`}
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                  <span>{target}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Daftar Isi Cepat */}
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
          <h2 className={`${fs.label} font-bold uppercase tracking-wider text-ink-subtle`}>
            Daftar Poin Inti ({book.keyTakeaways.length} Bab Ringkas)
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {book.keyTakeaways.map((item) => (
              <a
                key={item.number}
                href={`#poin-${item.number}`}
                className={`flex items-center gap-2.5 rounded-xl border border-line-subtle bg-page/70 px-3.5 py-2.5 ${fs.subtext} font-medium text-ink-secondary transition hover:border-accent-line hover:bg-accent-soft/70 hover:text-accent-text`}
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
              style={{ scrollMarginTop: TAKEAWAY_SCROLL_MARGIN }}
              className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">
                  {takeaway.number}
                </span>
                <span className={`${fs.label} font-bold uppercase tracking-wider text-accent-text`}>
                  Poin Inti #{takeaway.number}
                </span>
              </div>

              <h3 className={`mt-3 ${fs.takeawayTitle} font-extrabold text-ink`}>
                {takeaway.title}
              </h3>

              {/* Box Intisari Kilat */}
              <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-accent-soft p-4">
                <p className={`${fs.label} font-bold uppercase tracking-wider text-accent-text`}>
                  ⚡ Intisari Bab
                </p>
                <p className={`mt-1 ${fs.lead} font-semibold text-ink`}>
                  {takeaway.quickSummary}
                </p>
              </div>

              {/* Penjelasan Mendalam (Hanya muncul di Mode Mendalam) */}
              {readMode === "deep" && (
                <div className={`animate-fade-slide mt-5 space-y-4 text-ink-secondary ${fs.body}`}>
                  {takeaway.deepContent.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Tips Praktis */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-warm-line bg-warm-soft p-4">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-warm-text" />
                <div>
                  <span className={`${fs.label} font-bold uppercase tracking-wider text-warm-heading`}>
                    Tips Praktis Langsung Coba:
                  </span>
                  <p className={`mt-0.5 ${fs.compact} text-ink-secondary`}>
                    {takeaway.practicalTip}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Kesimpulan Akhir */}
        <section className="mt-8 rounded-2xl border-2 border-accent-line border-l-[6px] border-l-emerald-600 dark:border-l-emerald-500 bg-gradient-to-br from-accent-tint/75 via-accent-soft/70 to-surface p-6 sm:p-8 shadow-md shadow-emerald-950/5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <span className={`block ${fs.micro} font-bold uppercase tracking-wider text-accent-text`}>
                  Final Takeaway
                </span>
                <h2 className={`${fs.conclusionHeading} font-extrabold text-ink`}>
                  Kesimpulan Akhir
                </h2>
              </div>
            </div>
          </div>
          <div className={`mt-4 space-y-4 font-semibold text-ink ${fs.conclusion}`}>
            {book.conclusion
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
          </div>
        </section>

        {/* Fitur Khas Ringkasnya: Action Checklist Interaktif */}
        <section className="mt-8 rounded-2xl border-2 border-accent-line/70 bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-accent-text">
                <ListChecks className="h-5 w-5" />
                <span className={`${fs.label} font-bold uppercase tracking-wider`}>
                  Action Checklist Interaktif
                </span>
              </div>
              <h2 className={`mt-1 ${fs.blockHeading} font-extrabold text-ink`}>
                Jangan Hanya Dibaca—Mari Praktikkan!
              </h2>
              <p className={`mt-1 ${fs.subtext} text-ink-muted`}>
                Centang langkah-langkah di bawah ini setelah Anda mempraktikkannya.
                Progres Anda tersimpan otomatis di perangkat ini.
              </p>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-ink-secondary">
                {completedCount} dari {totalChecklist} Selesai ({progressPercent}%)
              </span>
              <div className="mt-1.5 h-2.5 w-36 overflow-hidden rounded-full bg-surface-subtle">
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
                  className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all ${
                    isChecked
                      ? "border-accent-line bg-accent-soft/70 text-ink-subtle line-through"
                      : "border-line bg-surface text-ink-secondary hover:border-accent-line hover:bg-page"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleChecklist(idx)}
                    className="mt-1 h-4 w-4 rounded border-line-strong bg-surface text-emerald-600 focus:ring-emerald-500"
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
        <section className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-ink">
            <Quote className="h-5 w-5 text-accent-strong" />
            <h2 className={`${fs.blockHeading} font-extrabold`}>
              Kutipan Berkesan ({book.quotes.length})
            </h2>
          </div>
          <p className={`mt-1 ${fs.subtext} text-ink-subtle`}>
            Klik tombol salin untuk membagikan kutipan favoritmu ke WhatsApp atau
            media sosial.
          </p>

          <div className="mt-5 grid gap-4">
            {book.quotes.map((quote, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between gap-4 rounded-xl border border-line-subtle bg-page p-5 sm:flex-row sm:items-center"
              >
                <blockquote className={`${fs.lead} font-semibold italic text-ink`}>
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <button
                  type="button"
                  onClick={() => handleCopyQuote(quote, idx)}
                  className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary shadow-sm transition hover:border-accent-strong hover:text-accent-text sm:self-center"
                >
                  {copyFeedback?.index === idx &&
                  copyFeedback.status === "success" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-accent-strong" />
                      <span className="text-accent-text">Tersalin!</span>
                    </>
                  ) : copyFeedback?.index === idx &&
                    copyFeedback.status === "error" ? (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-rose-600 dark:text-rose-400">
                        Gagal menyalin
                      </span>
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
            <h2 className="text-xl font-extrabold text-ink">
              Lanjutkan Membaca Buku Lainnya
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedBooks.map((other) => (
                <a
                  key={other.slug}
                  href={`/buku/${other.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-accent-strong hover:shadow-md"
                >
                  <div>
                    <span className="text-xs font-bold text-accent-strong">
                      {other.category}
                    </span>
                    <h3 className="mt-1 text-lg font-extrabold text-ink group-hover:text-accent-strong">
                      {other.title}
                    </h3>
                    <p className="text-xs text-ink-subtle">
                      {other.author} • {other.readingTimeMinutes} menit baca
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs text-ink-muted">
                      {other.tagline}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-accent-text">
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
