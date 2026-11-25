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
 * Adapter secondaryStorage Better Auth menggunakan Cloudflare KV.
 * Menyertakan guard TTL minimum 60 detik (syarat Cloudflare KV) dan
 * fallback aman agar gangguan KV tidak mematahkan autentikasi D1.
 */
function createKvSecondaryStorage(kv: KVNamespace) {
  return {
    get: async (key: string): Promise<string | null> => {
      try {
        return await kv.get(key);
      } catch (error) {
        console.warn("[auth kv] Gagal membaca key:", key, error);
        return null;
      }
    },
    set: async (key: string, value: string, ttl?: number): Promise<void> => {
      try {
        if (typeof ttl === "number" && ttl > 0) {
          // Cloudflare KV mewajibkan expirationTtl minimal 60 detik
          const expirationTtl = Math.max(Math.ceil(ttl), 60);
          await kv.put(key, value, { expirationTtl });
        } else {
          await kv.put(key, value);
        }
      } catch (error) {
        console.warn("[auth kv] Gagal menulis key:", key, error);
      }
    },
    delete: async (key: string): Promise<void> => {
      try {
        await kv.delete(key);
      } catch (error) {
        console.warn("[auth kv] Gagal menghapus key:", key, error);
      }
    },
  };
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
  const kvStorage = env.SESSION_KV
    ? createKvSecondaryStorage(env.SESSION_KV)
    : undefined;

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
    ...(kvStorage ? { secondaryStorage: kvStorage } : {}),
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
