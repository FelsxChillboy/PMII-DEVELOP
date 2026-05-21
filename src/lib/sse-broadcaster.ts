import { prisma } from "@/lib/prisma"
import { ensureRedis, subscribe, publish } from "@/lib/redis"

type StreamController = ReadableStreamDefaultController

const MAX_CLIENTS = 50
const HEARTBEAT_INTERVAL = 15_000
const SSE_CHANNEL = "sse:donation"

class DonationBroadcaster {
  private controllers = new Set<StreamController>()
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null
  private encoder = new TextEncoder()
  private lastTotal: number | null = null
  private subscribed = false

  async init() {
    const available = await ensureRedis()
    if (available) {
      this.subscribed = await subscribe(SSE_CHANNEL, () => this.broadcast())
      if (this.subscribed) {
        console.log("SSE: Redis pub/sub active for donation updates")
      }
    }
    if (!this.subscribed) {
      console.log("SSE: Redis unavailable, falling back to polling")
    }
  }

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
    if (this.heartbeatInterval) return
    if (!this.subscribed) {
      this.broadcast()
    }
    this.heartbeatInterval = setInterval(() => this.heartbeat(), HEARTBEAT_INTERVAL)
  }

  private stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private heartbeat() {
    const msg = this.encoder.encode(": heartbeat\n\n")
    for (const ctrl of this.controllers) {
      try { ctrl.enqueue(msg) } catch {
        try { ctrl.close() } catch {}
        this.controllers.delete(ctrl)
      }
    }
  }

  private async broadcast() {
    try {
      const result = await prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
      })
      const total = result._sum.amount || 0

      if (total === this.lastTotal) return

      this.lastTotal = total
      const data = JSON.stringify({ total })
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

export async function notifyDonationUpdate() {
  if (donationBroadcaster["subscribed"]) {
    await publish(SSE_CHANNEL, "update")
  } else {
    await donationBroadcaster["broadcast"]()
  }
}
