import { prisma } from "@/lib/prisma"
import { success, error, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/server/auth"
import { UpdateRegistrationSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = UpdateRegistrationSchema.safeParse(body)
    if (!parsed.success) return error(parsed.error.issues[0].message)

    const updated = await prisma.registration.update({
      where: { id },
      data: { status: parsed.data.status },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } },
      },
    })

    revalidatePath("/admin/kegiatan")

    return success(updated)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return notFound("Pendaftaran tidak ditemukan")
    console.error("Update registration failed:", err)
    return serverError("Gagal mengupdate pendaftaran")
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  const { id } = await params

  try {
    await prisma.registration.delete({ where: { id } })

    revalidatePath("/admin/kegiatan")

    return success({ message: "Pendaftaran berhasil dihapus" })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return notFound("Pendaftaran tidak ditemukan")
    console.error("Delete registration failed:", err)
    return serverError("Gagal menghapus pendaftaran")
  }
}
