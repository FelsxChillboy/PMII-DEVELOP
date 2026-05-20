import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { success, unauthorized, serverError, parseSearchParams } from "@/lib/api-response"
import type { DonationStatus } from "@prisma/client"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()

  try {
    const { searchParams, take, skip } = parseSearchParams(request)
    const rawStatus = searchParams.get("status")
    const statusFilter = rawStatus && ["PENDING", "SUCCESS", "FAILED"].includes(rawStatus)
      ? (rawStatus as DonationStatus)
      : undefined

    const where = {
      userId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    } as const

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        select: {
          id: true,
          amount: true,
          status: true,
          type: true,
          message: true,
          createdAt: true,
        },
      }),
      prisma.donation.count({ where }),
    ])

    return success({ donations, total, hasMore: skip + take < total })
  } catch (err) {
    console.error("User donations fetch failed:", err)
    return serverError("Gagal mengambil riwayat donasi")
  }
}
