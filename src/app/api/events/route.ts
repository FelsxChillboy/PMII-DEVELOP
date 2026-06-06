import { prisma } from "@/lib/prisma"
import { success, serverError, parseSearchParams, error } from "@/lib/api-response"

export async function GET(request: Request) {
  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: Record<string, unknown> = {}
    const VALID_STATUSES = ["TERBUKA", "PENUH", "BERLANGSUNG", "SELESAI", "DIBATALKAN"]
    const VALID_TYPES = ["kegiatan", "workshop", "seminar", "rapat", "lainnya"]
    if (status && VALID_STATUSES.includes(status)) where.status = status
    if (!status) where.status = { not: "DRAFT" }
    if (type && VALID_TYPES.includes(type)) where.type = type
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {}
      if (startDate) {
        const d = new Date(startDate)
        if (isNaN(d.getTime())) return error("Invalid startDate", 400)
        dateFilter.gte = d
      }
      if (endDate) {
        const d = new Date(endDate)
        if (isNaN(d.getTime())) return error("Invalid endDate", 400)
        dateFilter.lte = d
      }
      where.date = dateFilter
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: "desc" },
        take,
        skip,
        include: { _count: { select: { registrations: true } } },
      }),
      prisma.event.count({ where }),
    ])

    const data = events.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description,
      type: e.type,
      status: e.status,
      date: e.date.toISOString(),
      dateEnd: e.dateEnd?.toISOString() || null,
      time: e.time,
      location: e.location,
      capacity: e.capacity,
      image: e.image,
      registrationsCount: e._count.registrations,
    }))

    return success({ events: data, total, hasMore: skip + take < total }, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    })
  } catch (err) {
    console.error("Events fetch failed:", err)
    return serverError("Gagal mengambil data kegiatan")
  }
}
