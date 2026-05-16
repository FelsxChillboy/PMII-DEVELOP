"use client"

import { useEffect, useRef } from "react"
import { useUIStore } from "@/store/ui"

export function useDonationStream() {
  const setDonationTotal = useUIStore((s) => s.setDonationTotal)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>

    function connect() {
      esRef.current?.close()
      const es = new EventSource("/api/donations/stream")
      esRef.current = es

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.total !== undefined) {
            setDonationTotal(data.total)
          }
        } catch {
          // ignore parse errors
        }
      }

      es.onerror = () => {
        es.close()
        esRef.current = null
        reconnectTimeout = setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimeout)
      esRef.current?.close()
    }
  }, [setDonationTotal])
}
