"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const DonationSchema = z.object({
  amount: z.number().min(1000, "Minimum donasi Rp 1.000"),
  message: z.string().optional(),
  type: z.enum(["ONE_TIME", "RECURRING"]).default("ONE_TIME"),
})

export async function createDonation(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Silakan login terlebih dahulu" }
  }

  const parsed = DonationSchema.safeParse({
    amount: Number(formData.get("amount")),
    message: formData.get("message"),
    type: formData.get("type"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    await prisma.donation.create({
      data: {
        amount: parsed.data.amount,
        message: parsed.data.message || null,
        type: parsed.data.type,
        status: "PENDING",
        userId: session.user.id,
      },
    })
    return { success: true }
  } catch {
    return { error: "Gagal menyimpan donasi" }
  }
}

export async function getDonationTotal() {
  const result = await prisma.donation.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCESS" },
  })
  return result._sum.amount || 0
}
