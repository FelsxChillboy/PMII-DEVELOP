import { prisma } from "@/lib/prisma"
import { success, serverError, parseSearchParams } from "@/lib/api-response"
import { requireAdmin } from "@/lib/server/auth"

export async function GET(request: Request) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const eventId = searchParams.get("eventId")
    const status = searchParams.get("status")

    const where: Record<string, unknown> = {}
    if (eventId) where.eventId = eventId
    if (status) where.status = status

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          event: { select: { id: true, title: true, date: true } },
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.registration.count({ where }),
    ])

    return success({ registrations, total, hasMore: skip + take < total }, 200, {
      "Cache-Control": "private, max-age=30, stale-while-revalidate=15",
    })
  } catch (err) {
    console.error("Fetch registrations failed:", err)
    return serverError("Gagal mengambil data pendaftaran")
  }
}
