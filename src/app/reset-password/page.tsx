"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setStatus("error")
      setMessage("Password tidak cocok")
      return
    }
    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!data.success) {
        setStatus("error")
        setMessage(data.error || "Terjadi kesalahan")
      } else {
        setStatus("success")
        setMessage("Password berhasil direset!")
        setTimeout(() => router.push("/login"), 2000)
      }
    } catch {
      setStatus("error")
      setMessage("Gagal menghubungi server")
    }
  }

  if (!token) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
        Token reset tidak valid
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password Baru</label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Minimal 6 karakter"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">Konfirmasi Password</label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Ulangi password"
        />
      </div>

      {status === "error" && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">{message}</div>
      )}
      {status === "success" && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-500">{message}</div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "Mereset..." : "Reset Password"}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-xl border border-border bg-card">
        <h1 className="font-heading text-2xl font-bold tracking-tight mb-2">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-6">Masukkan password baru Anda.</p>
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
