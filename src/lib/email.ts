const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@pmii-rayonteknik-unusia.vercel.app"
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "PR PMII Rayon Teknik UNUSIA"

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`)
    return { success: true, mock: true }
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: `${APP_NAME} <${FROM_EMAIL}>`, to, subject, html }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("Email send failed:", err)
    throw new Error("Gagal mengirim email")
  }

  return res.json()
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return sendEmail({
    to,
    subject: `Reset Password - ${APP_NAME}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f5f5f5;padding:40px">
<div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:32px">
<div style="font-size:24px;font-weight:bold;color:#4f46e5;margin-bottom:16px">${APP_NAME}</div>
<p style="color:#333;font-size:14px;line-height:1.6">Kami menerima permintaan reset password untuk akun Anda.</p>
<p style="color:#333;font-size:14px;line-height:1.6">Klik tombol di bawah untuk mereset password Anda. Link ini berlaku selama 1 jam.</p>
<div style="text-align:center;margin:24px 0">
<a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600">Reset Password</a>
</div>
<p style="color:#666;font-size:12px;line-height:1.6">Jika Anda tidak meminta reset password, abaikan email ini.</p>
<p style="color:#999;font-size:11px;margin-top:16px">&copy; ${APP_NAME}</p>
</div>
</body>
</html>`,
  })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendContactNotification(name: string, email: string, subject: string, message: string) {
  return sendEmail({
    to: process.env.ADMIN_EMAIL || "rayonteknikunusia@gmail.com",
    subject: `[Kontak Baru] ${subject} - ${APP_NAME}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f5f5f5;padding:40px">
<div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:32px">
<h2 style="color:#333;margin:0 0 16px">Pesan Kontak Baru</h2>
<table style="width:100%;font-size:13px;color:#333">
<tr><td style="padding:4px 0;color:#666">Nama</td><td style="padding:4px 0">${escapeHtml(name)}</td></tr>
<tr><td style="padding:4px 0;color:#666">Email</td><td style="padding:4px 0">${escapeHtml(email)}</td></tr>
<tr><td style="padding:4px 0;color:#666">Subjek</td><td style="padding:4px 0">${escapeHtml(subject)}</td></tr>
</table>
<div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;font-size:13px;color:#333;line-height:1.6">${escapeHtml(message)}</div>
</div>
</body>
</html>`,
  })
}

export async function sendDonationReceipt(to: string, amount: number, donorName: string) {
  return sendEmail({
    to,
    subject: `Konfirmasi Donasi - ${APP_NAME}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f5f5f5;padding:40px">
<div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:32px">
<h2 style="color:#333;margin:0 0 8px">Terima Kasih, ${donorName}!</h2>
<p style="color:#666;font-size:14px">Donasi Anda sebesar <strong style="color:#4f46e5">Rp${amount.toLocaleString("id-ID")}</strong> telah kami terima.</p>
<p style="color:#666;font-size:13px;line-height:1.6">Donasi Anda akan digunakan untuk kegiatan kaderisasi dan pengembangan organisasi PR PMII Rayon Teknik UNUSIA Jakarta Pusat.</p>
</div>
</body>
</html>`,
  })
}

export async function sendRegistrationConfirmation(to: string, eventTitle: string, eventDate: string) {
  return sendEmail({
    to,
    subject: `Pendaftaran Kegiatan - ${eventTitle}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f5f5f5;padding:40px">
<div style="max-width:480px;margin:auto;background:white;border-radius:12px;padding:32px">
<h2 style="color:#333;margin:0 0 8px">Pendaftaran Berhasil</h2>
<p style="color:#666;font-size:14px">Anda terdaftar di kegiatan: <strong>${eventTitle}</strong></p>
<p style="color:#666;font-size:13px">Tanggal: ${eventDate}</p>
<p style="color:#666;font-size:13px;margin-top:16px">Tunggu konfirmasi dari admin untuk status pendaftaran Anda.</p>
</div>
</body>
</html>`,
  })
}
