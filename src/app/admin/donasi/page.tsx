import { prisma } from "@/lib/prisma"
import { DollarSign, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const PER_PAGE = 20

async function getDonations(page: number) {
  try {
    const [donations, total, count] = await Promise.all([
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        include: { user: { select: { name: true } } },
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { status: "SUCCESS" },
      }),
      prisma.donation.count(),
    ])
    return { donations, total: total._sum.amount || 0, count: total._count, totalCount: total._count }
  } catch {
    return null
  }
}

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: "bg-green-500/10 text-green-500",
  PENDING: "bg-yellow-500/10 text-yellow-500",
  FAILED: "bg-red-500/10 text-red-500",
}

export default async function AdminDonasi(props: { searchParams?: Promise<{ page?: string }> }) {
  const sp = await props.searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const data = await getDonations(page)
  const totalPages = data ? Math.ceil(data.totalCount / PER_PAGE) : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
          Donasi
        </h1>
        <p className="text-sm text-muted-foreground">
          Riwayat dan statistik donasi
        </p>
      </div>

      {!data && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500 mb-6">
          Database tidak terhubung.
        </div>
      )}

      {data && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-border bg-card">
            <DollarSign className="h-5 w-5 text-green-500 mb-3" />
            <p className="text-2xl font-bold tracking-tight">
              Rp{(data.total / 1000).toFixed(0)}rb
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Terkumpul</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <TrendingUp className="h-5 w-5 text-blue-500 mb-3" />
            <p className="text-2xl font-bold tracking-tight">{data.count}</p>
            <p className="text-xs text-muted-foreground mt-1">Donasi Sukses</p>
          </div>
        </div>
      )}

      {data && (
        <div className="mb-4 text-xs text-muted-foreground">
          Total {data.totalCount} donasi &middot; Halaman {page} dari {totalPages}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Donatur</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Jumlah</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Tipe</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Belum ada donasi.
                  </td>
                </tr>
              )}
              {data?.donations.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4">{d.user?.name || "Anonim"}</td>
                  <td className="p-4 font-medium">
                    Rp{d.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[d.status] || "bg-gray-500/10 text-gray-500"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">
                    {d.type === "RECURRING" ? "Bulanan" : "Sekali"}
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {d.createdAt.toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={`/admin/donasi?page=${page - 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/donasi?page=${p}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/donasi?page=${page + 1}`}
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
