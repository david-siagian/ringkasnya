export type AuthModalMode = "login" | "register";

export const AUTH_MODAL_EVENT = "ringkasnya:open-auth-modal";

export interface AuthModalEventDetail {
  mode: AuthModalMode;
  redirectTo?: string;
}

export function openAuthModal(
  mode: AuthModalMode = "login",
  redirectTo?: string
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<AuthModalEventDetail>(AUTH_MODAL_EVENT, {
      detail: { mode, redirectTo },
    })
  );
}
