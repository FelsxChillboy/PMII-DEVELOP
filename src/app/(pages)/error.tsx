"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="font-heading text-2xl font-bold text-foreground">
        Terjadi Kesalahan
      </h2>
      <p className="text-muted-foreground max-w-md">
        Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
      </p>
      <button
        onClick={reset}
        className="inline-flex h-10 px-6 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )
}
