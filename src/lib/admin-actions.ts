"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  NewsSchema,
  EventSchema,
  AdminFinancialReportSchema,
  UpdateUserRoleSchema,
} from "@/lib/schemas"

function handlePrismaError(err: unknown, fallback: string): string | null {
  if (err && typeof err === "object" && "code" in err) {
    const prismaErr = err as { code: string; meta?: { target?: string[] } }
    if (prismaErr.code === "P2002") {
      const target = prismaErr.meta?.target?.join(", ") || "field"
      return `Data dengan ${target} yang sama sudah ada`
    }
    if (prismaErr.code === "P2025") {
      return "Data tidak ditemukan"
    }
    if (prismaErr.code === "P2014") {
      return "Operasi gagal karena relasi data yang diperlukan tidak terpenuhi"
    }
  }
  if (err instanceof Error) {
    console.error(`Admin action error: ${err.message}`)
  }
  return fallback
}

function safeString(val: FormDataEntryValue | null): string {
  return typeof val === "string" ? val : ""
}

export async function createNews(formData: FormData): Promise<void> {
  const { session, error: authErr } = await requireAdmin()
  if (authErr || !session?.user?.id) return

  const parsed = NewsSchema.safeParse({
    title: safeString(formData.get("title")),
    slug: safeString(formData.get("slug")),
    content: safeString(formData.get("content")),
    imageUrl: safeString(formData.get("imageUrl")) || undefined,
    published: formData.get("published") === "on",
  })

  if (!parsed.success) {
    redirect("/admin/berita/buat?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    await prisma.news.create({
      data: {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl || null,
        authorId: session.user.id,
      },
    })
    revalidatePath("/admin/berita")
    redirect("/admin/berita")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal membuat berita")
    if (result) redirect("/admin/berita/buat?error=" + encodeURIComponent(result))
  }
}

export async function updateNews(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const newsId = safeString(formData.get("id"))
  if (!newsId) return

  const parsed = NewsSchema.safeParse({
    title: safeString(formData.get("title")),
    slug: safeString(formData.get("slug")),
    content: safeString(formData.get("content")),
    imageUrl: safeString(formData.get("imageUrl")) || undefined,
    published: formData.get("published") === "on",
  })

  if (!parsed.success) {
    redirect("/admin/berita/" + newsId + "?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    await prisma.news.update({
      where: { id: newsId },
      data: {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl || null,
      },
    })
    revalidatePath("/admin/berita")
    revalidatePath(`/berita/${parsed.data.slug}`)
    redirect("/admin/berita")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal memperbarui berita")
    if (result) redirect("/admin/berita/" + newsId + "?error=" + encodeURIComponent(result))
  }
}

export async function deleteNews(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  try {
    await prisma.news.delete({ where: { id } })
    revalidatePath("/admin/berita")
  } catch (err) {
    console.error("Delete news failed:", handlePrismaError(err, ""))
  }
}

export async function createEvent(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const parsed = EventSchema.safeParse({
    title: safeString(formData.get("title")),
    slug: safeString(formData.get("slug")),
    description: safeString(formData.get("description")),
    location: safeString(formData.get("location")),
    date: safeString(formData.get("date")),
    capacity: parseInt(safeString(formData.get("capacity"))) || 0,
    type: safeString(formData.get("type")) || undefined,
    time: safeString(formData.get("time")) || undefined,
    image: safeString(formData.get("image")) || undefined,
    dateEnd: safeString(formData.get("dateEnd")) || undefined,
  })

  if (!parsed.success) {
    redirect("/admin/kegiatan/buat?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    await prisma.event.create({
      data: {
        ...parsed.data,
        date: new Date(parsed.data.date),
        dateEnd: parsed.data.dateEnd ? new Date(parsed.data.dateEnd) : null,
        image: parsed.data.image || null,
        time: parsed.data.time || null,
        status: "DRAFT",
      },
    })
    revalidatePath("/admin/kegiatan")
    redirect("/admin/kegiatan")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal membuat kegiatan")
    if (result) redirect("/admin/kegiatan/buat?error=" + encodeURIComponent(result))
  }
}

export async function updateEvent(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const eventId = safeString(formData.get("id"))
  if (!eventId) return

  const parsed = EventSchema.safeParse({
    title: safeString(formData.get("title")),
    slug: safeString(formData.get("slug")),
    description: safeString(formData.get("description")),
    location: safeString(formData.get("location")),
    date: safeString(formData.get("date")),
    capacity: parseInt(safeString(formData.get("capacity"))) || 0,
    type: safeString(formData.get("type")) || undefined,
    time: safeString(formData.get("time")) || undefined,
    image: safeString(formData.get("image")) || undefined,
    dateEnd: safeString(formData.get("dateEnd")) || undefined,
  })

  if (!parsed.success) {
    redirect("/admin/kegiatan/" + eventId + "?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        ...parsed.data,
        date: new Date(parsed.data.date),
        dateEnd: parsed.data.dateEnd ? new Date(parsed.data.dateEnd) : null,
        image: parsed.data.image || null,
        time: parsed.data.time || null,
      },
    })
    revalidatePath("/admin/kegiatan")
    redirect("/admin/kegiatan")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal memperbarui kegiatan")
    if (result) redirect("/admin/kegiatan/" + eventId + "?error=" + encodeURIComponent(result))
  }
}

export async function deleteEvent(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  try {
    await prisma.event.delete({ where: { id } })
    revalidatePath("/admin/kegiatan")
  } catch (err) {
    console.error("Delete event failed:", handlePrismaError(err, ""))
  }
}

export async function createFinancialReport(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const parsed = AdminFinancialReportSchema.safeParse({
    title: safeString(formData.get("title")),
    type: safeString(formData.get("type")) as "INCOME" | "EXPENSE",
    amount: parseInt(safeString(formData.get("amount"))) || 0,
    category: safeString(formData.get("category")),
    description: safeString(formData.get("description")) || undefined,
    date: safeString(formData.get("date")),
  })

  if (!parsed.success) {
    redirect("/admin/keuangan/buat?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    await prisma.financialReport.create({
      data: {
        ...parsed.data,
        date: new Date(parsed.data.date),
      },
    })
    revalidatePath("/admin/keuangan")
    redirect("/admin/keuangan")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal membuat laporan keuangan")
    if (result) redirect("/admin/keuangan/buat?error=" + encodeURIComponent(result))
  }
}

export async function updateFinancialReport(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  const parsed = AdminFinancialReportSchema.safeParse({
    title: safeString(formData.get("title")),
    type: safeString(formData.get("type")) as "INCOME" | "EXPENSE",
    amount: parseInt(safeString(formData.get("amount"))) || 0,
    category: safeString(formData.get("category")),
    description: safeString(formData.get("description")) || undefined,
    date: safeString(formData.get("date")),
  })

  if (!parsed.success) {
    redirect("/admin/keuangan/" + id + "?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    await prisma.financialReport.update({
      where: { id },
      data: {
        ...parsed.data,
        date: new Date(parsed.data.date),
      },
    })
    revalidatePath("/admin/keuangan")
    redirect("/admin/keuangan")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal memperbarui laporan keuangan")
    if (result) redirect("/admin/keuangan/" + id + "?error=" + encodeURIComponent(result))
  }
}

export async function deleteFinancialReport(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  try {
    await prisma.financialReport.delete({ where: { id } })
    revalidatePath("/admin/keuangan")
  } catch (err) {
    console.error("Delete financial report failed:", handlePrismaError(err, ""))
  }
}

export async function updateUserRole(formData: FormData): Promise<void> {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return

  const userId = safeString(formData.get("userId"))
  const role = safeString(formData.get("role"))

  const parsed = UpdateUserRoleSchema.safeParse({ role })
  if (!parsed.success) return

  if (userId === session?.user?.id) return

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
    })
    revalidatePath("/admin/pengguna")
  } catch (err) {
    console.error("Update role failed:", handlePrismaError(err, ""))
  }
}

export async function deleteUser(formData: FormData): Promise<void> {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return

  const userId = safeString(formData.get("userId"))
  if (!userId) return

  if (userId === session?.user?.id) return

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.role === "ADMIN") return
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath("/admin/pengguna")
  } catch (err) {
    console.error("Delete user failed:", handlePrismaError(err, ""))
  }
}

export async function approveRegistration(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  try {
    await prisma.registration.update({ where: { id }, data: { status: "APPROVED" } })
    revalidatePath("/admin/kegiatan/[id]/registrations")
  } catch (err) {
    console.error("Approve registration failed:", handlePrismaError(err, ""))
  }
}

export async function rejectRegistration(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  try {
    await prisma.registration.update({ where: { id }, data: { status: "REJECTED" } })
    revalidatePath("/admin/kegiatan/[id]/registrations")
  } catch (err) {
    console.error("Reject registration failed:", handlePrismaError(err, ""))
  }
}

export async function deleteRegistration(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  try {
    await prisma.registration.delete({ where: { id } })
    revalidatePath("/admin/kegiatan/[id]/registrations")
  } catch (err) {
    console.error("Delete registration failed:", handlePrismaError(err, ""))
  }
}

export async function toggleMessageRead(id: string): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  if (!id) return

  try {
    const msg = await prisma.contact.findUnique({ where: { id } })
    if (!msg) return
    await prisma.contact.update({
      where: { id },
      data: { read: !msg.read },
    })
    revalidatePath("/admin/kontak")
  } catch (err) {
    console.error("Toggle read failed:", handlePrismaError(err, ""))
  }
}

export async function deleteMessage(id: string): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  if (!id) return

  try {
    await prisma.contact.delete({ where: { id } })
    revalidatePath("/admin/kontak")
  } catch (err) {
    console.error("Delete message failed:", handlePrismaError(err, ""))
  }
}
