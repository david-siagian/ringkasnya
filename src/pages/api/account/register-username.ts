import type { APIRoute } from "astro";
import { createAuth } from "@/lib/auth";
import { createPlaceholderEmail, validateUsername } from "@/lib/auth-helpers";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return Response.json(
      { error: "Database D1 belum terkonfigurasi pada runtime ini." },
      { status: 500 }
    );
  }

  let body: { name?: string; username?: string; password?: string };
  try {
    body = (await context.request.json()) as {
      name?: string;
      username?: string;
      password?: string;
    };
  } catch {
    return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const trimmedName = (body.name ?? "").trim();
  const password = body.password ?? "";
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

  if (password.length < 8 || password.length > 128) {
    return Response.json(
      { error: "Kata sandi harus antara 8 hingga 128 karakter." },
      { status: 400 }
    );
  }

  const existingUsername = await env.DB.prepare(
    "SELECT id FROM users WHERE username = ? LIMIT 1"
  )
    .bind(usernameCheck.normalized)
    .first<{ id: string }>();

  if (existingUsername) {
    return Response.json(
      { error: "Username ini sudah digunakan. Silakan pilih username lain." },
      { status: 409 }
    );
  }

  const placeholderEmail = createPlaceholderEmail(usernameCheck.normalized);
  const auth = createAuth(env, context.request.url);

  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: trimmedName,
        email: placeholderEmail,
        password,
        username: usernameCheck.normalized,
        displayUsername: usernameCheck.display,
      },
      headers: context.request.headers,
      asResponse: true,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
        code?: string;
      };
      return Response.json(
        {
          error:
            errorData.code === "USERNAME_IS_ALREADY_TAKEN"
              ? "Username ini sudah digunakan. Silakan pilih username lain."
              : errorData.message || "Gagal membuat akun. Silakan coba lagi.",
        },
        { status: response.status }
      );
    }

    return response;
  } catch (error) {
    console.error("[register-username] Gagal mendaftar:", error);
    return Response.json(
      { error: "Gagal membuat akun. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
};
