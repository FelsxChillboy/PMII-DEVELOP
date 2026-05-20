"use client"

import { useEffect, useRef } from "react"
import { useUIStore } from "@/store/ui"

export function useDonationStream() {
  const setDonationTotal = useUIStore((s) => s.setDonationTotal)
  const esRef = useRef<EventSource | null>(null)
  const attemptsRef = useRef(0)

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>

    function connect() {
      esRef.current?.close()
      const es = new EventSource("/api/donations/stream")
      esRef.current = es

      es.onmessage = (event) => {
        attemptsRef.current = 0
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
        const delay = Math.min(1000 * Math.pow(2, attemptsRef.current), 30000) + Math.random() * 1000
        attemptsRef.current++
        reconnectTimeout = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimeout)
      esRef.current?.close()
    }
  }, [setDonationTotal])
}
