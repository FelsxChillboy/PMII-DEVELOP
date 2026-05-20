import { prisma } from "@/lib/prisma"
import { success, serverError, parseSearchParams } from "@/lib/api-response"

export async function GET(request: Request) {
  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {}
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
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
