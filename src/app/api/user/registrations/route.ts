import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { success, unauthorized, serverError, parseSearchParams } from "@/lib/api-response"
import type { RegistrationStatus } from "@prisma/client"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const rawStatus = searchParams.get("status")
    const statusFilter = rawStatus && ["PENDING", "APPROVED", "REJECTED"].includes(rawStatus)
      ? (rawStatus as RegistrationStatus)
      : undefined

    const where = {
      userId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    }

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          event: {
            select: { id: true, title: true, slug: true, date: true, location: true },
          },
        },
      }),
      prisma.registration.count({ where }),
    ])

    return success({ registrations, total, hasMore: skip + take < total })
  } catch (err) {
    console.error("User registrations fetch failed:", err)
    return serverError("Gagal mengambil riwayat pendaftaran")
  }
}
