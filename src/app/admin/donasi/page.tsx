import { prisma } from "@/lib/prisma"
import { DollarSign, TrendingUp } from "lucide-react"

async function getDonations() {
  try {
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: { select: { name: true } } },
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { status: "SUCCESS" },
      }),
    ])
    return { donations, total: total._sum.amount || 0, count: total._count }
  } catch {
    return null
  }
}

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: "bg-green-500/10 text-green-500",
  PENDING: "bg-yellow-500/10 text-yellow-500",
  FAILED: "bg-red-500/10 text-red-500",
}

export default async function AdminDonasi() {
  const data = await getDonations()

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
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        STATUS_COLORS[d.status] || "bg-gray-500/10 text-gray-500"
                      }`}
                    >
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
    </div>
  )
}
