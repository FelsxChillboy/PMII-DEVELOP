import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <p className="font-heading text-8xl font-bold text-primary">404</p>
        <h1 className="font-heading text-2xl font-bold text-foreground mt-4 mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
