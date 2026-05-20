import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import Link from "next/link"
import { deleteFinancialReport } from "@/lib/admin-actions"
import { Plus, ExternalLink, Trash2, ChevronLeft, ChevronRight, Wallet, TrendingUp, TrendingDown } from "lucide-react"

const PER_PAGE = 20

async function getReports(page: number) {
  try {
    const [reports, total] = await Promise.all([
      prisma.financialReport.findMany({
        orderBy: { date: "desc" },
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
      }),
      prisma.financialReport.count(),
    ])
    const data = reports.map((r) => ({
      ...r,
      dateStr: r.date.toISOString().split("T")[0],
    }))
    return { reports: data, total }
  } catch {
    return null
  }
}

async function getSummary() {
  try {
    const [income, expense] = await Promise.all([
      prisma.financialReport.aggregate({
        _sum: { amount: true },
        where: { type: "INCOME" },
      }),
      prisma.financialReport.aggregate({
        _sum: { amount: true },
        where: { type: "EXPENSE" },
      }),
    ])
    return {
      income: income._sum.amount || 0,
      expense: expense._sum.amount || 0,
    }
  } catch {
    return null
  }
}

export default async function AdminKeuangan(props: { searchParams?: Promise<{ page?: string }> }) {
  const { session, error: authErr } = await requireAdmin()
  if (authErr || !session) return null
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"

  const sp = await props.searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const data = await getReports(page)
  const summary = await getSummary()
  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0
  const saldo = summary ? summary.income - summary.expense : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Laporan Keuangan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola pemasukan dan pengeluaran
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin/keuangan/buat"
            className="inline-flex h-9 px-4 items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tambah Laporan
          </Link>
        )}
      </div>

      {!data && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500 mb-6">
          Database tidak terhubung.
        </div>
      )}

      {summary && (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-border bg-card">
            <TrendingUp className="h-5 w-5 text-green-500 mb-3" />
            <p className="text-2xl font-bold tracking-tight text-green-500">
              Rp{(summary.income / 1000).toFixed(0)}rb
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Pemasukan</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <TrendingDown className="h-5 w-5 text-red-500 mb-3" />
            <p className="text-2xl font-bold tracking-tight text-red-500">
              Rp{(summary.expense / 1000).toFixed(0)}rb
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Pengeluaran</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <Wallet className="h-5 w-5 text-blue-500 mb-3" />
            <p className="text-2xl font-bold tracking-tight text-blue-500">
              Rp{(saldo / 1000).toFixed(0)}rb
            </p>
            <p className="text-xs text-muted-foreground mt-1">Saldo Akhir</p>
          </div>
        </div>
      )}

      {data && (
        <div className="mb-4 text-xs text-muted-foreground">
          {data.total} laporan &middot; Halaman {page} dari {totalPages}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Judul</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Tipe</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Jumlah</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Kategori</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Tanggal</th>
                {isAdmin && <th className="text-right p-4 font-medium text-muted-foreground">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.reports.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-muted-foreground">
                    Belum ada laporan keuangan.
                  </td>
                </tr>
              )}
              {data?.reports.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-medium">{r.title}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${r.type === "INCOME" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      {r.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                    </span>
                  </td>
                  <td className={`p-4 font-medium ${r.type === "INCOME" ? "text-green-500" : "text-red-500"}`}>
                    Rp{r.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{r.category}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{r.dateStr}</td>
                  {isAdmin && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/keuangan/${r.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-primary hover:bg-primary/10 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <form action={deleteFinancialReport}>
                          <input type="hidden" name="id" value={r.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </form>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={`/admin/keuangan?page=${page - 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/keuangan?page=${p}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/keuangan?page=${page + 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
