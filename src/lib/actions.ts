"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { DonationSchema } from "@/lib/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function createDonation(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Silakan login terlebih dahulu" }
  }

  const parsed = DonationSchema.safeParse({
    amount: Number(formData.get("amount")),
    message: formData.get("message"),
    type: formData.get("type"),
    donorName: formData.get("donorName"),
    donorEmail: formData.get("donorEmail"),
    donorPhone: formData.get("donorPhone"),
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
        donorName: parsed.data.donorName || null,
        donorEmail: parsed.data.donorEmail || null,
        donorPhone: parsed.data.donorPhone || null,
      },
    })
    revalidatePath("/donasi")
    return { success: true }
  } catch (err) {
    console.error("Create donation failed:", err)
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

const RegisterSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  email: z.string().email("Email tidak valid").max(100),
  password: z.string().min(6, "Password minimal 6 karakter").max(100),
})

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { error: "password_mismatch" }
  }

  const parsed = RegisterSchema.safeParse({ name, email, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })

  if (existing) {
    return { error: "email_exists" }
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        role: "USER",
      },
    })
    revalidatePath("/admin/pengguna")
  } catch (err) {
    console.error("Register user failed:", err)
    return { error: "Gagal mendaftarkan pengguna" }
  }

  return { success: true }
}
