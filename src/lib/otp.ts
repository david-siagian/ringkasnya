export const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 menit
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 detik
export const OTP_MAX_ATTEMPTS = 5;

export interface RegisterOtpPayload {
  purpose: "register";
  codeHash: string;
  attempts: number;
  sentAt: number;
  email: string;
  username: string;
  displayUsername: string;
  name: string;
}

export interface AddEmailOtpPayload {
  purpose: "add_email";
  codeHash: string;
  attempts: number;
  sentAt: number;
  userId: string;
  email: string;
}

export function generateOtpCode(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  const num = bytes[0] % 1_000_000;
  return String(num).padStart(6, "0");
}

export async function hashOtpCode(
  code: string,
  identifier: string,
  secret: string
): Promise<string> {
  const data = new TextEncoder().encode(`${secret}:${identifier}:${code}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getOtpSecret(env: Env): string {
  return (
    env.BETTER_AUTH_SECRET?.trim() ||
    "dev-only-ringkasnya-fallback-secret-change-in-production"
  );
}
