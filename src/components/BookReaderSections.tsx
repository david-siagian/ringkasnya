import { useEffect, useRef, useState } from "react";
import type { BookCatalogItem, BookSummary } from "@/types/book";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  ImageDown,
  Layers,
  LayoutGrid,
  Lightbulb,
  Quote,
  Sparkles,
  Target,
} from "lucide-react";

export const FONT_SCALES = {
  sm: {
    micro: "text-[10px]",
    label: "text-[11px]",
    subtext: "text-[11px] sm:text-xs",
    compact: "text-xs",
    lead: "text-xs sm:text-sm",
    body: "text-xs sm:text-sm leading-relaxed",
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
    body: "text-sm sm:text-base leading-relaxed",
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
    body: "text-base sm:text-lg leading-relaxed",
    sectionHeading: "text-xl",
    conclusionHeading: "text-xl sm:text-2xl",
    blockHeading: "text-2xl",
    takeawayTitle: "text-2xl sm:text-3xl",
  },
} as const;

export type FontScale = (typeof FONT_SCALES)[keyof typeof FONT_SCALES];
export type CopyFeedback = { index: number; status: "success" | "error" } | null;

interface IntroSectionProps {
  book: BookSummary;
  fs: FontScale;
  mode: "quick" | "deep";
  onSelectTakeaway?: (takeawayNumber: number) => void;
  onStartDeepReading?: () => void;
}

/** Bagian pengantar reader: Sinopsis ringkas, akordeon target pembaca, dan Daftar Poin Inti. */
export function IntroSection({
  book,
  fs,
  mode,
  onSelectTakeaway,
  onStartDeepReading,
}: IntroSectionProps) {
  const firstTakeaway = book.keyTakeaways[0];

  return (
    <>
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
        <h2 className={`${fs.sectionHeading} font-bold text-ink`}>Sinopsis</h2>
        <p className={`mt-2.5 text-ink-secondary ${fs.body}`}>
          {book.synopsis}
        </p>

        {book.whoIsItFor.length > 0 && (
          <details className="group mt-5 rounded-xl border border-line-subtle bg-page">
            <summary
              className={`flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 ${fs.compact} font-bold text-ink select-none [&::-webkit-details-marker]:hidden`}
            >
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4 shrink-0 text-accent-strong" />
                <span>Buku Ini Sangat Cocok Untuk Siapa?</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-t border-line-subtle px-4 pb-4 pt-3">
              <ul className="space-y-2">
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
          </details>
        )}
      </div>

      {/* Daftar Isi Poin Inti */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            className={`${fs.label} font-bold uppercase tracking-wider text-ink-subtle`}
          >
            Daftar Poin Inti ({book.keyTakeaways.length} Bab Ringkas)
          </h2>
          {mode === "deep" && (
            <span className={`${fs.micro} font-medium text-ink-muted`}>
              Klik poin untuk langsung menuju bab tersebut
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {book.keyTakeaways.map((item, idx) =>
            mode === "deep" && onSelectTakeaway ? (
              <button
                key={item.number}
                type="button"
                onClick={() => onSelectTakeaway(idx + 1)}
                className={`group flex w-full items-start gap-2.5 rounded-xl border border-line-subtle bg-page/70 px-3.5 py-2.5 text-left ${fs.subtext} font-medium text-ink-secondary transition hover:border-accent-line hover:bg-accent-soft/70 hover:text-accent-text`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {item.number}
                </span>
                <span className="flex-1">{item.title}</span>
              </button>
            ) : (
              <a
                key={item.number}
                href={`#poin-${item.number}`}
                onClick={(event) => {
                  if (!onSelectTakeaway) return;
                  event.preventDefault();
                  onSelectTakeaway(item.number);
                }}
                className={`flex items-start gap-2.5 rounded-xl border border-line-subtle bg-page/70 px-3.5 py-2.5 ${fs.subtext} font-medium text-ink-secondary transition hover:border-accent-line hover:bg-accent-soft/70 hover:text-accent-text`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {item.number}
                </span>
                <span>{item.title}</span>
              </a>
            )
          )}
        </div>

        {mode === "deep" && onStartDeepReading && (
          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line-subtle pt-5 sm:flex-row">
            <p className={`${fs.subtext} text-ink-muted text-center sm:text-left`}>
              {firstTakeaway
                ? `Siap menyelami isi buku bab demi bab mulai dari Poin Inti 1?`
                : "Lanjut ke bagian penutup buku."}
            </p>
            <button
              type="button"
              onClick={onStartDeepReading}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98] sm:w-auto"
            >
              <BookOpen className="h-4 w-4" />
              <span>
                {firstTakeaway ? "Baca Poin Inti 1" : "Baca Kesimpulan Akhir"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

interface TakeawayCardProps {
  takeaway: BookSummary["keyTakeaways"][number];
  fs: FontScale;
  showDeepContent: boolean;
  scrollMarginTop?: string;
}

/** Kartu satu Poin Inti (mendukung Mode Kilat maupun Mode Mendalam). */
export function TakeawayCard({
  takeaway,
  fs,
  showDeepContent,
  scrollMarginTop,
}: TakeawayCardProps) {
  return (
    <article
      id={`poin-${takeaway.number}`}
      style={scrollMarginTop ? { scrollMarginTop } : undefined}
      className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-extrabold text-white">
          {takeaway.number}
        </span>
        <span
          className={`${fs.label} font-bold uppercase tracking-wider text-accent-text`}
        >
          Poin Inti #{takeaway.number}
        </span>
      </div>

      <h3 className={`mt-3 ${fs.takeawayTitle} font-extrabold text-ink`}>
        {takeaway.title}
      </h3>

      {/* Box Intisari Kilat */}
      <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-accent-soft p-4">
        <p
          className={`${fs.label} font-bold uppercase tracking-wider text-accent-text`}
        >
          ⚡ Intisari Bab
        </p>
        <p className={`mt-1 ${fs.lead} font-semibold text-ink`}>
          {takeaway.quickSummary}
        </p>
      </div>

      {/* Penjelasan Mendalam */}
      {showDeepContent && (
        <div
          className={`animate-fade-slide mt-5 space-y-4 text-ink-secondary ${fs.body}`}
        >
          {takeaway.deepContent.map((paragraph, pIdx) => (
            <p key={pIdx}>{paragraph}</p>
          ))}
        </div>
      )}

      {/* Hal yang Perlu Diingat */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-warm-line bg-warm-soft p-4">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-warm-text" />
        <div>
          <span
            className={`${fs.label} font-bold uppercase tracking-wider text-warm-heading`}
          >
            Hal yang Perlu Diingat:
          </span>
          <p className={`mt-0.5 ${fs.compact} text-ink-secondary`}>
            {takeaway.keyNote}
          </p>
        </div>
      </div>
    </article>
  );
}

interface ConclusionSectionProps {
  conclusion: string;
  fs: FontScale;
  scrollMarginTop?: string;
}

/** Bagian Kesimpulan Akhir buku. */
export function ConclusionSection({
  conclusion,
  fs,
  scrollMarginTop,
}: ConclusionSectionProps) {
  return (
    <section
      id="kesimpulan-akhir"
      style={scrollMarginTop ? { scrollMarginTop } : undefined}
      className="rounded-2xl border-2 border-accent-line border-l-[6px] border-l-emerald-600 dark:border-l-emerald-500 bg-gradient-to-br from-accent-tint/75 via-accent-soft/70 to-surface p-6 sm:p-8 shadow-md shadow-emerald-950/5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <span
              className={`block ${fs.micro} font-bold uppercase tracking-wider text-accent-text`}
            >
              Final Takeaway
            </span>
            <h2 className={`${fs.conclusionHeading} font-extrabold text-ink`}>
              Kesimpulan Akhir
            </h2>
          </div>
        </div>
      </div>
      <div className={`mt-4 space-y-4 font-semibold text-ink ${fs.body}`}>
        {conclusion
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
      </div>
    </section>
  );
}

interface KeyConceptsSectionProps {
  keyConcepts: BookSummary["keyConcepts"];
  fs: FontScale;
}

/** Daftar kartu Konsep Kunci sebagai rangkuman gagasan utama buku. */
export function KeyConceptsSection({
  keyConcepts,
  fs,
}: KeyConceptsSectionProps) {
  return (
    <section className="mt-8 rounded-2xl border-2 border-accent-line/70 bg-surface p-6 sm:p-8 shadow-sm">
      <div>
        <div className="inline-flex items-center gap-2 text-accent-text">
          <Layers className="h-5 w-5" />
          <span className={`${fs.label} font-bold uppercase tracking-wider`}>
            Konsep Kunci ({keyConcepts.length})
          </span>
        </div>
        <h2 className={`mt-1 ${fs.blockHeading} font-extrabold text-ink`}>
          Gagasan Utama yang Perlu Dibawa Pulang
        </h2>
        <p className={`mt-1 ${fs.subtext} text-ink-muted`}>
          Rangkuman konsep inti dari buku ini dalam bahasa yang ringkas agar
          mudah diingat kembali kapan saja.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {keyConcepts.map((concept, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-line bg-page/70 p-4 sm:p-5 transition-colors hover:border-accent-line"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h3 className={`${fs.lead} font-extrabold text-ink`}>
                  {concept.title}
                </h3>
                <p className={`mt-1.5 ${fs.compact} leading-relaxed text-ink-secondary`}>
                  {concept.explanation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface QuotesSectionProps {
  quotes: string[];
  copyFeedback: CopyFeedback;
  onCopyQuote: (quote: string, index: number) => void;
  onOpenQuoteCard: (quote: string) => void;
  fs: FontScale;
}

/** Daftar kutipan berkesan dengan tombol salin dan buat kartu PNG. */
export function QuotesSection({
  quotes,
  copyFeedback,
  onCopyQuote,
  onOpenQuoteCard,
  fs,
}: QuotesSectionProps) {
  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 text-ink">
        <Quote className="h-5 w-5 text-accent-strong" />
        <h2 className={`${fs.blockHeading} font-extrabold`}>
          Kutipan Berkesan ({quotes.length})
        </h2>
      </div>
      <p className={`mt-1 ${fs.subtext} text-ink-subtle`}>
        Klik tombol salin untuk membagikan kutipan favoritmu ke WhatsApp atau
        media sosial.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4">
        {quotes.map((quote, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between gap-4 rounded-xl border border-line-subtle bg-page p-5 sm:flex-row sm:items-center"
          >
            <blockquote className={`${fs.lead} font-semibold italic text-ink`}>
              &ldquo;{quote}&rdquo;
            </blockquote>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:self-center">
              <button
                type="button"
                onClick={() => onCopyQuote(quote, idx)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary shadow-sm transition hover:border-accent-strong hover:text-accent-text"
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

              <button
                type="button"
                onClick={() => onOpenQuoteCard(quote)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-white"
              >
                <ImageDown className="h-3.5 w-3.5" />
                <span>Buat Kartu</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Rekomendasi buku lainnya & CTA menuju halaman katalog. */
export function RelatedBooksSection({
  relatedBooks,
}: {
  relatedBooks: BookCatalogItem[];
}) {
  return (
    <section className="mt-12">
      {relatedBooks.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-ink">
              Lanjutkan Membaca Buku Lainnya
            </h2>
            <a
              href="/katalog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-text transition hover:text-accent-strong"
            >
              <span>Lihat Semua Katalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedBooks.map((other) => (
              <a
                key={other.slug}
                href={`/buku/${other.slug}`}
                className="group flex min-w-0 items-start gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-strong hover:shadow-md sm:p-5"
              >
                <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-line/70 sm:w-24">
                  {other.coverImage ? (
                    <img
                      src={other.coverImage}
                      alt={`Ilustrasi sampul buku ${other.title}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center bg-slate-900 bg-gradient-to-br ${other.coverGradient} p-2 text-white`}
                    >
                      <BookOpen className="h-6 w-6 opacity-85" />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
                  <div>
                    <span className="text-[11px] font-bold text-accent-strong">
                      {other.category}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-base font-extrabold leading-snug text-ink group-hover:text-accent-strong sm:text-lg">
                      {other.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-ink-subtle">
                      {other.author} • {other.readingTimeMinutes} menit baca
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs text-ink-muted">
                      {other.tagline}
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-text group-hover:text-accent-strong">
                    <span>Baca Ringkasan</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      <div
        className={
          relatedBooks.length > 0
            ? "mt-6 flex justify-center"
            : "flex justify-center"
        }
      >
        <a
          href="/katalog"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] sm:w-auto"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Jelajahi Katalog Buku</span>
        </a>
      </div>
    </section>
  );
}

interface DeepStepDropdownProps {
  currentStep: number;
  keyTakeaways: BookSummary["keyTakeaways"];
  finalStep: number;
  onSelectStep: (step: number) => void;
}

/** Dropdown kustom untuk melompat cepat antar halaman di Mode Mendalam. */
export function DeepStepDropdown({
  currentStep,
  keyTakeaways,
  finalStep,
  onSelectStep,
}: DeepStepDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const totalTakeaways = keyTakeaways.length;

  useEffect(() => {
    setIsOpen(false);
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activeTakeaway =
    currentStep >= 1 && currentStep <= totalTakeaways
      ? keyTakeaways[currentStep - 1]
      : null;

  const triggerLabel =
    currentStep === 0
      ? "Pengantar"
      : activeTakeaway
        ? `Poin ${activeTakeaway.number}/${totalTakeaways}: ${activeTakeaway.title}`
        : "Penutup: Kesimpulan & Konsep";

  const handleChoose = (step: number) => {
    setIsOpen(false);
    onSelectStep(step);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Pilih halaman ringkasan"
        className="inline-flex max-w-[220px] sm:max-w-xs items-center gap-2 rounded-xl border border-line bg-page px-3 py-1.5 text-xs font-semibold text-ink shadow-sm transition hover:border-accent-line hover:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-ink-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Daftar halaman Mode Mendalam"
          className="animate-fade-slide absolute right-0 z-30 mt-2 w-[min(calc(100vw-2.5rem),22rem)] overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <div className="max-h-72 space-y-0.5 overflow-y-auto pr-0.5">
            <button
              type="button"
              role="option"
              aria-selected={currentStep === 0}
              onClick={() => handleChoose(0)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
                currentStep === 0
                  ? "bg-accent-soft font-bold text-accent-text"
                  : "font-medium text-ink-secondary hover:bg-page hover:text-ink"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                  currentStep === 0
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-subtle text-ink-muted"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 truncate">Pengantar &amp; Sinopsis</span>
              {currentStep === 0 && (
                <Check className="h-3.5 w-3.5 shrink-0 text-accent-strong" />
              )}
            </button>

            {keyTakeaways.map((item, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              return (
                <button
                  key={item.number}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleChoose(stepNum)}
                  className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
                    isActive
                      ? "bg-accent-soft font-bold text-accent-text"
                      : "font-medium text-ink-secondary hover:bg-page hover:text-ink"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-surface-subtle text-ink-muted"
                    }`}
                  >
                    {item.number}
                  </span>
                  <span className="flex-1 line-clamp-2 leading-snug">
                    {item.title}
                  </span>
                  {isActive && (
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-strong" />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              role="option"
              aria-selected={currentStep === finalStep}
              onClick={() => handleChoose(finalStep)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
                currentStep === finalStep
                  ? "bg-accent-soft font-bold text-accent-text"
                  : "font-medium text-ink-secondary hover:bg-page hover:text-ink"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                  currentStep === finalStep
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-subtle text-ink-muted"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 truncate">
                Penutup: Kesimpulan &amp; Konsep
              </span>
              {currentStep === finalStep && (
                <Check className="h-3.5 w-3.5 shrink-0 text-accent-strong" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
