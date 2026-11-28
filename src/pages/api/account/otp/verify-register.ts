import type { APIRoute } from "astro";
import { createAuth } from "@/lib/auth";
import { isValidEmailFormat, validateUsername } from "@/lib/auth-helpers";
import {
  getOtpSecret,
  hashOtpCode,
  OTP_MAX_ATTEMPTS,
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

  let body: {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    code?: string;
  };
  try {
    body = (await context.request.json()) as {
      name?: string;
      username?: string;
      email?: string;
      password?: string;
      code?: string;
    };
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const trimmedName = (body.name ?? "").trim();
  const normalizedEmail = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const code = (body.code ?? "").replace(/\s+/g, "");
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
      { error: "Alamat email tidak valid." },
      { status: 400 }
    );
  }

  if (password.length < 8 || password.length > 128) {
    return Response.json(
      { error: "Kata sandi harus antara 8 hingga 128 karakter." },
      { status: 400 }
    );
  }

  if (!/^\d{6}$/.test(code)) {
    return Response.json(
      { error: "Kode verifikasi harus terdiri dari 6 digit angka." },
      { status: 400 }
    );
  }

  const identifier = `otp:register:${normalizedEmail}`;
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

  let payload: RegisterOtpPayload;
  try {
    payload = JSON.parse(record.value) as RegisterOtpPayload;
  } catch {
    await env.DB.prepare("DELETE FROM verifications WHERE id = ?")
      .bind(record.id)
      .run();
    return Response.json(
      { error: "Sesi verifikasi tidak valid. Silakan kirim ulang kode." },
      { status: 400 }
    );
  }

  if (payload.attempts >= OTP_MAX_ATTEMPTS) {
    await env.DB.prepare("DELETE FROM verifications WHERE id = ?")
      .bind(record.id)
      .run();
    return Response.json(
      { error: "Terlalu banyak percobaan gagal. Silakan kirim ulang kode verifikasi baru." },
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

  // Re-check uniqueness tepat sebelum membuat akun
  const [existingUsername, existingEmail] = await Promise.all([
    env.DB.prepare("SELECT id FROM users WHERE username = ? LIMIT 1")
      .bind(usernameCheck.normalized)
      .first<{ id: string }>(),
    env.DB.prepare("SELECT id FROM users WHERE lower(email) = ? LIMIT 1")
      .bind(normalizedEmail)
      .first<{ id: string }>(),
  ]);

  if (existingEmail) {
    await env.DB.prepare("DELETE FROM verifications WHERE identifier = ?")
      .bind(identifier)
      .run();
    return Response.json(
      { error: "Email ini sudah terdaftar pada akun lain. Silakan masuk." },
      { status: 409 }
    );
  }

  if (existingUsername) {
    return Response.json(
      { error: "Username ini baru saja digunakan orang lain. Silakan ubah username Anda." },
      { status: 409 }
    );
  }

  const auth = createAuth(env, context.request.url);

  try {
    await auth.api.signUpEmail({
      body: {
        name: trimmedName,
        email: normalizedEmail,
        password,
        username: usernameCheck.normalized,
        displayUsername: usernameCheck.display,
      },
      headers: context.request.headers,
    });

    // Tandai email sudah terverifikasi sebelum menerbitkan sesi akhir
    await env.DB.prepare(
      "UPDATE users SET email_verified = 1, updated_at = ? WHERE lower(email) = ?"
    )
      .bind(Date.now(), normalizedEmail)
      .run();

    await env.DB.prepare("DELETE FROM verifications WHERE identifier = ?")
      .bind(identifier)
      .run();

    const signInResponse = await auth.api.signInEmail({
      body: {
        email: normalizedEmail,
        password,
      },
      headers: context.request.headers,
      asResponse: true,
    });

    return signInResponse;
  } catch (error) {
    console.error("[verify-register] Gagal menyelesaikan pendaftaran:", error);
    return Response.json(
      { error: "Gagal menyelesaikan pendaftaran. Silakan coba lagi." },
      { status: 500 }
    );
  }
};
