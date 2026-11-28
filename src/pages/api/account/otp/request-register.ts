import type { APIRoute } from "astro";
import { isValidEmailFormat, validateUsername } from "@/lib/auth-helpers";
import { sendOtpEmail } from "@/lib/email";
import {
  generateOtpCode,
  getOtpSecret,
  hashOtpCode,
  OTP_EXPIRY_MS,
  OTP_RESEND_COOLDOWN_MS,
  type RegisterOtpPayload,
} from "@/lib/otp";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return Response.json(
      { error: "Database D1 belum terkonfigurasi pada runtime ini." },
      { status: 500 }
    );
  }

  let body: { name?: string; username?: string; email?: string };
  try {
    body = (await context.request.json()) as {
      name?: string;
      username?: string;
      email?: string;
    };
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const trimmedName = (body.name ?? "").trim();
  const normalizedEmail = (body.email ?? "").trim().toLowerCase();
  const usernameCheck = validateUsername(body.username ?? "");

  if (trimmedName.length < 2) {
    return Response.json(
      { error: "Nama lengkap minimal 2 karakter." },
      { status: 400 }
    );
  }

  if (!usernameCheck.valid) {
    return Response.json(
      { error: usernameCheck.error || "Format username tidak valid." },
      { status: 400 }
    );
  }

  if (!isValidEmailFormat(normalizedEmail)) {
    return Response.json(
      { error: "Mohon masukkan alamat email yang valid." },
      { status: 400 }
    );
  }

  const [existingUsername, existingEmail] = await Promise.all([
    env.DB.prepare("SELECT id FROM users WHERE username = ? LIMIT 1")
      .bind(usernameCheck.normalized)
      .first<{ id: string }>(),
    env.DB.prepare("SELECT id FROM users WHERE lower(email) = ? LIMIT 1")
      .bind(normalizedEmail)
      .first<{ id: string }>(),
  ]);

  if (existingUsername) {
    return Response.json(
      { error: "Username ini sudah digunakan. Silakan pilih username lain." },
      { status: 409 }
    );
  }

  if (existingEmail) {
    return Response.json(
      { error: "Email ini sudah terdaftar. Silakan masuk ke akun Anda." },
      { status: 409 }
    );
  }

  const identifier = `otp:register:${normalizedEmail}`;
  const now = Date.now();

  const existingOtp = await env.DB.prepare(
    "SELECT id, value, expires_at FROM verifications WHERE identifier = ? ORDER BY updated_at DESC LIMIT 1"
  )
    .bind(identifier)
    .first<{ id: string; value: string; expires_at: number }>();

  if (existingOtp && existingOtp.expires_at > now) {
    try {
      const parsed = JSON.parse(existingOtp.value) as Partial<RegisterOtpPayload>;
      if (
        typeof parsed.sentAt === "number" &&
        now - parsed.sentAt < OTP_RESEND_COOLDOWN_MS
      ) {
        const retryAfterSeconds = Math.ceil(
          (OTP_RESEND_COOLDOWN_MS - (now - parsed.sentAt)) / 1000
        );
        return Response.json(
          {
            error: `Mohon tunggu ${retryAfterSeconds} detik sebelum meminta kode baru.`,
            retryAfterSeconds,
          },
          { status: 429 }
        );
      }
    } catch {
      // Abaikan payload lama yang rusak
    }
  }

  const code = generateOtpCode();
  const codeHash = await hashOtpCode(code, identifier, getOtpSecret(env));

  const sendResult = await sendOtpEmail(env, {
    to: normalizedEmail,
    code,
    purpose: "register",
    recipientName: trimmedName,
  });

  if (!sendResult.ok) {
    return Response.json({ error: sendResult.error }, { status: 503 });
  }

  const payload: RegisterOtpPayload = {
    purpose: "register",
    codeHash,
    attempts: 0,
    sentAt: now,
    email: normalizedEmail,
    username: usernameCheck.normalized,
    displayUsername: usernameCheck.display,
    name: trimmedName,
  };

  await env.DB.prepare("DELETE FROM verifications WHERE identifier = ?")
    .bind(identifier)
    .run();

  await env.DB.prepare(
    `INSERT INTO verifications (id, identifier, value, expires_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      identifier,
      JSON.stringify(payload),
      now + OTP_EXPIRY_MS,
      now,
      now
    )
    .run();

  return Response.json({
    ok: true,
    email: normalizedEmail,
    expiresInSeconds: Math.floor(OTP_EXPIRY_MS / 1000),
    cooldownSeconds: Math.floor(OTP_RESEND_COOLDOWN_MS / 1000),
  });
};
