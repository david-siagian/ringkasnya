import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import {
  AUTH_MODAL_EVENT,
  type AuthModalEventDetail,
  type AuthModalMode,
} from "@/lib/auth-modal";

interface AuthModalProps {
  googleEnabled: boolean;
}

export default function AuthModal({ googleEnabled }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    function handleOpen(event: Event) {
      const customEvent = event as CustomEvent<AuthModalEventDetail>;
      setMode(customEvent.detail?.mode ?? "login");
      setRedirectTo(customEvent.detail?.redirectTo);
      setIsOpen(true);
    }

    window.addEventListener(AUTH_MODAL_EVENT, handleOpen);
    return () => {
      window.removeEventListener(AUTH_MODAL_EVENT, handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  if (!mounted || !isOpen) return null;

  const isLogin = mode === "login";
  const headingId = isLogin ? "auth-modal-login-title" : "auth-modal-register-title";

  return createPortal(
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/45 backdrop-blur-md dark:bg-black/65"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className="animate-fade-slide relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup form akun"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-page/80 text-ink-muted transition-colors hover:bg-page hover:text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-6 text-center">
            <a href="/" className="inline-flex flex-col items-center gap-2">
              <BrandLogo className="h-12 w-12" />
            </a>
            <h2
              id={headingId}
              className="mt-3 text-2xl font-extrabold tracking-tight text-ink"
            >
              {isLogin ? "Selamat Datang Kembali" : "Buat Akun Gratis"}
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              {isLogin ? (
                <>
                  Masuk ke akun{" "}
                  <span className="font-semibold text-accent-text">Ringkasnya</span>{" "}
                  Anda untuk melanjutkan bacaan.
                </>
              ) : (
                <>
                  Mulai kebiasaan membaca 10 menit sehari bersama{" "}
                  <span className="font-semibold text-accent-text">Ringkasnya</span>.
                </>
              )}
            </p>
          </div>

          {isLogin ? (
            <LoginForm
              googleEnabled={googleEnabled}
              redirectTo={redirectTo}
              onSwitchMode={() => setMode("register")}
              onSuccess={handleClose}
            />
          ) : (
            <RegisterForm
              googleEnabled={googleEnabled}
              redirectTo={redirectTo}
              onSwitchMode={() => setMode("login")}
              onSuccess={handleClose}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
