import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb, schema } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export function isGoogleOAuthConfigured(env?: Partial<Env>): boolean {
  return Boolean(
    env?.GOOGLE_CLIENT_ID?.trim() && env?.GOOGLE_CLIENT_SECRET?.trim()
  );
}

/**
 * Factory per-request untuk Better Auth di Cloudflare Workers.
 * Wajib dipanggil di dalam request handler/middleware karena binding `env.DB`
 * hanya tersedia saat runtime request.
 */
export function createAuth(env: Env, requestUrl?: string) {
  const origin = requestUrl ? new URL(requestUrl).origin : "http://localhost:4321";
  const baseURL = env.BETTER_AUTH_URL?.trim() || origin;
  const secret =
    env.BETTER_AUTH_SECRET?.trim() ||
    "dev-only-ringkasnya-fallback-secret-change-in-production";

  const googleConfigured = isGoogleOAuthConfigured(env);

  return betterAuth({
    appName: "ringkasnya.id",
    baseURL,
    secret,
    database: drizzleAdapter(getDb(env.DB), {
      provider: "sqlite",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
      password: {
        hash: hashPassword,
        verify: verifyPassword,
      },
    },
    ...(googleConfigured
      ? {
          socialProviders: {
            google: {
              clientId: env.GOOGLE_CLIENT_ID!.trim(),
              clientSecret: env.GOOGLE_CLIENT_SECRET!.trim(),
            },
          },
        }
      : {}),
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          input: false,
        },
        plan: {
          type: "string",
          defaultValue: "free",
          input: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 14, // 14 hari
      updateAge: 60 * 60 * 24, // perbarui sesi tiap 24 jam aktif
    },
    trustedOrigins: Array.from(
      new Set([
        baseURL,
        origin,
        "http://localhost:4321",
        "http://localhost:8787",
        "https://ringkasnya.id",
        "https://www.ringkasnya.id",
      ])
    ),
    advanced: {
      cookiePrefix: "ringkasnya",
    },
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
