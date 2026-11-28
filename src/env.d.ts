/// <reference path="../.astro/types.d.ts" />

interface EmailSendMessage {
  from: string | { email: string; name?: string };
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string | { email: string; name?: string };
}

interface SendEmailBinding {
  send(message: EmailSendMessage): Promise<{ messageId?: string } | void>;
}

interface Env {
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  EMAIL_FROM?: string;
  EMAIL?: SendEmailBinding;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface AuthUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    username?: string | null;
    displayUsername?: string | null;
    image?: string | null;
    role: string;
    plan: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface AuthSession {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Locals extends Runtime {
    user: AuthUser | null;
    session: AuthSession | null;
  }
}
