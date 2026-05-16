import { prisma } from "@/lib/prisma"
import { success, error, serverError } from "@/lib/api-response"
import { FinancialReportQuerySchema } from "@/lib/schemas"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams.entries())
    const parsed = FinancialReportQuerySchema.safeParse(params)

    if (!parsed.success) {
      return error("Invalid query parameters")
    }

    const where: Prisma.FinancialReportWhereInput = {}
    if (parsed.data.type) where.type = parsed.data.type
    if (parsed.data.category) where.category = parsed.data.category
    if (parsed.data.startDate || parsed.data.endDate) {
      where.date = {}
      if (parsed.data.startDate) where.date.gte = new Date(parsed.data.startDate)
      if (parsed.data.endDate) where.date.lte = new Date(parsed.data.endDate)
    }

    const reports = await prisma.financialReport.findMany({
      where,
      orderBy: { date: "desc" },
    })

    const data = reports.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      amount: r.amount,
      category: r.category,
      date: r.date.toISOString().split("T")[0],
    }))

    return success(data, 200, {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    })
  } catch {
    return serverError("Failed to fetch financial reports")
  }
}
