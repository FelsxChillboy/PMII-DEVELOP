import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { success, error, unauthorized, serverError, parseSearchParams } from "@/lib/api-response"
import { DonationSchema } from "@/lib/schemas"
import type { DonationStatus } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const rawStatus = searchParams.get("status")
    const status = rawStatus
      ? (["PENDING", "SUCCESS", "FAILED"].includes(rawStatus) ? rawStatus as DonationStatus : "SUCCESS" as DonationStatus)
      : "SUCCESS" as DonationStatus

    const where = { status }

    const [donations, total, count] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where,
      }),
      prisma.donation.count({ where }),
    ])

    return success({
      donations,
      total: total._sum.amount || 0,
      count,
      hasMore: skip + take < count,
    }, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    })
  } catch {
    return serverError("Failed to fetch donations")
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return unauthorized()
  }

  try {
    const body = await request.json()
    const parsed = DonationSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const donation = await prisma.donation.create({
      data: {
        amount: parsed.data.amount,
        message: parsed.data.message || null,
        type: parsed.data.type as "ONE_TIME" | "RECURRING",
        status: "PENDING",
        userId: session.user.id,
        donorName: parsed.data.donorName || null,
        donorEmail: parsed.data.donorEmail || null,
        donorPhone: parsed.data.donorPhone || null,
      },
    })

    return success(donation, 201)
  } catch {
    return serverError("Failed to create donation")
  }
}
