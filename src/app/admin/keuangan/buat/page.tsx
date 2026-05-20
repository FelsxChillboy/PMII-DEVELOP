import { redirect } from "next/navigation"
import Link from "next/link"
import { createFinancialReport } from "@/lib/admin-actions"
import { ArrowLeft } from "lucide-react"

export default async function BuatLaporanPage(props: { searchParams?: Promise<{ error?: string }> }) {
  const sp = await props.searchParams

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/keuangan"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Tambah Laporan Keuangan
          </h1>
          <p className="text-sm text-muted-foreground">Buat laporan pemasukan atau pengeluaran baru</p>
        </div>
      </div>

      {sp?.error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
          {sp.error}
        </div>
      )}

      <div className="max-w-2xl">
        <form action={createFinancialReport} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Judul Laporan
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1.5">
                Tipe
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="INCOME">Pemasukan</option>
                <option value="EXPENSE">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1.5">
                Kategori
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Pilih kategori</option>
                <option value="Kaderisasi">Kaderisasi</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Operasional">Operasional</option>
                <option value="Sosial">Sosial</option>
                <option value="Donasi">Donasi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1.5">
                Jumlah (Rp)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min={1}
                required
                placeholder="50000"
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1.5">
                Tanggal
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan Laporan
            </button>
            <Link
              href="/admin/keuangan"
              className="h-11 px-6 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
