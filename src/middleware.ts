import { defineMiddleware } from "astro:middleware";
import { createAuth } from "@/lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = null;
  context.locals.session = null;

  // Lewati pemeriksaan sesi pada halaman statis saat proses prerender build
  if (context.isPrerendered) {
    return next();
  }

  const env = context.locals.runtime?.env;
  if (!env?.DB) {
    return next();
  }

  try {
    const auth = createAuth(env, context.request.url);
    const sessionData = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (sessionData) {
      const rawUser = sessionData.user as typeof sessionData.user & {
        role?: string;
        plan?: string;
        username?: string | null;
        displayUsername?: string | null;
      };
      context.locals.user = {
        ...rawUser,
        username: rawUser.username ?? null,
        displayUsername: rawUser.displayUsername ?? null,
        role: rawUser.role ?? "user",
        plan: rawUser.plan ?? "free",
      };
      context.locals.session = sessionData.session;
    }
  } catch (error) {
    console.error("[auth middleware] Gagal memvalidasi sesi:", error);
  }

  const pathname = context.url.pathname;

  // Proteksi halaman akun: wajib login
  if (
    (pathname === "/akun" || pathname.startsWith("/akun/")) &&
    !context.locals.user
  ) {
    const redirectTo = encodeURIComponent(pathname + context.url.search);
    return context.redirect(`/masuk?redirect=${redirectTo}`);
  }

  return next();
});
