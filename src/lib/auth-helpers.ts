export const PLACEHOLDER_EMAIL_DOMAIN = "@noemail.ringkasnya.internal";

export function isPlaceholderEmail(email?: string | null): boolean {
  if (!email) return true;
  return email.trim().toLowerCase().endsWith(PLACEHOLDER_EMAIL_DOMAIN);
}

export function createPlaceholderEmail(normalizedUsername: string): string {
  const safeBase = normalizedUsername.replace(/[^a-z0-9]/g, "") || "user";
  const randomSuffix =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
  return `${safeBase}.${randomSuffix}${PLACEHOLDER_EMAIL_DOMAIN}`;
}

export function isValidEmailFormat(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || trimmed.length > 254) return false;
  if (isPlaceholderEmail(trimmed)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

export interface UsernameValidationResult {
  valid: boolean;
  normalized: string;
  display: string;
  error?: string;
}

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "ringkasnya",
  "support",
  "help",
  "system",
  "root",
  "api",
  "auth",
  "akun",
  "masuk",
  "daftar",
  "katalog",
  "artikel",
  "buku",
  "moderator",
  "mod",
]);

export function validateUsername(raw: string): UsernameValidationResult {
  const display = raw.trim().replace(/^@+/, "");
  const normalized = display.toLowerCase();

  if (normalized.length < 3) {
    return {
      valid: false,
      normalized,
      display,
      error: "Username minimal 3 karakter.",
    };
  }

  if (normalized.length > 24) {
    return {
      valid: false,
      normalized,
      display,
      error: "Username maksimal 24 karakter.",
    };
  }

  if (!/^[a-z0-9][a-z0-9._]*[a-z0-9]$/.test(normalized) && !/^[a-z0-9]{3}$/.test(normalized)) {
    return {
      valid: false,
      normalized,
      display,
      error:
        "Username hanya boleh berisi huruf, angka, titik (.), atau garis bawah (_), serta diawali dan diakhiri huruf/angka.",
    };
  }

  if (/[._]{2}/.test(normalized)) {
    return {
      valid: false,
      normalized,
      display,
      error: "Username tidak boleh mengandung tanda titik atau garis bawah berurutan.",
    };
  }

  if (RESERVED_USERNAMES.has(normalized)) {
    return {
      valid: false,
      normalized,
      display,
      error: "Username ini tidak tersedia. Silakan pilih username lain.",
    };
  }

  return { valid: true, normalized, display };
}

export function suggestUsernameFromName(name?: string | null): string {
  if (!name) return "";
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .slice(0, 18);

  if (base.length >= 3 && !RESERVED_USERNAMES.has(base)) {
    return base;
  }
  return base ? `${base}_reader` : "";
}

export function getOAuthErrorMessage(code?: string | null): string | null {
  if (!code) return null;
  const normalized = code.trim().toLowerCase();

  switch (normalized) {
    case "account_not_linked":
      return "Email Google ini sudah terdaftar dengan metode masuk lain. Silakan masuk terlebih dahulu lalu hubungkan akun Google Anda di halaman Akun.";
    case "access_denied":
      return "Login dengan Google dibatalkan. Silakan coba lagi jika ingin melanjutkan.";
    case "state_mismatch":
    case "invalid_code":
      return "Sesi login Google kedaluwarsa. Silakan coba masuk kembali.";
    case "email_not_found":
      return "Akun Google Anda tidak menyediakan alamat email. Silakan gunakan metode pendaftaran dengan username.";
    default:
      return "Terjadi kendala saat masuk dengan Google. Silakan coba lagi.";
  }
}
