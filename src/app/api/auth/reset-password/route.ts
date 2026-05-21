import { prisma } from "@/lib/prisma"
import { success, error, serverError } from "@/lib/api-response"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").max(100),
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const limit = await checkRateLimit(`reset-password:${ip}`, 5, 300_000)
  if (!limit.allowed) {
    return error(`Terlalu banyak permintaan. Coba lagi dalam ${limit.retryAfter} detik.`, 429)
  }

  try {
    const body = await request.json()
    const parsed = ResetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: parsed.data.token,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return error("Token tidak valid atau sudah kedaluwarsa", 400)
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return success({ message: "Password berhasil direset" })
  } catch (err) {
    console.error("Reset password failed:", err)
    return serverError("Gagal mereset password")
  }
}
