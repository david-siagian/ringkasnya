import { useEffect, useState, type FormEvent } from "react";
import { User, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { completeAuthRedirect, getSafeRedirect } from "@/lib/auth-modal";
import { getOAuthErrorMessage } from "@/lib/auth-helpers";

interface LoginFormProps {
  googleEnabled: boolean;
  redirectTo?: string;
  onSwitchMode?: () => void;
  onSuccess?: () => void;
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

export default function LoginForm({
  googleEnabled,
  redirectTo,
  onSwitchMode,
  onSuccess,
}: LoginFormProps) {
  const safeRedirect = getSafeRedirect(redirectTo);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    const friendly = getOAuthErrorMessage(oauthError);
    if (friendly) {
      setErrorMessage(friendly);
    }
  }, []);

  useEffect(() => {
    const resetLoading = () => {
      setIsGoogleLoading(false);
      setIsLoading(false);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetLoading();
      }
    };

    window.addEventListener("pageshow", resetLoading);
    window.addEventListener("pagehide", resetLoading);
    window.addEventListener("focus", resetLoading);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("pageshow", resetLoading);
      window.removeEventListener("pagehide", resetLoading);
      window.removeEventListener("focus", resetLoading);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isGoogleLoading) return;
    const timer = window.setTimeout(() => {
      setIsGoogleLoading(false);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [isGoogleLoading]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = identifier.trim();
    if (!trimmed || !password) {
      setErrorMessage("Mohon isi username atau email beserta kata sandi Anda.");
      return;
    }

    setIsLoading(true);
    try {
      const isEmail = trimmed.includes("@") && !trimmed.startsWith("@");
      const result = isEmail
        ? await authClient.signIn.email({
            email: trimmed.toLowerCase(),
            password,
            callbackURL: safeRedirect,
          })
        : await authClient.signIn.username({
            username: trimmed.replace(/^@+/, "").toLowerCase(),
            password,
            callbackURL: safeRedirect,
          });

      if (result.error) {
        const code = result.error.code;
        setErrorMessage(
          code === "INVALID_EMAIL_OR_PASSWORD" ||
            code === "INVALID_USERNAME_OR_PASSWORD"
            ? "Username/email atau kata sandi salah. Silakan periksa kembali."
            : result.error.message || "Gagal masuk. Silakan coba lagi."
        );
        setIsLoading(false);
        return;
      }

      completeAuthRedirect(safeRedirect, onSuccess);
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: safeRedirect,
        errorCallbackURL: "/masuk",
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || "Gagal menghubungkan ke Google."
        );
        setIsGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Gagal menghubungkan ke Google. Silakan coba lagi.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/50 px-3.5 py-3 text-sm text-red-700 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-secondary shadow-xs transition-all hover:bg-page hover:border-line-strong hover:text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink-subtle" />
            ) : (
              <GoogleIcon />
            )}
            <span>Lanjutkan dengan Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 font-medium text-ink-subtle">
                atau dengan akun
              </span>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="login-identifier"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Username atau Email
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              id="login-identifier"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="username atau nama@email.com"
              className="w-full rounded-xl border border-line bg-page/70 py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full rounded-xl border border-line bg-page/70 py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink-secondary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sedang masuk...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted">
        Belum punya akun?{" "}
        <a
          href={`/daftar${redirectTo ? `?redirect=${encodeURIComponent(safeRedirect)}` : ""}`}
          onClick={(e) => {
            if (onSwitchMode) {
              e.preventDefault();
              onSwitchMode();
            }
          }}
          className="font-semibold text-accent-text hover:underline"
        >
          Daftar gratis
        </a>
      </p>
    </div>
  );
}
