import { prisma } from "@/lib/prisma"
import { Newspaper, Calendar, Users } from "lucide-react"

async function getStats() {
  try {
    const [newsCount, eventCount, userCount] = await Promise.all([
      prisma.news.count({ where: { published: true } }),
      prisma.event.count(),
      prisma.user.count(),
    ])

    return { newsCount, eventCount, userCount }
  } catch {
    return null
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Berita Terbit", value: stats?.newsCount ?? 0, icon: Newspaper, color: "text-blue-500" },
    { label: "Kegiatan", value: stats?.eventCount ?? 0, icon: Calendar, color: "text-purple-500" },
    { label: "Pengguna", value: stats?.userCount ?? 0, icon: Users, color: "text-amber-500" },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
        <span className="text-gradient">Dashboard</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Ringkasan data organisasi
      </p>

      {!stats && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500 animate-scale-in">
          Database tidak terhubung. Tampilkan data placeholder.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg glass-panel glass-panel-hover animate-scale-in"
            style={{ animationDelay: `${i * 0.1}s` }}
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
