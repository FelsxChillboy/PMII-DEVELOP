"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, X } from "lucide-react"

interface Props {
  eventId: string
  eventTitle: string
  capacity: number
  registrations: number
  isLoggedIn: boolean
  isRegistered: boolean
  registrationStatus?: string | null
}

export default function RegisterEventButton({
  eventId,
  eventTitle,
  capacity,
  registrations,
  isLoggedIn,
  isRegistered,
  registrationStatus,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const isFull = registrations >= capacity

  async function handleRegister() {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "POST" })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: "success", text: "Berhasil mendaftar!" })
        router.refresh()
      } else {
        setMessage({ type: "error", text: data.error || "Gagal mendaftar" })
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" })
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "DELETE" })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: "success", text: "Pendaftaran dibatalkan" })
        router.refresh()
      } else {
        setMessage({ type: "error", text: data.error || "Gagal membatalkan" })
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" })
    } finally {
      setLoading(false)
    }
  }

  if (message) {
    return (
      <div className={`flex items-center gap-1.5 text-xs font-medium ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
        {message.type === "success" ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
        {message.text}
      </div>
    )
  }

  if (isRegistered) {
    const statusLabel = registrationStatus === "APPROVED" ? "Diterima" : registrationStatus === "REJECTED" ? "Ditolak" : "Menunggu"
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Terdaftar ({statusLabel})
        </span>
        {registrationStatus === "PENDING" && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="text-xs text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Batalkan"}
          </button>
        )}
      </div>
    )
  }

  if (isFull) {
    return <span className="text-xs text-muted-foreground">Penuh</span>
  }

  return (
    <button
      onClick={handleRegister}
      disabled={loading}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
      {loading ? "Mendaftar..." : "Daftar"}
    </button>
  )
}
