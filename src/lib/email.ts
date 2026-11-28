export interface SendOtpEmailParams {
  to: string;
  code: string;
  purpose: "register" | "add_email";
  recipientName?: string;
}

export type SendOtpEmailResult =
  | { ok: true }
  | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Mengirim email OTP 6 digit melalui Cloudflare Email Sending (`env.EMAIL` binding).
 * Menyertakan versi HTML dan plain-text sesuai standar deliverability Cloudflare Email Service.
 */
export async function sendOtpEmail(
  env: Env,
  params: SendOtpEmailParams
): Promise<SendOtpEmailResult> {
  const fromEmail = env.EMAIL_FROM?.trim() || "noreply@ringkasnya.id";
  const greetingName = params.recipientName?.trim()
    ? `Halo ${params.recipientName.trim()},`
    : "Halo,";

  const isRegister = params.purpose === "register";
  const subject = isRegister
    ? `${params.code} adalah kode verifikasi pendaftaran Ringkasnya`
    : `${params.code} adalah kode verifikasi email akun Ringkasnya`;

  const introText = isRegister
    ? "Gunakan kode verifikasi 6 digit di bawah ini untuk menyelesaikan pendaftaran akun Ringkasnya Anda:"
    : "Gunakan kode verifikasi 6 digit di bawah ini untuk menambahkan dan memverifikasi alamat email pada akun Ringkasnya Anda:";

  const text = [
    greetingName,
    "",
    introText,
    "",
    `Kode Verifikasi: ${params.code}`,
    "",
    "Kode ini berlaku selama 10 menit dan hanya dapat digunakan satu kali.",
    "Jika Anda tidak merasa meminta kode ini, silakan abaikan email ini.",
    "",
    "— Tim Ringkasnya",
  ].join("\n");

  const html = `<!doctype html>
<html lang="id">
  <body style="margin:0;padding:0;background-color:#f4f7f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
            <tr>
              <td style="background:#065f46;padding:24px 28px;text-align:left;">
                <span style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">Ringkasnya</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#111827;">${escapeHtml(greetingName)}</p>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4b5563;">${escapeHtml(introText)}</p>
                <div style="margin:0 0 24px;padding:18px 20px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;text-align:center;">
                  <span style="font-size:32px;font-weight:800;letter-spacing:0.24em;color:#065f46;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${escapeHtml(params.code)}</span>
                </div>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#6b7280;">Kode ini berlaku selama <strong>10 menit</strong>. Demi keamanan, jangan bagikan kode ini kepada siapa pun.</p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#6b7280;">Jika Anda tidak merasa meminta kode ini, silakan abaikan email ini.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
                Email otomatis dari Ringkasnya (ringkasnya.id)
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  if (!env.EMAIL) {
    console.warn(
      "[email] Binding EMAIL belum tersedia pada runtime ini. OTP untuk",
      params.to,
      ":",
      params.code
    );
    return {
      ok: false,
      error:
        "Layanan pengiriman email belum terkonfigurasi di lingkungan ini. Anda dapat mendaftar dengan username terlebih dahulu tanpa email.",
    };
  }

  try {
    await env.EMAIL.send({
      from: {
        email: fromEmail,
        name: "Ringkasnya",
      },
      to: params.to,
      subject,
      text,
      html,
    });
    return { ok: true };
  } catch (error) {
    console.error("[email] Gagal mengirim OTP via Cloudflare Email Sending:", error);
    return {
      ok: false,
      error:
        "Gagal mengirim kode verifikasi ke email Anda. Pastikan alamat email benar atau coba lagi beberapa saat lagi.",
    };
  }
}
