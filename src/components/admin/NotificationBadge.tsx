"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function NotificationBadge() {
  const [pendingDonations, setPendingDonations] = useState(0)
  const [unreadContacts, setUnreadContacts] = useState(0)

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch("/api/admin/notifications/counts")
        if (!res.ok) return
        const data = await res.json()
        setPendingDonations(data.pendingDonations)
        setUnreadContacts(data.unreadContacts)
      } catch {}
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 30_000)
    return () => clearInterval(interval)
  }, [])

  const total = pendingDonations + unreadContacts

  if (total === 0) return null

  return (
    <span className="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
      {total > 99 ? "99+" : total}
    </span>
  )
}
