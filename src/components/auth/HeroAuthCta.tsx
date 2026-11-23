import { LogIn, UserPlus, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function HeroAuthCta() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (!isPending && user) {
    return (
      <div className="animate-welcome mt-5 flex items-center justify-center" style={{ animationDelay: "540ms" }}>
        <a
          href="/akun"
          className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft/80 px-4 py-1.5 text-xs font-semibold text-accent-text transition-colors hover:bg-accent-tint"
        >
          <User className="h-3.5 w-3.5" />
          <span>Masuk sebagai {user.name} · Buka Akun Saya</span>
        </a>
      </div>
    );
  }

  return (
    <div
      className="animate-welcome mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm"
      style={{ animationDelay: "540ms" }}
    >
      <span className="text-ink-subtle">Simpan progres &amp; checklist bacaan:</span>
      <div className="inline-flex items-center gap-2">
        <a
          href="/masuk"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary shadow-2xs transition-colors hover:border-line-strong hover:bg-page hover:text-ink"
        >
          <LogIn className="h-3.5 w-3.5 text-accent-strong" />
          <span>Masuk</span>
        </a>
        <a
          href="/daftar"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-text border border-accent-line transition-colors hover:bg-accent-tint"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Daftar Gratis</span>
        </a>
      </div>
    </div>
  );
}
