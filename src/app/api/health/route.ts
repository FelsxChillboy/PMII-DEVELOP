import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const start = Date.now()

  try {
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - start

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        db: { connected: true, latencyMs: latency },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Health check failed:", err)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        db: { connected: false },
      },
      { status: 503 }
    )
  }
}
