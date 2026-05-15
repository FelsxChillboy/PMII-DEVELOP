import { prisma } from "@/lib/prisma"
import { Newspaper, DollarSign, Calendar, Users } from "lucide-react"

async function getStats() {
  try {
    const [newsCount, donationAgg, eventCount, userCount] = await Promise.all([
      prisma.news.count({ where: { published: true } }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
      }),
      prisma.event.count(),
      prisma.user.count(),
    ])
    return {
      newsCount,
      donationTotal: donationAgg._sum.amount || 0,
      eventCount,
      userCount,
    }
  } catch {
    return null
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Berita Terbit", value: stats?.newsCount ?? 0, icon: Newspaper, color: "text-blue-500" },
    { label: "Total Donasi", value: stats?.donationTotal ? `Rp${(stats.donationTotal / 1000).toFixed(0)}rb` : "0", icon: DollarSign, color: "text-green-500" },
    { label: "Kegiatan", value: stats?.eventCount ?? 0, icon: Calendar, color: "text-purple-500" },
    { label: "Pengguna", value: stats?.userCount ?? 0, icon: Users, color: "text-amber-500" },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Ringkasan data organisasi
      </p>

      {!stats && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500">
          Database tidak terhubung. Tampilkan data placeholder.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <card.icon className={`h-5 w-5 ${card.color} mb-3`} />
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
