import { useState } from "react";
import { ArrowRight, LogOut, LogIn } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { openAuthModal } from "@/lib/auth-modal";

interface UserMenuProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function UserMenu({
  variant = "desktop",
  onNavigate,
}: UserMenuProps) {
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      onNavigate?.();
      window.location.href = "/";
    } catch {
      setIsSigningOut(false);
    }
  }

  const user = session?.user;

  if (variant === "mobile") {
    if (isPending) {
      return (
        <div className="space-y-2 px-1 py-2">
          <div className="h-10 w-full animate-pulse rounded-xl bg-page" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="space-y-2 pt-2">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            Akun
          </p>
          <a
            href="/masuk"
            data-no-transition="true"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.();
              openAuthModal("login");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk</span>
          </a>
        </div>
      );
    }

    return (
      <div className="space-y-2 pt-2">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          Akun Saya
        </p>
        <a
          href="/akun"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl border border-line-subtle bg-page px-3 py-2.5 transition-colors hover:border-emerald-400/60 hover:bg-accent-soft/40"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {getInitials(user.name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-subtle">{user.email}</p>
          </div>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
        </a>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          <span>{isSigningOut ? "Keluar..." : "Keluar"}</span>
        </button>
      </div>
    );
  }

  // Desktop variant
  if (isPending) {
    return (
      <div className="hidden md:flex items-center gap-2 pl-1">
        <div className="h-9 w-20 animate-pulse rounded-lg bg-page" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden md:flex items-center pl-2 border-l border-line">
        <a
          href="/masuk"
          data-no-transition="true"
          onClick={(e) => {
            e.preventDefault();
            openAuthModal("login");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
        >
          <LogIn className="h-4 w-4" />
          <span>Masuk</span>
        </a>
      </div>
    );
  }

  return (
    <div className="hidden md:block pl-2 border-l border-line">
      <a
        href="/akun"
        title="Dashboard Akun"
        className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1.5 pr-3 text-sm font-semibold text-ink-secondary shadow-2xs transition-colors hover:border-emerald-400/60 hover:bg-accent-soft/40 hover:text-ink"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            {getInitials(user.name)}
          </span>
        )}
        <span className="max-w-[120px] truncate">{user.name}</span>
      </a>
    </div>
  );
}
