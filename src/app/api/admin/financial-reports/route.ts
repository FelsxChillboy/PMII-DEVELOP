import { prisma } from "@/lib/prisma"
import { success, error, serverError, parseSearchParams } from "@/lib/api-response"
import { requireAdmin } from "@/lib/server/auth"
import { FinancialReportSchema } from "@/lib/schemas"

export async function GET(request: Request) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const type = searchParams.get("type")
    const category = searchParams.get("category")

    const where: Record<string, unknown> = {}
    if (type) where.type = type
    if (category) where.category = category

    const [reports, total] = await Promise.all([
      prisma.financialReport.findMany({
        where,
        orderBy: { date: "desc" },
        take,
        skip,
      }),
      prisma.financialReport.count({ where }),
    ])

    const data = reports.map((r) => ({
      ...r,
      date: r.date.toISOString().split("T")[0],
    }))

    return success({ reports: data, total, hasMore: skip + take < total }, 200, {
      "Cache-Control": "private, max-age=60, stale-while-revalidate=30",
    })
  } catch (err) {
    console.error("Fetch financial reports failed:", err)
    return serverError("Gagal mengambil laporan keuangan")
  }
}

export async function POST(request: Request) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr) return authErr

  try {
    const body = await request.json()
    const parsed = FinancialReportSchema.safeParse(body)
    if (!parsed.success) return error(parsed.error.issues[0].message)

    const report = await prisma.financialReport.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        amount: parsed.data.amount,
        category: parsed.data.category,
        date: new Date(parsed.data.date),
      },
    })

    return success({
      ...report,
      date: report.date.toISOString().split("T")[0],
    }, 201)
  } catch (err) {
    console.error("Create financial report failed:", err)
    return serverError("Gagal membuat laporan keuangan")
  }
}
