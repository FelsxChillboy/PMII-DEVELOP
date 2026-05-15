"use client"

import { useEffect } from "react"
import { useUIStore } from "@/store/ui"

export function useDonationStream() {
  const setDonationTotal = useUIStore((s) => s.setDonationTotal)

  useEffect(() => {
    const eventSource = new EventSource("/api/donations/stream")

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.total !== undefined) {
          setDonationTotal(data.total)
        }
      } catch {
        // ignore parse errors
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [setDonationTotal])
}
