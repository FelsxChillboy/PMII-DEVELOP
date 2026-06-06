import { prisma } from "@/lib/prisma"
import { success, error, serverError } from "@/lib/api-response"
import { rateLimitMiddleware } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const rateLimitResponse = await rateLimitMiddleware("search", 20, 60_000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")?.trim()

    if (!q || q.length < 2) return error("Kata kunci minimal 2 karakter")
    if (q.length > 100) return error("Kata kunci maksimal 100 karakter")

    const [news, events] = await Promise.all([
      prisma.news.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          author: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.event.findMany({
        where: {
          status: { not: "DRAFT" },
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          location: true,
          _count: { select: { registrations: true } },
        },
        orderBy: { date: "desc" },
        take: 10,
      }),
    ])

    return success({
      query: q,
      news: news.map((n) => ({ ...n, type: "news" as const })),
      events: events.map((e) => ({
        ...e,
        date: e.date.toISOString(),
        registrations: e._count.registrations,
        type: "event" as const,
      })),
    }, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    })
  } catch (err) {
    console.error("Search failed:", err)
    return serverError("Gagal melakukan pencarian")
  }
}
