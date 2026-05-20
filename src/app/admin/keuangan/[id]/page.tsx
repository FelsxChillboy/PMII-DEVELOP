import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

async function update(formData: FormData) {
  "use server"
  const { session, error: authErr } = await requireAdmin()
  if (authErr || !session) return

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const amount = parseInt(formData.get("amount") as string) || 0
  const category = formData.get("category") as string
  const date = formData.get("date") as string

  if (!title || !type || !amount || !category || !date) return

  try {
    await prisma.financialReport.update({
      where: { id },
      data: { title, type: type as "INCOME" | "EXPENSE", amount, category, date: new Date(date) },
    })
  } catch (err) {
    console.error("Update financial report failed:", err)
    return
  }

  revalidatePath("/admin/keuangan")
  redirect("/admin/keuangan")
}

export default async function EditLaporanPage({ params }: Props) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr || !session) redirect("/admin/keuangan")

  const { id } = await params
  const report = await prisma.financialReport.findUnique({ where: { id } })
  if (!report) notFound()

  const dateStr = report.date.toISOString().split("T")[0]

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
            Edit Laporan Keuangan
          </h1>
          <p className="text-sm text-muted-foreground">{report.title}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form action={update} className="space-y-6">
          <input type="hidden" name="id" value={report.id} />
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Judul Laporan
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={report.title}
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
                defaultValue={report.type}
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
                defaultValue={report.category}
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
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
                defaultValue={report.amount}
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
                defaultValue={dateStr}
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan Perubahan
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
