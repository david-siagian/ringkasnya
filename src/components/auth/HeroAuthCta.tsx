import { LogIn, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { openAuthModal } from "@/lib/auth-modal";

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
      <a
        href="/masuk"
        data-no-transition="true"
        onClick={(e) => {
          e.preventDefault();
          openAuthModal("login");
        }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
      >
        <LogIn className="h-3.5 w-3.5" />
        <span>Masuk</span>
      </a>
    </div>
  );
}
