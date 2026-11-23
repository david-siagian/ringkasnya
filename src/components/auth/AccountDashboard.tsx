import { useState } from "react";
import {
  LogOut,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Mail,
  Calendar,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

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
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AccountDashboard({ user }: AccountDashboardProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isPro = user.plan === "pro";
  const joinedDate = new Date(user.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch {
      setIsSigningOut(false);
    }
  }

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
                        ? "bg-amber-400/20 text-amber-200 border border-amber-300/40"
                        : "bg-emerald-500/20 text-emerald-100 border border-emerald-300/30"
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
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20 disabled:opacity-60"
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
              <span>Aktif</span>
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
              Akses Bacaan
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
              <CheckCircle2 className="h-4 w-4 text-accent-strong" />
              <span>Mode Kilat &amp; Mendalam</span>
            </p>
          </div>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="/katalog"
          className="group flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 transition-all hover:border-accent-line hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text transition-colors group-hover:bg-emerald-600 group-hover:text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink group-hover:text-accent-text">
              Jelajahi Katalog Buku
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Lanjutkan membaca ringkasan buku best-seller pilihan dalam Mode Kilat atau Mendalam.
            </p>
          </div>
        </a>

        <div className="flex items-start gap-4 rounded-2xl border border-dashed border-accent-line bg-accent-soft/50 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent-text">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">
              Sinkronisasi Progres &amp; Bookmark
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Segera hadir di Fase 3.2: seluruh progres baca dan buku tersimpan Anda akan otomatis tersinkronisasi lintas perangkat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
