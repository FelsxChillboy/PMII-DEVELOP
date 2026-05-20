import { prisma } from "@/lib/prisma"
import { success, error, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/server/auth"
import { UpdateUserRoleSchema } from "@/lib/schemas"
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
    const parsed = UpdateUserRoleSchema.safeParse(body)
    if (!parsed.success) return error(parsed.error.issues[0].message)

    const updated = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, name: true, email: true, role: true },
    })

    revalidatePath("/admin/pengguna")

    return success(updated)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return notFound("Pengguna tidak ditemukan")
    console.error("Update user failed:", err)
    return serverError("Gagal mengupdate pengguna")
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
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    })
    if (!user) return notFound("Pengguna tidak ditemukan")

    if (user.role === "ADMIN") return error("Tidak dapat menghapus admin", 403)

    await prisma.user.delete({ where: { id } })

    revalidatePath("/admin/pengguna")

    return success({ message: "Pengguna berhasil dihapus" })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return notFound("Pengguna tidak ditemukan")
    console.error("Delete user failed:", err)
    return serverError("Gagal menghapus pengguna")
  }
}
