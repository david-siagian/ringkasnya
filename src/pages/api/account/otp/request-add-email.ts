import type { APIRoute } from "astro";
import { isValidEmailFormat } from "@/lib/auth-helpers";
import { sendOtpEmail } from "@/lib/email";
import {
  generateOtpCode,
  getOtpSecret,
  hashOtpCode,
  OTP_EXPIRY_MS,
  OTP_RESEND_COOLDOWN_MS,
  type AddEmailOtpPayload,
} from "@/lib/otp";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return Response.json(
      { error: "Silakan masuk terlebih dahulu." },
      { status: 401 }
    );
  }

  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return Response.json(
      { error: "Database D1 belum terkonfigurasi pada runtime ini." },
      { status: 500 }
    );
  }

  let body: { email?: string };
  try {
    body = (await context.request.json()) as { email?: string };
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const normalizedEmail = (body.email ?? "").trim().toLowerCase();
  if (!isValidEmailFormat(normalizedEmail)) {
    return Response.json(
      { error: "Mohon masukkan alamat email yang valid." },
      { status: 400 }
    );
  }

  if (user.email.toLowerCase() === normalizedEmail && user.emailVerified) {
    return Response.json(
      { error: "Email ini sudah terverifikasi pada akun Anda." },
      { status: 400 }
    );
  }

  const existingOther = await env.DB.prepare(
    "SELECT id FROM users WHERE lower(email) = ? AND id != ? LIMIT 1"
  )
    .bind(normalizedEmail, user.id)
    .first<{ id: string }>();

  if (existingOther) {
    return Response.json(
      { error: "Email ini sudah digunakan oleh akun lain." },
      { status: 409 }
    );
  }

  const identifier = `otp:add-email:${user.id}`;
  const now = Date.now();

  const existingOtp = await env.DB.prepare(
    "SELECT id, value, expires_at FROM verifications WHERE identifier = ? ORDER BY updated_at DESC LIMIT 1"
  )
    .bind(identifier)
    .first<{ id: string; value: string; expires_at: number }>();

  if (existingOtp && existingOtp.expires_at > now) {
    try {
      const parsed = JSON.parse(existingOtp.value) as Partial<AddEmailOtpPayload>;
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
    purpose: "add_email",
    recipientName: user.name,
  });

  if (!sendResult.ok) {
    return Response.json({ error: sendResult.error }, { status: 503 });
  }

  const payload: AddEmailOtpPayload = {
    purpose: "add_email",
    codeHash,
    attempts: 0,
    sentAt: now,
    userId: user.id,
    email: normalizedEmail,
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
