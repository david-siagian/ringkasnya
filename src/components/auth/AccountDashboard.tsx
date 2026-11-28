import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  LogOut,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Mail,
  AtSign,
  AlertCircle,
  RefreshCw,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Link2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  isPlaceholderEmail,
  isValidEmailFormat,
  validateUsername,
} from "@/lib/auth-helpers";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCompletedBooks } from "@/hooks/useCompletedBooks";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import UsernameStatusHint from "@/components/auth/UsernameStatusHint";

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
    username?: string | null;
    displayUsername?: string | null;
    image?: string | null;
    role: string;
    plan: string;
    emailVerified: boolean;
    createdAt: string;
  };
  googleEnabled?: boolean;
  isGoogleLinked?: boolean;
  initialProgressItems?: AccountProgressBookItem[];
}

type ProgressTab = "all" | "reading" | "completed";

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
  googleEnabled = false,
  isGoogleLinked = false,
  initialProgressItems = [],
}: AccountDashboardProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ProgressTab>("all");

  // State Identitas (Username & Tambah/Verifikasi Email OTP)
  const [currentUsername, setCurrentUsername] = useState(
    user.displayUsername || user.username || ""
  );
  const [usernameInput, setUsernameInput] = useState(
    user.displayUsername || user.username || ""
  );
  const [editingUsername, setEditingUsername] = useState(false);
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  const usernameAvailability = useUsernameAvailability(usernameInput, {
    enabled: editingUsername,
    currentUsername,
  });

  const [currentEmail, setCurrentEmail] = useState(user.email);
  const [isEmailVerified, setIsEmailVerified] = useState(user.emailVerified);
  const hasRealEmail = !isPlaceholderEmail(currentEmail);

  const [emailStep, setEmailStep] = useState<"idle" | "input" | "otp">("idle");
  const [emailInput, setEmailInput] = useState(hasRealEmail ? currentEmail : "");
  const [otpInput, setOtpInput] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [googleLinkError, setGoogleLinkError] = useState<string | null>(null);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setOtpCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldown]);

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

  const { isBookmarked, mounted: bookmarksMounted } =
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
        (i) => i.isCompleted || i.progressPercent > 0
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
      if (activeTab === "completed") {
        return item.isCompleted;
      }
      return item.isCompleted || item.progressPercent > 0;
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

  async function handleSaveUsername(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUsernameError(null);
    setUsernameSuccess(null);

    const check = validateUsername(usernameInput);
    if (!check.valid) {
      setUsernameError(check.error || "Format username tidak valid.");
      return;
    }

    setIsSavingUsername(true);
    try {
      const response = await fetch("/api/account/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: check.display }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        displayUsername?: string;
        username?: string;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setUsernameError(data.error || "Gagal menyimpan username.");
        setIsSavingUsername(false);
        return;
      }

      const saved = data.displayUsername || data.username || check.display;
      setCurrentUsername(saved);
      setUsernameInput(saved);
      setEditingUsername(false);
      setUsernameSuccess("Username berhasil diperbarui.");
    } catch {
      setUsernameError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSavingUsername(false);
    }
  }

  async function handleRequestAddEmailOtp(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    const normalized = emailInput.trim().toLowerCase();
    if (!isValidEmailFormat(normalized)) {
      setEmailError("Mohon masukkan alamat email yang valid.");
      return;
    }

    setIsEmailLoading(true);
    try {
      const response = await fetch("/api/account/otp/request-add-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        cooldownSeconds?: number;
        retryAfterSeconds?: number;
      };
      if (!response.ok || !data.ok) {
        if (data.retryAfterSeconds) {
          setOtpCooldown(data.retryAfterSeconds);
        }
        setEmailError(data.error || "Gagal mengirim kode verifikasi.");
        setIsEmailLoading(false);
        return;
      }

      setOtpInput("");
      setOtpCooldown(data.cooldownSeconds ?? 60);
      setEmailStep("otp");
      setEmailSuccess(`Kode OTP 6 digit telah dikirim ke ${normalized}.`);
    } catch {
      setEmailError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function handleVerifyAddEmailOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    const cleanedCode = otpInput.replace(/\D/g, "");
    if (cleanedCode.length !== 6) {
      setEmailError("Masukkan 6 digit kode verifikasi.");
      return;
    }

    setIsEmailLoading(true);
    try {
      const response = await fetch("/api/account/otp/verify-add-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.trim().toLowerCase(),
          code: cleanedCode,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        email?: string;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setEmailError(data.error || "Kode verifikasi tidak valid.");
        setIsEmailLoading(false);
        return;
      }

      setCurrentEmail(data.email || emailInput.trim().toLowerCase());
      setIsEmailVerified(true);
      setEmailStep("idle");
      setOtpInput("");
      setEmailSuccess("Email berhasil ditambahkan dan diverifikasi.");
    } catch {
      setEmailError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function handleLinkGoogle() {
    setGoogleLinkError(null);
    setIsLinkingGoogle(true);
    try {
      const result = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/akun",
      });
      if (result.error) {
        setGoogleLinkError(
          result.error.message || "Gagal menghubungkan akun Google."
        );
        setIsLinkingGoogle(false);
      }
    } catch {
      setGoogleLinkError("Gagal menghubungkan akun Google. Silakan coba lagi.");
      setIsLinkingGoogle(false);
    }
  }

  const tabs: { id: ProgressTab; label: string; count: number }[] = [
    { id: "all", label: "Semua", count: counts.all },
    { id: "reading", label: "Sedang Dibaca", count: counts.reading },
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
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-emerald-100/90">
                  {currentUsername && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <AtSign className="h-3.5 w-3.5" />
                      <span>{currentUsername}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    <span>
                      {hasRealEmail ? currentEmail : "Belum ada email"}
                    </span>
                  </span>
                </div>
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

      {/* Keamanan & Identitas Akun */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">
            Identitas &amp; Keamanan Akun
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            Kelola username, verifikasi email, dan tautan login akun Anda.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* Kartu Username */}
          <div className="rounded-xl border border-line-subtle bg-page/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Username
              </p>
              {!editingUsername && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUsername(true);
                    setUsernameError(null);
                    setUsernameSuccess(null);
                  }}
                  className="text-xs font-semibold text-accent-text hover:underline"
                >
                  {currentUsername ? "Ubah" : "Atur Username"}
                </button>
              )}
            </div>

            {!editingUsername ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-ink">
                <AtSign className="h-4 w-4 text-accent-strong" />
                <span>{currentUsername || "Belum diatur"}</span>
              </p>
            ) : (
              <form onSubmit={handleSaveUsername} className="mt-3 space-y-2.5" noValidate>
                <div className="relative">
                  <AtSign className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="contoh: budi_santoso"
                    className="w-full rounded-lg border border-line bg-surface py-2 pl-8 pr-3 text-sm text-ink focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <UsernameStatusHint
                  status={usernameAvailability.status}
                  message={usernameAvailability.message}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={
                      isSavingUsername ||
                      usernameAvailability.status === "taken" ||
                      usernameAvailability.status === "invalid"
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isSavingUsername && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Simpan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUsername(false);
                      setUsernameInput(currentUsername);
                      setUsernameError(null);
                    }}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {usernameError && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{usernameError}</span>
              </p>
            )}
            {usernameSuccess && (
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {usernameSuccess}
              </p>
            )}
          </div>

          {/* Kartu Email & Verifikasi OTP */}
          <div className="rounded-xl border border-line-subtle bg-page/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Alamat Email
              </p>
              {hasRealEmail && isEmailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Terverifikasi
                </span>
              ) : (
                emailStep === "idle" && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmailStep("input");
                      setEmailError(null);
                      setEmailSuccess(null);
                    }}
                    className="text-xs font-semibold text-accent-text hover:underline"
                  >
                    {hasRealEmail ? "Verifikasi Email" : "Tambah Email"}
                  </button>
                )
              )}
            </div>

            {emailStep === "idle" && (
              <div className="mt-2">
                <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <Mail className="h-4 w-4 text-accent-strong" />
                  <span className="truncate">
                    {hasRealEmail ? currentEmail : "Belum ditambahkan"}
                  </span>
                </p>
                {(!hasRealEmail || !isEmailVerified) && (
                  <p className="mt-1 text-xs text-ink-muted">
                    Tambahkan dan verifikasi email (via OTP 6 digit) agar akun Anda lebih aman dan mudah dipulihkan.
                  </p>
                )}
              </div>
            )}

            {emailStep === "input" && (
              <form onSubmit={handleRequestAddEmailOtp} className="mt-3 space-y-2.5" noValidate>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full rounded-lg border border-line bg-surface py-2 px-3 text-sm text-ink focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isEmailLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isEmailLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Kirim Kode OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailStep("idle");
                      setEmailError(null);
                    }}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {emailStep === "otp" && (
              <form onSubmit={handleVerifyAddEmailOtp} className="mt-3 space-y-2.5" noValidate>
                <p className="text-xs text-ink-muted">
                  Masukkan 6 digit kode yang dikirim ke{" "}
                  <strong className="text-ink">{emailInput.trim().toLowerCase()}</strong>.
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full rounded-lg border border-line bg-surface py-2 px-3 text-center font-mono text-lg font-bold tracking-[0.35em] text-ink focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isEmailLoading || otpInput.length !== 6}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {isEmailLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Verifikasi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailStep("input");
                        setEmailError(null);
                      }}
                      className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
                    >
                      Ubah Email
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRequestAddEmailOtp()}
                    disabled={otpCooldown > 0 || isEmailLoading}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent-text hover:underline disabled:text-ink-subtle disabled:no-underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>
                      {otpCooldown > 0 ? `Kirim ulang (${otpCooldown}d)` : "Kirim ulang"}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {emailError && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
            {emailSuccess && (
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {emailSuccess}
              </p>
            )}
          </div>
        </div>

        {googleEnabled && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-line-subtle bg-page/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                Tautan Google
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {isGoogleLinked
                  ? "Akun Google sudah terhubung dengan akun ini."
                  : "Hubungkan akun Google agar Anda bisa masuk satu klik di perangkat lain."}
              </p>
              {googleLinkError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {googleLinkError}
                </p>
              )}
            </div>
            {isGoogleLinked ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 sm:self-center">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Terhubung
              </span>
            ) : (
              <button
                type="button"
                onClick={handleLinkGoogle}
                disabled={isLinkingGoogle}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink shadow-2xs transition-colors hover:border-emerald-400/60 hover:bg-page disabled:opacity-60 sm:self-center"
              >
                {isLinkingGoogle ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" />
                )}
                <span>Hubungkan Google</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Aktivitas & Progres Baca */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-ink">
              Aktivitas &amp; Progres Baca
            </h2>
            <p className="mt-0.5 text-sm text-ink-muted">
              Progres bacaan Anda tersinkron otomatis lintas perangkat.
            </p>
          </div>

          <a
            href="/katalog"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-xs backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-500/25 dark:border-emerald-400/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Jelajahi Katalog</span>
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="mt-5 flex flex-nowrap items-center gap-1.5 overflow-x-auto sm:flex-wrap sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors sm:gap-1.5 sm:px-3.5 sm:text-xs ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-line bg-page text-ink-muted hover:border-accent-line hover:text-ink"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold sm:text-[11px] ${
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
              Mulai membaca buku dari katalog untuk melihat progresnya di sini.
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
                        ) : (
                          <span className="font-bold text-accent-text">
                            Lanjutkan • {item.progressPercent}%
                          </span>
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
