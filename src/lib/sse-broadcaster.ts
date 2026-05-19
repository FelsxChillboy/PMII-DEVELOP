import { prisma } from "@/lib/prisma"

type StreamController = ReadableStreamDefaultController

const MAX_CLIENTS = 50

class DonationBroadcaster {
  private controllers = new Set<StreamController>()
  private interval: ReturnType<typeof setInterval> | null = null
  private encoder = new TextEncoder()

  addClient(controller: StreamController) {
    if (this.controllers.size >= MAX_CLIENTS) {
      console.warn(`SSE: max clients (${MAX_CLIENTS}) reached, rejecting`)
      try { controller.close() } catch {}
      return
    }
    this.controllers.add(controller)
    this.start()
  }

  removeClient(controller: StreamController) {
    this.controllers.delete(controller)
    if (this.controllers.size === 0) this.stop()
  }

  private start() {
    if (this.interval) return
    this.broadcast()
    this.interval = setInterval(() => this.broadcast(), 5000)
  }

  private stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  private async broadcast() {
    try {
      const result = await prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
      })
      const data = JSON.stringify({ total: result._sum.amount || 0 })
      const message = this.encoder.encode(`data: ${data}\n\n`)
      for (const ctrl of this.controllers) {
        try {
          ctrl.enqueue(message)
        } catch (err) {
          console.error("SSE enqueue failed:", err)
          try { ctrl.close() } catch {}
          this.controllers.delete(ctrl)
        }
      }
    } catch (err) {
      console.error("SSE broadcast fetch failed:", err)
      const errorMsg = this.encoder.encode(`data: {"error":"fetch_failed"}\n\n`)
      for (const ctrl of this.controllers) {
        try {
          ctrl.enqueue(errorMsg)
        } catch (err2) {
          console.error("SSE error broadcast enqueue failed:", err2)
          try { ctrl.close() } catch {}
          this.controllers.delete(ctrl)
        }
      }
    }
  }
}

export const donationBroadcaster = new DonationBroadcaster()
