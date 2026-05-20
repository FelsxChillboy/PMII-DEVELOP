import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { success, error, unauthorized, serverError, parseSearchParams } from "@/lib/api-response"
import { DonationSchema } from "@/lib/schemas"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { createSnapTransaction } from "@/lib/payment"
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
        select: {
          id: true,
          amount: true,
          message: true,
          donorName: true,
          type: true,
          createdAt: true,
        },
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
  } catch (err) {
    console.error("Donations fetch failed:", err)
    return serverError("Failed to fetch donations")
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return unauthorized()
  }

  const ip = getClientIp(request)
  const limitCheck = checkRateLimit(`donation:${session.user.id || ip}`, 5, 60_000)
  if (!limitCheck.allowed) {
    return error(`Terlalu banyak permintaan. Coba lagi dalam ${limitCheck.retryAfter} detik.`, 429)
  }

  try {
    const body = await request.json()
    const parsed = DonationSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const orderId = `DON-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

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
        transactionId: orderId,
      },
    })

    let paymentUrl: string | null = null
    try {
      const transaction = await createSnapTransaction({
        orderId,
        amount: parsed.data.amount,
        donorName: parsed.data.donorName || undefined,
        donorEmail: parsed.data.donorEmail || undefined,
        donorPhone: parsed.data.donorPhone || undefined,
      })
      paymentUrl = transaction.paymentUrl
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          transactionId: transaction.transactionId,
          paymentUrl: transaction.paymentUrl,
          status: transaction.status,
        },
      })
    } catch (paymentErr) {
      console.error("Payment transaction failed:", paymentErr)
    }

    return success({ donation: { ...donation, paymentUrl }, paymentUrl }, 201)
  } catch (err) {
    console.error("Donation create failed:", err)
    return serverError("Gagal membuat donasi")
  }
}
