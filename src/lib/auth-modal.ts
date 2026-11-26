export type AuthModalMode = "login" | "register";

export const AUTH_MODAL_EVENT = "ringkasnya:open-auth-modal";

export interface AuthModalEventDetail {
  mode: AuthModalMode;
  redirectTo?: string;
}

function isAuthPagePath(pathname: string): boolean {
  return pathname === "/masuk" || pathname === "/daftar";
}

export function getSafeRedirect(target?: string, fallback = "/akun"): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) {
    return fallback;
  }
  const pathname = target.split(/[?#]/, 1)[0] ?? "";
  if (isAuthPagePath(pathname)) {
    return fallback;
  }
  return target;
}

export function getCurrentReturnUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  if (isAuthPagePath(window.location.pathname)) {
    return undefined;
  }
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function completeAuthRedirect(
  safeRedirect: string,
  onSamePageSuccess?: () => void
): void {
  if (typeof window === "undefined") return;

  if (onSamePageSuccess) {
    const targetUrl = new URL(safeRedirect, window.location.origin);
    const isSamePage =
      targetUrl.pathname === window.location.pathname &&
      targetUrl.search === window.location.search;

    if (isSamePage) {
      if (targetUrl.hash && targetUrl.hash !== window.location.hash) {
        window.history.replaceState(null, "", safeRedirect);
      }
      onSamePageSuccess();
      return;
    }
  }

  window.location.href = safeRedirect;
}

export function openAuthModal(
  mode: AuthModalMode = "login",
  redirectTo?: string
): void {
  if (typeof window === "undefined") return;
  const resolvedRedirect = redirectTo ?? getCurrentReturnUrl();
  window.dispatchEvent(
    new CustomEvent<AuthModalEventDetail>(AUTH_MODAL_EVENT, {
      detail: { mode, redirectTo: resolvedRedirect },
    })
  );
}
