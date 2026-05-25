"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  NewsSchema,
  EventSchema,
  UpdateUserRoleSchema,
  OrganizationMemberSchema,
} from "@/lib/schemas"
import { sanitizeContent } from "@/lib/sanitize"
import { logAudit } from "@/lib/audit"
import { uploadImage } from "@/lib/upload"

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

  const imageFile = formData.get("image") as File | null
  let imageUrl: string | undefined

  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile, "pmii-news")
    } catch {
      redirect("/admin/berita/buat?error=" + encodeURIComponent("Gagal upload gambar"))
    }
  } else {
    imageUrl = safeString(formData.get("imageUrl")) || undefined
  }

  const parsed = NewsSchema.safeParse({
    title: safeString(formData.get("title")),
    slug: safeString(formData.get("slug")),
    content: safeString(formData.get("content")),
    imageUrl,
    published: formData.get("published") === "on",
  })

  if (!parsed.success) {
    redirect("/admin/berita/buat?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    const news = await prisma.news.create({
      data: {
        ...parsed.data,
        content: sanitizeContent(parsed.data.content),
        imageUrl: parsed.data.imageUrl || null,
        authorId: session.user.id,
      },
    })
    await logAudit("CREATE", "NEWS", news.id, { title: parsed.data.title })
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

  const imageFile = formData.get("image") as File | null
  let imageUrl: string | undefined

  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile, "pmii-news")
    } catch {
      redirect("/admin/berita/" + newsId + "?error=" + encodeURIComponent("Gagal upload gambar"))
    }
  } else {
    imageUrl = safeString(formData.get("imageUrl")) || undefined
  }

  const parsed = NewsSchema.safeParse({
    title: safeString(formData.get("title")),
    slug: safeString(formData.get("slug")),
    content: safeString(formData.get("content")),
    imageUrl,
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
        content: sanitizeContent(parsed.data.content),
        imageUrl: parsed.data.imageUrl || null,
      },
    })
    await logAudit("UPDATE", "NEWS", newsId, { title: parsed.data.title })
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
    await logAudit("DELETE", "NEWS", id)
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
    const ev = await prisma.event.create({
      data: {
        ...parsed.data,
        description: sanitizeContent(parsed.data.description),
        date: new Date(parsed.data.date),
        dateEnd: parsed.data.dateEnd ? new Date(parsed.data.dateEnd) : null,
        image: parsed.data.image || null,
        time: parsed.data.time || null,
        status: "DRAFT",
      },
    })
    await logAudit("CREATE", "EVENT", ev.id, { title: parsed.data.title })
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
        description: sanitizeContent(parsed.data.description),
        date: new Date(parsed.data.date),
        dateEnd: parsed.data.dateEnd ? new Date(parsed.data.dateEnd) : null,
        image: parsed.data.image || null,
        time: parsed.data.time || null,
      },
    })
    await logAudit("UPDATE", "EVENT", eventId, { title: parsed.data.title })
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
    await logAudit("DELETE", "EVENT", id)
    revalidatePath("/admin/kegiatan")
  } catch (err) {
    console.error("Delete event failed:", handlePrismaError(err, ""))
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
    await logAudit("UPDATE", "USER", userId, { role: parsed.data.role })
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
    await logAudit("DELETE", "USER", userId, { name: user.name })
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
    await logAudit("UPDATE", "REGISTRATION", id, { status: "APPROVED" })
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

export async function createOrganizationMember(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const photoFile = formData.get("photo") as File | null
  let photoUrl: string | undefined

  if (photoFile && photoFile.size > 0) {
    try {
      photoUrl = await uploadImage(photoFile, "pmii-struktur")
    } catch {
      redirect("/admin/struktur/buat?error=" + encodeURIComponent("Gagal upload foto"))
    }
  } else {
    photoUrl = safeString(formData.get("photoUrl")) || undefined
  }

  const parsed = OrganizationMemberSchema.safeParse({
    name: safeString(formData.get("name")),
    position: safeString(formData.get("position")),
    photoUrl,
    instagramUrl: safeString(formData.get("instagramUrl")) || undefined,
    sortOrder: parseInt(safeString(formData.get("sortOrder"))) || 0,
  })

  if (!parsed.success) {
    redirect("/admin/struktur/buat?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    const member = await prisma.organizationMember.create({ data: parsed.data })
    await logAudit("CREATE", "STRUKTUR", member.id, { name: parsed.data.name, position: parsed.data.position })
    revalidatePath("/admin/struktur")
    revalidatePath("/tentang")
    redirect("/admin/struktur")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal menambah anggota struktur")
    if (result) redirect("/admin/struktur/buat?error=" + encodeURIComponent(result))
  }
}

export async function updateOrganizationMember(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  const photoFile = formData.get("photo") as File | null
  let photoUrl: string | undefined

  if (photoFile && photoFile.size > 0) {
    try {
      photoUrl = await uploadImage(photoFile, "pmii-struktur")
    } catch {
      redirect("/admin/struktur/" + id + "?error=" + encodeURIComponent("Gagal upload foto"))
    }
  } else {
    photoUrl = safeString(formData.get("photoUrl")) || undefined
  }

  const parsed = OrganizationMemberSchema.safeParse({
    name: safeString(formData.get("name")),
    position: safeString(formData.get("position")),
    photoUrl,
    instagramUrl: safeString(formData.get("instagramUrl")) || undefined,
    sortOrder: parseInt(safeString(formData.get("sortOrder"))) || 0,
  })

  if (!parsed.success) {
    redirect("/admin/struktur/" + id + "?error=" + encodeURIComponent(parsed.error.issues[0].message))
  }

  try {
    await prisma.organizationMember.update({
      where: { id },
      data: parsed.data,
    })
    await logAudit("UPDATE", "STRUKTUR", id, { name: parsed.data.name, position: parsed.data.position })
    revalidatePath("/admin/struktur")
    revalidatePath("/tentang")
    redirect("/admin/struktur")
  } catch (err) {
    const result = handlePrismaError(err, "Gagal memperbarui anggota struktur")
    if (result) redirect("/admin/struktur/" + id + "?error=" + encodeURIComponent(result))
  }
}

export async function deleteOrganizationMember(formData: FormData): Promise<void> {
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = safeString(formData.get("id"))
  if (!id) return

  try {
    await prisma.organizationMember.delete({ where: { id } })
    await logAudit("DELETE", "STRUKTUR", id)
    revalidatePath("/admin/struktur")
    revalidatePath("/tentang")
  } catch (err) {
    console.error("Delete structure member failed:", handlePrismaError(err, ""))
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
