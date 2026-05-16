import { donationBroadcaster } from "@/lib/sse-broadcaster"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      donationBroadcaster.addClient(controller)
      request.signal.addEventListener("abort", () => {
        donationBroadcaster.removeClient(controller)
        controller.close()
      })
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
