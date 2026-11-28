import { useEffect, useState, type FormEvent } from "react";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { completeAuthRedirect, getSafeRedirect } from "@/lib/auth-modal";
import {
  getOAuthErrorMessage,
  isValidEmailFormat,
  validateUsername,
} from "@/lib/auth-helpers";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import UsernameStatusHint from "@/components/auth/UsernameStatusHint";

interface RegisterFormProps {
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

export default function RegisterForm({
  googleEnabled,
  redirectTo,
  onSwitchMode,
  onSuccess,
}: RegisterFormProps) {
  const safeRedirect = getSafeRedirect(redirectTo);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const usernameCheck = useUsernameAvailability(username, {
    enabled: step === "form",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    const friendly = getOAuthErrorMessage(oauthError);
    if (friendly) {
      setErrorMessage(friendly);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

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

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const usernameCheck = validateUsername(username);

    if (trimmedName.length < 2) {
      setErrorMessage("Nama lengkap minimal 2 karakter.");
      return;
    }

    if (!usernameCheck.valid) {
      setErrorMessage(usernameCheck.error || "Format username tidak valid.");
      return;
    }

    if (normalizedEmail && !isValidEmailFormat(normalizedEmail)) {
      setErrorMessage("Mohon masukkan alamat email yang valid atau kosongkan kolom email.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Kata sandi minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      // Alur 1: Daftar tanpa email (langsung buat akun dengan username)
      if (!normalizedEmail) {
        const response = await fetch("/api/account/register-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            username: usernameCheck.display,
            password,
          }),
        });

        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };

        if (!response.ok) {
          setErrorMessage(data.error || "Gagal mendaftar. Silakan coba lagi.");
          setIsLoading(false);
          return;
        }

        completeAuthRedirect(safeRedirect, onSuccess);
        return;
      }

      // Alur 2: Daftar dengan email -> kirim OTP 6 digit dulu (blokir pembuatan akun sebelum terverifikasi)
      const response = await fetch("/api/account/otp/request-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          username: usernameCheck.display,
          email: normalizedEmail,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        cooldownSeconds?: number;
        retryAfterSeconds?: number;
      };

      if (!response.ok || !data.ok) {
        if (data.retryAfterSeconds) {
          setCooldown(data.retryAfterSeconds);
        }
        setErrorMessage(data.error || "Gagal mengirim kode verifikasi.");
        setIsLoading(false);
        return;
      }

      setOtpCode("");
      setCooldown(data.cooldownSeconds ?? 60);
      setStep("otp");
      setIsLoading(false);
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  }

  async function handleOtpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanedCode = otpCode.replace(/\D/g, "");
    if (cleanedCode.length !== 6) {
      setErrorMessage("Masukkan 6 digit kode verifikasi yang dikirim ke email Anda.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/account/otp/verify-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim().replace(/^@+/, ""),
          email: email.trim().toLowerCase(),
          password,
          code: cleanedCode,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(data.error || "Kode verifikasi tidak valid.");
        setIsLoading(false);
        return;
      }

      completeAuthRedirect(safeRedirect, onSuccess);
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.");
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    if (cooldown > 0 || isResending) return;
    setErrorMessage(null);
    setInfoMessage(null);
    setIsResending(true);

    try {
      const response = await fetch("/api/account/otp/request-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim().replace(/^@+/, ""),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        cooldownSeconds?: number;
        retryAfterSeconds?: number;
      };

      if (!response.ok || !data.ok) {
        if (data.retryAfterSeconds) {
          setCooldown(data.retryAfterSeconds);
        }
        setErrorMessage(data.error || "Gagal mengirim ulang kode.");
      } else {
        setCooldown(data.cooldownSeconds ?? 60);
        setInfoMessage("Kode verifikasi baru telah dikirim ke email Anda.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsResending(false);
    }
  }

  async function handleGoogleSignUp() {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: safeRedirect,
        errorCallbackURL: "/daftar",
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

  if (step === "otp") {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-4 text-sm text-emerald-900 dark:text-emerald-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold">Verifikasi Email Anda</p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-800/90 dark:text-emerald-300/90">
                Kami telah mengirim kode OTP 6 digit ke{" "}
                <strong className="font-bold">{email.trim().toLowerCase()}</strong>.
                Masukkan kode tersebut untuk menyelesaikan pendaftaran.
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/50 px-3.5 py-3 text-sm text-red-700 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleOtpSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="register-otp"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
            >
              Kode Verifikasi (6 Digit)
            </label>
            <input
              id="register-otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full rounded-xl border border-line bg-page/70 py-3 px-4 text-center font-mono text-2xl font-bold tracking-[0.45em] text-ink placeholder:text-ink-subtle/50 transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Verifikasi &amp; Buat Akun</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className="inline-flex items-center gap-1 font-semibold text-ink-muted hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Ubah data</span>
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={cooldown > 0 || isResending}
            className="inline-flex items-center gap-1 font-semibold text-accent-text hover:underline disabled:cursor-not-allowed disabled:text-ink-subtle disabled:no-underline"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
            <span>
              {cooldown > 0 ? `Kirim ulang (${cooldown}d)` : "Kirim ulang kode"}
            </span>
          </button>
        </div>
      </div>
    );
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
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading || isLoading}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-secondary shadow-xs transition-all hover:bg-page hover:border-line-strong hover:text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink-subtle" />
            ) : (
              <GoogleIcon />
            )}
            <span>Daftar dengan Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 font-medium text-ink-subtle">
                atau dengan username
              </span>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-3.5" noValidate>
        <div>
          <label
            htmlFor="register-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-line bg-page/70 py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-username"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Username
          </label>
          <div className="relative">
            <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              id="register-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="contoh: budi_santoso"
              className="w-full rounded-xl border border-line bg-page/70 py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <UsernameStatusHint
            status={usernameCheck.status}
            message={usernameCheck.message}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="register-email"
              className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
            >
              Email
            </label>
            <span className="text-[11px] font-medium text-ink-subtle">
              Opsional
            </span>
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com (opsional)"
              className="w-full rounded-xl border border-line bg-page/70 py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-subtle">
            Jika diisi, kami akan mengirim kode OTP 6 digit untuk verifikasi sebelum akun dibuat.
          </p>
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
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

        <div>
          <label
            htmlFor="register-confirm-password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              className="w-full rounded-xl border border-line bg-page/70 py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-emerald-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            isGoogleLoading ||
            usernameCheck.status === "taken" ||
            usernameCheck.status === "invalid"
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{email.trim() ? "Mengirim kode OTP..." : "Membuat akun..."}</span>
            </>
          ) : (
            <>
              <span>{email.trim() ? "Lanjut & Verifikasi Email" : "Buat Akun Gratis"}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted">
        Sudah punya akun?{" "}
        <a
          href={`/masuk${redirectTo ? `?redirect=${encodeURIComponent(safeRedirect)}` : ""}`}
          onClick={(e) => {
            if (onSwitchMode) {
              e.preventDefault();
              onSwitchMode();
            }
          }}
          className="font-semibold text-accent-text hover:underline"
        >
          Masuk sekarang
        </a>
      </p>
    </div>
  );
}
