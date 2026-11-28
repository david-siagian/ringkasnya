import type { APIRoute } from "astro";
import { isValidEmailFormat } from "@/lib/auth-helpers";
import {
  getOtpSecret,
  hashOtpCode,
  OTP_MAX_ATTEMPTS,
  type AddEmailOtpPayload,
} from "@/lib/otp";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  const session = context.locals.session;
  if (!user || !session) {
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

  let body: { email?: string; code?: string };
  try {
    body = (await context.request.json()) as { email?: string; code?: string };
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const normalizedEmail = (body.email ?? "").trim().toLowerCase();
  const code = (body.code ?? "").replace(/\s+/g, "");

  if (!isValidEmailFormat(normalizedEmail)) {
    return Response.json(
      { error: "Alamat email tidak valid." },
      { status: 400 }
    );
  }

  if (!/^\d{6}$/.test(code)) {
    return Response.json(
      { error: "Kode verifikasi harus terdiri dari 6 digit angka." },
      { status: 400 }
    );
  }

  const identifier = `otp:add-email:${user.id}`;
  const now = Date.now();

  const record = await env.DB.prepare(
    "SELECT id, value, expires_at FROM verifications WHERE identifier = ? ORDER BY updated_at DESC LIMIT 1"
  )
    .bind(identifier)
    .first<{ id: string; value: string; expires_at: number }>();

  if (!record) {
    return Response.json(
      { error: "Kode verifikasi tidak ditemukan. Silakan kirim ulang kode." },
      { status: 400 }
    );
  }

  if (record.expires_at < now) {
    await env.DB.prepare("DELETE FROM verifications WHERE id = ?")
      .bind(record.id)
      .run();
    return Response.json(
      { error: "Kode verifikasi sudah kedaluwarsa. Silakan kirim ulang kode baru." },
      { status: 400 }
    );
  }

  let payload: AddEmailOtpPayload;
  try {
    payload = JSON.parse(record.value) as AddEmailOtpPayload;
  } catch {
    await env.DB.prepare("DELETE FROM verifications WHERE id = ?")
      .bind(record.id)
      .run();
    return Response.json(
      { error: "Sesi verifikasi tidak valid. Silakan kirim ulang kode." },
      { status: 400 }
    );
  }

  if (payload.email !== normalizedEmail) {
    return Response.json(
      { error: "Email tidak cocok dengan permintaan kode verifikasi." },
      { status: 400 }
    );
  }

  if (payload.attempts >= OTP_MAX_ATTEMPTS) {
    await env.DB.prepare("DELETE FROM verifications WHERE id = ?")
      .bind(record.id)
      .run();
    return Response.json(
      { error: "Terlalu banyak percobaan gagal. Silakan kirim ulang kode baru." },
      { status: 429 }
    );
  }

  const expectedHash = await hashOtpCode(code, identifier, getOtpSecret(env));
  if (expectedHash !== payload.codeHash) {
    const nextAttempts = payload.attempts + 1;
    const remaining = Math.max(OTP_MAX_ATTEMPTS - nextAttempts, 0);

    if (remaining === 0) {
      await env.DB.prepare("DELETE FROM verifications WHERE id = ?")
        .bind(record.id)
        .run();
      return Response.json(
        { error: "Kode salah dan batas percobaan habis. Silakan kirim ulang kode baru." },
        { status: 429 }
      );
    }

    await env.DB.prepare(
      "UPDATE verifications SET value = ?, updated_at = ? WHERE id = ?"
    )
      .bind(
        JSON.stringify({ ...payload, attempts: nextAttempts }),
        now,
        record.id
      )
      .run();

    return Response.json(
      { error: `Kode verifikasi salah. Sisa percobaan: ${remaining}x.` },
      { status: 400 }
    );
  }

  const existingOther = await env.DB.prepare(
    "SELECT id FROM users WHERE lower(email) = ? AND id != ? LIMIT 1"
  )
    .bind(normalizedEmail, user.id)
    .first<{ id: string }>();

  if (existingOther) {
    await env.DB.prepare("DELETE FROM verifications WHERE identifier = ?")
      .bind(identifier)
      .run();
    return Response.json(
      { error: "Email ini sudah digunakan oleh akun lain." },
      { status: 409 }
    );
  }

  await env.DB.prepare(
    "UPDATE users SET email = ?, email_verified = 1, updated_at = ? WHERE id = ?"
  )
    .bind(normalizedEmail, now, user.id)
    .run();

  await env.DB.prepare("DELETE FROM verifications WHERE identifier = ?")
    .bind(identifier)
    .run();

  // Bersihkan cache sesi di KV agar data email terbaru langsung terbaca
  if (env.SESSION_KV && session.token) {
    try {
      await env.SESSION_KV.delete(session.token);
    } catch (error) {
      console.warn("[verify-add-email] Gagal membersihkan cache KV:", error);
    }
  }

  return Response.json({
    ok: true,
    email: normalizedEmail,
    emailVerified: true,
  });
};
