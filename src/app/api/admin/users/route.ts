import { prisma } from "@/lib/prisma"
import { success, serverError, parseSearchParams } from "@/lib/api-response"
import { requireAdmin } from "@/lib/server/auth"

export async function GET(request: Request) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { donations: true, registrations: true, news: true } },
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.user.count({ where }),
    ])

    return success({ users, total, hasMore: skip + take < total }, 200, {
      "Cache-Control": "private, max-age=60, stale-while-revalidate=30",
    })
  } catch (err) {
    console.error("Fetch users failed:", err)
    return serverError("Gagal mengambil data pengguna")
  }
}
