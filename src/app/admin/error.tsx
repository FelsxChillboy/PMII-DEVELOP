"use client"

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="font-heading text-xl font-bold text-foreground">
        Gagal Memuat Data
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Terjadi kesalahan saat memuat data. Pastikan database terhubung dan coba lagi.
      </p>
      <button
        onClick={reset}
        className="inline-flex h-9 px-4 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )
}
