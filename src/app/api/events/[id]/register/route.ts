import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { success, error, unauthorized, notFound, serverError } from "@/lib/api-response"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return unauthorized()
  }

  const { id } = await params

  try {
    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) return notFound("Event tidak ditemukan")

    const regCount = await prisma.registration.count({ where: { eventId: id } })
    if (regCount >= event.capacity) return error("Pendaftaran penuh", 400)

    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId: id } },
    })
    if (existing) return error("Anda sudah terdaftar", 409)

    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id,
        eventId: id,
        status: "PENDING",
      },
      include: { event: { select: { title: true, date: true } } },
    })

    return success(registration, 201)
  } catch (err) {
    console.error("Registration failed:", err)
    return serverError("Gagal mendaftar")
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  const { id } = await params

  try {
    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) return notFound("Event tidak ditemukan")

    const registration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId: id } },
    })
    if (!registration) return notFound("Pendaftaran tidak ditemukan")

    await prisma.registration.delete({ where: { id: registration.id } })

    return success({ message: "Berhasil membatalkan pendaftaran" })
  } catch (err) {
    console.error("Cancel registration failed:", err)
    return serverError("Gagal membatalkan pendaftaran")
  }
}
