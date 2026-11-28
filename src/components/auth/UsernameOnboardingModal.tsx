import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AtSign, AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { suggestUsernameFromName, validateUsername } from "@/lib/auth-helpers";

export default function UsernameOnboardingModal() {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [initializedSuggestion, setInitializedSuggestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawUser = session?.user as
    | { name?: string | null; username?: string | null }
    | undefined;

  const needsUsername = Boolean(
    mounted && !isPending && rawUser && !rawUser.username && !completed
  );

  useEffect(() => {
    if (needsUsername && !initializedSuggestion && rawUser?.name) {
      setUsername(suggestUsernameFromName(rawUser.name));
      setInitializedSuggestion(true);
    }
  }, [needsUsername, initializedSuggestion, rawUser?.name]);

  useEffect(() => {
    if (!needsUsername) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [needsUsername]);

  if (!needsUsername) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    const check = validateUsername(username);
    if (!check.valid) {
      setErrorMessage(check.error || "Format username tidak valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/account/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: check.display }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setErrorMessage(data.error || "Gagal menyimpan username. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      setCompleted(true);
      window.location.reload();
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.");
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[85] overflow-y-auto bg-slate-900/50 backdrop-blur-md dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="username-onboarding-title"
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="animate-fade-slide relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2
              id="username-onboarding-title"
              className="text-2xl font-extrabold tracking-tight text-ink"
            >
              Pilih Username Anda
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              Satu langkah terakhir untuk melengkapi akun{" "}
              <span className="font-semibold text-accent-text">Ringkasnya</span>{" "}
              Anda.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/50 px-3.5 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="onboarding-username"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                Username
              </label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <input
                  id="onboarding-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="contoh: budi_santoso"
                  className="w-full rounded-xl border border-line bg-page/70 py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-subtle">
                3–24 karakter: huruf, angka, titik (.), atau garis bawah (_).
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Simpan &amp; Lanjutkan</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
