import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { success, error, unauthorized, serverError } from "@/lib/api-response"
import { z } from "zod"

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().max(500).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { donations: true, registrations: true, news: true } },
      },
    })
    if (!user) return error("User not found", 404)
    return success(user)
  } catch (err) {
    console.error("Profile fetch failed:", err)
    return serverError("Gagal mengambil profil")
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  try {
    const body = await request.json()
    const parsed = UpdateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    })
    return success(user)
  } catch (err) {
    console.error("Profile update failed:", err)
    return serverError("Gagal memperbarui profil")
  }
}
