import { prisma } from "@/lib/prisma"
import { success, serverError, parseSearchParams } from "@/lib/api-response"

export async function GET(request: Request) {
  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const search = searchParams.get("q")

    const where: Record<string, unknown> = {
      published: true,
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ]
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          imageUrl: true,
          published: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
      prisma.news.count({ where }),
    ])

    const data = news.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      imageUrl: n.imageUrl,
      published: n.published,
      createdAt: n.createdAt.toISOString(),
      author: n.author?.name,
    }))

    return success({ news: data, total, hasMore: skip + take < total }, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    })
  } catch (err) {
    console.error("News fetch failed:", err)
    return serverError("Gagal mengambil data berita")
  }
}
