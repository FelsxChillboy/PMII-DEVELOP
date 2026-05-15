import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendTotal = async () => {
        try {
          const result = await prisma.donation.aggregate({
            _sum: { amount: true },
            where: { status: "SUCCESS" },
          })
          const data = JSON.stringify({ total: result._sum.amount || 0 })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {
          controller.enqueue(encoder.encode(`data: {"error":"fetch_failed"}\n\n`))
        }
      }

      await sendTotal()
      const interval = setInterval(sendTotal, 5000)

      const cleanup = () => {
        clearInterval(interval)
        controller.close()
      }

      request.signal.addEventListener("abort", cleanup)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
