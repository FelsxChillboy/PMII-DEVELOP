import { prisma } from "@/lib/prisma"
import { success, error, serverError } from "@/lib/api-response"
import { sendPasswordResetEmail } from "@/lib/email"
import { z } from "zod"
import { randomBytes, createHash } from "crypto"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const limit = await checkRateLimit(`forgot-password:${ip}`, 3, 300_000)
  if (!limit.allowed) {
    return error(`Terlalu banyak permintaan. Coba lagi dalam ${limit.retryAfter} detik.`, 429)
  }

  try {
    const body = await request.json()
    const parsed = ForgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (!user) {
      return success({ message: "Jika email terdaftar, link reset akan dikirim" })
    }

    const token = randomBytes(32).toString("hex")
    const hashedToken = createHash("sha256").update(token).digest("hex")
    const expiry = new Date(Date.now() + 3_600_000)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = `${appUrl}/reset-password?token=${token}`

    await sendPasswordResetEmail(parsed.data.email, resetUrl)

    return success({ message: "Jika email terdaftar, link reset akan dikirim" })
  } catch (err) {
    console.error("Forgot password failed:", err)
    return serverError("Gagal memproses permintaan")
  }
}
