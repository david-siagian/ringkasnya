import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Download, Share2, X } from "lucide-react";

type CardThemeId = "emerald" | "slate" | "cream";
type CardRatioId = "square" | "portrait";

interface QuoteCardModalProps {
  quote: string | null;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  bookSlug: string;
  onClose: () => void;
}

const CARD_THEMES: Record<
  CardThemeId,
  {
    label: string;
    swatch: string;
    bgStart: string;
    bgEnd: string;
    glow: string;
    border: string;
    pillBg: string;
    pillText: string;
    quoteMark: string;
    textPrimary: string;
    textMuted: string;
    brandText: string;
  }
> = {
  emerald: {
    label: "Emerald",
    swatch: "bg-emerald-800",
    bgStart: "#064e3b",
    bgEnd: "#022c22",
    glow: "rgba(16, 185, 129, 0.22)",
    border: "rgba(167, 243, 208, 0.22)",
    pillBg: "rgba(255, 255, 255, 0.14)",
    pillText: "#d1fae5",
    quoteMark: "rgba(52, 211, 153, 0.4)",
    textPrimary: "#ffffff",
    textMuted: "#a7f3d0",
    brandText: "rgba(255, 255, 255, 0.72)",
  },
  slate: {
    label: "Gelap",
    swatch: "bg-slate-900",
    bgStart: "#0f172a",
    bgEnd: "#020617",
    glow: "rgba(56, 189, 248, 0.14)",
    border: "rgba(148, 163, 184, 0.22)",
    pillBg: "rgba(255, 255, 255, 0.1)",
    pillText: "#e2e8f0",
    quoteMark: "rgba(16, 185, 129, 0.45)",
    textPrimary: "#f8fafc",
    textMuted: "#94a3b8",
    brandText: "rgba(226, 232, 240, 0.68)",
  },
  cream: {
    label: "Kertas",
    swatch: "bg-amber-50 border border-stone-300",
    bgStart: "#fdfbf7",
    bgEnd: "#f3efe6",
    glow: "rgba(16, 185, 129, 0.1)",
    border: "rgba(120, 113, 108, 0.22)",
    pillBg: "rgba(5, 150, 105, 0.1)",
    pillText: "#047857",
    quoteMark: "rgba(5, 150, 105, 0.28)",
    textPrimary: "#1c1917",
    textMuted: "#57534e",
    brandText: "#047857",
  },
};

const CARD_RATIOS: Record<
  CardRatioId,
  { label: string; width: number; height: number }
> = {
  square: { label: "1:1 Persegi", width: 1080, height: 1080 },
  portrait: { label: "4:5 Potret", width: 1080, height: 1350 },
};

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

export default function QuoteCardModal({
  quote,
  bookTitle,
  bookAuthor,
  bookCategory,
  bookSlug,
  onClose,
}: QuoteCardModalProps) {
  const [themeId, setThemeId] = useState<CardThemeId>("emerald");
  const [ratioId, setRatioId] = useState<CardRatioId>("square");
  const [downloaded, setDownloaded] = useState(false);
  const [canShareFile, setCanShareFile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    setCanShareFile(
      typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function"
    );
  }, []);

  useEffect(() => {
    if (!quote) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [quote, onClose]);

  useEffect(() => {
    if (!quote) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = CARD_THEMES[themeId];
    const { width, height } = CARD_RATIOS[ratioId];
    canvas.width = width;
    canvas.height = height;

    // 1. Latar gradien
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.bgStart);
    gradient.addColorStop(1, theme.bgEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Cahaya dekoratif halus
    const glow = ctx.createRadialGradient(
      width * 0.85,
      height * 0.15,
      20,
      width * 0.85,
      height * 0.15,
      width * 0.65
    );
    glow.addColorStop(0, theme.glow);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 3. Bingkai tipis bagian dalam
    const inset = 44;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, inset, inset, width - inset * 2, height - inset * 2, 36);
    ctx.stroke();

    const padX = 96;
    const contentWidth = width - padX * 2;

    // 4. Pill Kategori di atas
    ctx.font = '600 26px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    const categoryText = bookCategory.toUpperCase();
    const pillWidth = Math.min(contentWidth, ctx.measureText(categoryText).width + 52);
    const pillHeight = 52;
    const pillY = 96;
    ctx.fillStyle = theme.pillBg;
    drawRoundedRect(ctx, padX, pillY, pillWidth, pillHeight, 26);
    ctx.fill();

    ctx.fillStyle = theme.pillText;
    ctx.textBaseline = "middle";
    ctx.fillText(categoryText, padX + 26, pillY + pillHeight / 2 + 1);

    // 5. Tanda kutip dekoratif
    ctx.font = '700 130px Georgia, "Times New Roman", serif';
    ctx.fillStyle = theme.quoteMark;
    ctx.textBaseline = "top";
    ctx.fillText("“", padX - 6, pillY + 86);

    // 6. Teks kutipan dengan ukuran adaptif
    const formattedQuote = `“${quote}”`;
    let fontSize = quote.length > 180 ? 38 : quote.length > 110 ? 44 : 52;
    let lines: string[] = [];
    let lineHeight = 0;

    const maxTextHeight = height - 470;
    while (fontSize >= 28) {
      ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
      lines = wrapLines(ctx, formattedQuote, contentWidth);
      lineHeight = Math.round(fontSize * 1.42);
      if (lines.length * lineHeight <= maxTextHeight) break;
      fontSize -= 2;
    }

    const totalTextHeight = lines.length * lineHeight;
    const textStartY = Math.max(
      pillY + 180,
      Math.round((height - totalTextHeight - 90) / 2)
    );

    ctx.fillStyle = theme.textPrimary;
    ctx.textBaseline = "top";
    lines.forEach((line, idx) => {
      ctx.fillText(line, padX, textStartY + idx * lineHeight);
    });

    // 7. Footer: Judul buku, penulis, & branding ringkasnya.id
    const footerY = height - 154;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, footerY - 26);
    ctx.lineTo(width - padX, footerY - 26);
    ctx.stroke();

    ctx.fillStyle = theme.textPrimary;
    ctx.font = '700 30px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    ctx.fillText(bookTitle, padX, footerY);

    ctx.fillStyle = theme.textMuted;
    ctx.font = '500 24px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    ctx.fillText(bookAuthor, padX, footerY + 42);

    ctx.fillStyle = theme.brandText;
    ctx.font = '700 26px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    const brandLabel = "ringkasnya.id";
    const brandWidth = ctx.measureText(brandLabel).width;
    ctx.fillText(brandLabel, width - padX - brandWidth, footerY + 20);
  }, [quote, bookTitle, bookAuthor, bookCategory, themeId, ratioId]);

  if (!mounted || !quote) return null;

  const exportBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve(null);
        return;
      }
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });

  const handleDownload = async () => {
    const blob = await exportBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bookSlug}-kutipan.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2000);
  };

  const handleShare = async () => {
    const blob = await exportBlob();
    if (!blob) return;
    const file = new File([blob], `${bookSlug}-kutipan.png`, {
      type: "image/png",
    });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Kutipan ${bookTitle}`,
          text: `"${quote}" — ${bookTitle} (${bookAuthor})`,
        });
      } catch {
        // Pengguna membatalkan dialog share
      }
    } else {
      await handleDownload();
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-card-modal-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fade-slide relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3
              id="quote-card-modal-title"
              className="text-base sm:text-lg font-extrabold text-ink"
            >
              Buat Kartu Kutipan
            </h3>
            <p className="text-xs text-ink-subtle">
              Pilih tema & rasio lalu unduh sebagai gambar PNG.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal kartu kutipan"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-muted transition hover:bg-page hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preview Canvas */}
        <div className="mt-4 flex justify-center rounded-xl bg-page p-3">
          <canvas
            ref={canvasRef}
            className="max-h-[48vh] w-auto max-w-full rounded-xl shadow-md"
          />
        </div>

        {/* Pengaturan Tema & Rasio */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(Object.keys(CARD_THEMES) as CardThemeId[]).map((id) => {
              const item = CARD_THEMES[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setThemeId(id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                    themeId === id
                      ? "border-accent-strong bg-accent-soft text-accent-text"
                      : "border-line bg-surface text-ink-muted hover:bg-page"
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full ${item.swatch}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-surface-subtle p-1">
            {(Object.keys(CARD_RATIOS) as CardRatioId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setRatioId(id)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  ratioId === id
                    ? "bg-surface text-ink shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {CARD_RATIOS[id].label}
              </button>
            ))}
          </div>
        </div>

        {/* Aksi Unduh / Bagikan */}
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
          {canShareFile && (
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-ink transition hover:bg-page"
            >
              <Share2 className="h-4 w-4" />
              Bagikan
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            {downloaded ? (
              <>
                <Check className="h-4 w-4" />
                <span>Terunduh!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Unduh PNG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
