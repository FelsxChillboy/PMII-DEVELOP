import { donationBroadcaster } from "@/lib/sse-broadcaster"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  donationBroadcaster.init()

  let controllerRef: ReadableStreamDefaultController | null = null

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller
      donationBroadcaster.addClient(controller)
      request.signal.addEventListener("abort", () => {
        donationBroadcaster.removeClient(controller)
        try { controller.close() } catch {}
      })
    },
    cancel() {
      if (controllerRef) {
        donationBroadcaster.removeClient(controllerRef)
        controllerRef = null
      }
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
