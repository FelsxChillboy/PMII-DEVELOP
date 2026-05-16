"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"

const ContactSchema = z.object({
  name: z.string().min(2, "Nama harus diisi minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  subject: z.string().min(3, "Subjek harus diisi minimal 3 karakter"),
  message: z.string().min(10, "Pesan harus diisi minimal 10 karakter"),
})

type State = { error?: string; success?: boolean } | null

export async function submitContact(_prevState: State, formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0].message
    return { error: firstError }
  }

  await prisma.contact.create({
    data: parsed.data,
  })

  return { success: true }
}
