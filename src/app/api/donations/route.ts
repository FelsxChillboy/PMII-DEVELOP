import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      where: { status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    const total = donations.reduce<number>((sum, d) => sum + d.amount, 0)
    return NextResponse.json({ donations, total })
  } catch {
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { amount, message, type } = body

    if (!amount || amount < 1000) {
      return NextResponse.json({ error: "Minimum donation is Rp 1.000" }, { status: 400 })
    }

    const donation = await prisma.donation.create({
      data: {
        amount,
        message: message || null,
        type: type || "ONE_TIME",
        status: "PENDING",
        userId: session.user.id,
      },
    })

    return NextResponse.json({ donation }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
  }
}
