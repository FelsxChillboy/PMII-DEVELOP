"use client"

import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!data.success) {
        setStatus("error")
        setMessage(data.error || "Terjadi kesalahan")
      } else {
        setStatus("success")
        setMessage(data.message)
      }
    } catch {
      setStatus("error")
      setMessage("Gagal menghubungi server")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-xl border border-border bg-card">
        <h1 className="font-heading text-2xl font-bold tracking-tight mb-2">Lupa Password</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Masukkan email Anda. Kami akan kirim link reset password.
        </p>

        {status === "success" ? (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-500">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="email@example.com"
              />
            </div>

            {status === "error" && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {status === "loading" ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
