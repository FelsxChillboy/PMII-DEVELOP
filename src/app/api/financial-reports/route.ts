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
      const messages = parsed.error.issues.map((i) => i.message).join("; ")
      return error(messages)
    }

    const where: Prisma.FinancialReportWhereInput = {}
    if (parsed.data.type) where.type = parsed.data.type
    if (parsed.data.category) where.category = parsed.data.category
    if (parsed.data.startDate || parsed.data.endDate) {
      where.date = {}
      if (parsed.data.startDate) {
        const d = new Date(parsed.data.startDate)
        if (isNaN(d.getTime())) return error("startDate: invalid date")
        where.date.gte = d
      }
      if (parsed.data.endDate) {
        const d = new Date(parsed.data.endDate)
        if (isNaN(d.getTime())) return error("endDate: invalid date")
        where.date.lte = d
      }
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
  } catch (err) {
    console.error("Financial reports fetch failed:", err)
    return serverError("Failed to fetch financial reports")
  }
}
