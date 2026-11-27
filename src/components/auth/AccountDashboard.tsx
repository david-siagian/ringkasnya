import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  LogOut,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Mail,
  Calendar,
  Bookmark,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";

export interface AccountProgressBookItem {
  bookSlug: string;
  isBookmarked: boolean;
  lastMode: "quick" | "deep";
  progressPercent: number;
  updatedAt: number;
  title: string;
  author: string;
  category: string;
  coverGradient: string;
  coverImage: string | null;
  quickTimeMinutes: number;
  readingTimeMinutes: number;
}

interface AccountDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
    plan: string;
    emailVerified: boolean;
    createdAt: string;
  };
  initialProgressItems?: AccountProgressBookItem[];
}

type ProgressTab = "all" | "reading" | "bookmarked" | "completed";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AccountDashboard({
  user,
  initialProgressItems = [],
}: AccountDashboardProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ProgressTab>("all");

  useEffect(() => {
    if (!showSignOutModal) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSigningOut) {
        setShowSignOutModal(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showSignOutModal, isSigningOut]);

  const { isBookmarked, toggleBookmark, mounted: bookmarksMounted } =
    useBookmarks();
  const { isCompleted, mounted: completedMounted } = useCompletedBooks();

  const isPro = user.plan === "pro";
  const joinedDate = new Date(user.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const normalizedItems = useMemo(() => {
    return initialProgressItems.map((item) => {
      const bookmarked = bookmarksMounted
        ? isBookmarked(item.bookSlug)
        : item.isBookmarked;
      const completed = completedMounted
        ? isCompleted(item.bookSlug) || item.progressPercent >= 100
        : item.progressPercent >= 100;
      const progressPercent = completed ? 100 : item.progressPercent;
      return {
        ...item,
        isBookmarked: bookmarked,
        isCompleted: completed,
        progressPercent,
      };
    });
  }, [
    initialProgressItems,
    bookmarksMounted,
    completedMounted,
    isBookmarked,
    isCompleted,
  ]);

  const counts = useMemo(() => {
    const reading = normalizedItems.filter(
      (i) => i.progressPercent > 0 && i.progressPercent < 100
    ).length;
    const bookmarked = normalizedItems.filter((i) => i.isBookmarked).length;
    const completed = normalizedItems.filter((i) => i.isCompleted).length;
    return {
      all: normalizedItems.filter(
        (i) => i.isBookmarked || i.progressPercent > 0
      ).length,
      reading,
      bookmarked,
      completed,
    };
  }, [normalizedItems]);

  const filteredItems = useMemo(() => {
    return normalizedItems.filter((item) => {
      if (activeTab === "reading") {
        return item.progressPercent > 0 && item.progressPercent < 100;
      }
      if (activeTab === "bookmarked") {
        return item.isBookmarked;
      }
      if (activeTab === "completed") {
        return item.isCompleted;
      }
      return item.isBookmarked || item.progressPercent > 0;
    });
  }, [normalizedItems, activeTab]);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch {
      setIsSigningOut(false);
    }
  }

  const tabs: { id: ProgressTab; label: string; count: number }[] = [
    { id: "all", label: "Semua", count: counts.all },
    { id: "reading", label: "Sedang Dibaca", count: counts.reading },
    { id: "bookmarked", label: "Disimpan", count: counts.bookmarked },
    { id: "completed", label: "Selesai", count: counts.completed },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profil */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 px-6 py-7 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-16 w-16 rounded-2xl border-2 border-emerald-400/40 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-400/40 bg-emerald-700/80 text-xl font-extrabold text-white shadow-md">
                  {getInitials(user.name)}
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                    {user.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      isPro
                        ? "border border-amber-300/40 bg-amber-400/20 text-amber-200"
                        : "border border-emerald-300/30 bg-emerald-500/20 text-emerald-100"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    Paket {isPro ? "Pro" : "Gratis"}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-100/90">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSignOutModal(true)}
              disabled={isSigningOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{isSigningOut ? "Keluar..." : "Keluar"}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-xl border border-line-subtle bg-page/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Status Akun
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
              <ShieldCheck className="h-4 w-4 text-accent-strong" />
              <span>Aktif (Tersinkron)</span>
            </p>
          </div>

          <div className="rounded-xl border border-line-subtle bg-page/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Bergabung Sejak
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
              <Calendar className="h-4 w-4 text-accent-strong" />
              <span>{joinedDate}</span>
            </p>
          </div>

          <div className="rounded-xl border border-line-subtle bg-page/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Ringkasan Aktivitas
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
              <CheckCircle2 className="h-4 w-4 text-accent-strong" />
              <span>
                {counts.completed} selesai · {counts.bookmarked} disimpan
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Aktivitas & Progres Baca */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-ink">
              Aktivitas &amp; Progres Baca
            </h2>
            <p className="mt-0.5 text-sm text-ink-muted">
              Bookmark dan progres bacaan Anda tersinkron otomatis lintas perangkat.
            </p>
          </div>

          <a
            href="/katalog"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-line bg-page px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-accent-line hover:text-accent-text"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Jelajahi Katalog</span>
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-line bg-page text-ink-muted hover:border-accent-line hover:text-ink"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface text-ink-subtle"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Daftar Buku */}
        {filteredItems.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-line bg-page/50 px-6 py-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-ink-subtle" />
            <p className="mt-3 text-sm font-semibold text-ink">
              Belum ada buku di kategori ini
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Mulai membaca atau simpan buku favorit dari katalog untuk melihat progresnya di sini.
            </p>
            <a
              href="/katalog"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
            >
              <span>Buka Katalog Buku</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {filteredItems.map((item) => {
              const targetHref =
                item.progressPercent > 0 && item.progressPercent < 100
                  ? item.lastMode === "deep"
                    ? `/buku/${item.bookSlug}?mode=deep&progress=${item.progressPercent}`
                    : `/buku/${item.bookSlug}?mode=quick&read=1&progress=${item.progressPercent}`
                  : `/buku/${item.bookSlug}`;

              return (
                <div
                  key={item.bookSlug}
                  className="group relative flex gap-3.5 rounded-xl border border-line-subtle bg-page/60 p-3.5 transition-all hover:border-accent-line hover:bg-surface"
                >
                  <div
                    className={`relative h-24 w-18 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${item.coverGradient} shadow-xs`}
                  >
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-1.5 text-center text-[10px] font-bold leading-tight text-white">
                        {item.title}
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={targetHref}
                          className="line-clamp-1 text-sm font-bold text-ink transition-colors group-hover:text-accent-text after:absolute after:inset-0 after:z-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent-strong"
                        >
                          {item.title}
                        </a>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(item.bookSlug)}
                          aria-label={
                            item.isBookmarked
                              ? `Hapus bookmark ${item.title}`
                              : `Simpan bookmark ${item.title}`
                          }
                          className={`relative z-10 shrink-0 rounded-lg p-1 transition-colors ${
                            item.isBookmarked
                              ? "text-amber-500 hover:bg-amber-500/10"
                              : "text-ink-subtle hover:bg-surface hover:text-ink"
                          }`}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${
                              item.isBookmarked ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>
                      <p className="line-clamp-1 text-xs text-ink-muted">
                        {item.author}
                      </p>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1 font-medium text-ink-subtle">
                          <Clock className="h-3 w-3" />
                          {item.lastMode === "deep"
                            ? `Mode Mendalam (${item.readingTimeMinutes} mnt)`
                            : `Mode Kilat (${item.quickTimeMinutes} mnt)`}
                        </span>
                        {item.isCompleted ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Selesai
                          </span>
                        ) : item.progressPercent > 0 ? (
                          <span className="font-bold text-accent-text">
                            Lanjutkan • {item.progressPercent}%
                          </span>
                        ) : (
                          <span className="text-ink-subtle">Tersimpan</span>
                        )}
                      </div>

                      {item.progressPercent > 0 && (
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-subtle">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.isCompleted
                                ? "bg-emerald-500"
                                : "bg-accent-strong"
                            }`}
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showSignOutModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/45 backdrop-blur-md dark:bg-black/65"
            onClick={() => {
              if (!isSigningOut) setShowSignOutModal(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-modal-title"
          >
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <div
                className="animate-fade-slide relative w-full max-w-sm rounded-3xl border border-line bg-surface p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setShowSignOutModal(false)}
                  disabled={isSigningOut}
                  aria-label="Tutup konfirmasi keluar"
                  className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-page/80 text-ink-muted transition-colors hover:bg-page hover:text-ink disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400">
                    <LogOut className="h-6 w-6" />
                  </div>
                  <h2
                    id="signout-modal-title"
                    className="text-lg font-extrabold text-ink"
                  >
                    Keluar dari akun?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-subtle">
                    Progres baca dan buku tersimpan Anda tetap aman di akun ini.
                    Anda dapat masuk kembali kapan saja.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSignOutModal(false)}
                    disabled={isSigningOut}
                    className="flex-1 rounded-xl border border-line bg-page px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-red-700 disabled:opacity-60"
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Keluar...</span>
                      </>
                    ) : (
                      <span>Ya, Keluar</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
