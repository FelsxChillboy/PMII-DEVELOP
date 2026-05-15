"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react"

interface Transaction {
  id: string
  title: string
  type: "pemasukan" | "pengeluaran"
  amount: number
  category: string
  date: string
}

const DEMO_TRANSACTIONS: Transaction[] = []

const CHART_DATA = [
  { name: "Kaderisasi", value: 0, color: "hsl(199, 89%, 60%)" },
  { name: "Kegiatan", value: 0, color: "hsl(45, 97%, 47%)" },
  { name: "Operasional", value: 0, color: "hsl(210, 40%, 98%)" },
  { name: "Sosial", value: 0, color: "hsl(215, 20%, 65%)" },
  { name: "Lainnya", value: 0, color: "hsl(222, 70%, 30%)" },
]

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export default function TransparansiPage() {
  const income = DEMO_TRANSACTIONS.filter((t) => t.type === "pemasukan").reduce(
    (s, t) => s + t.amount,
    0
  )
  const expense = DEMO_TRANSACTIONS.filter(
    (t) => t.type === "pengeluaran"
  ).reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const cards = [
    {
      icon: ArrowUpCircle,
      label: "Total Pemasukan",
      value: formatIDR(income),
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: ArrowDownCircle,
      label: "Total Pengeluaran",
      value: formatIDR(expense),
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      icon: Wallet,
      label: "Saldo",
      value: formatIDR(balance),
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
  ]

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">AKUNTABILITAS PUBLIK</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Dashboard <span className="text-primary">Transparansi</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Laporan keuangan terbuka untuk menjaga kepercayaan seluruh kader
              dan masyarakat.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.label}
                  className="p-6 rounded-xl border border-border bg-card"
                >
                  <div
                    className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {card.label}
                  </p>
                  <p className={`font-heading text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Distribusi per Kategori
              </h3>
              <div className="h-64">
                {CHART_DATA.every((d) => d.value === 0) ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Belum ada data keuangan
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CHART_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {CHART_DATA.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.625rem",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="space-y-2 mt-4">
                {CHART_DATA.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: entry.color }}
                      />
                      <span className="text-muted-foreground">
                        {entry.name}
                      </span>
                    </span>
                    <span className="text-foreground font-medium">
                      {formatIDR(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Transaksi Terbaru
              </h3>
              {DEMO_TRANSACTIONS.length === 0 ? (
                <div className="text-center py-16 border border-border rounded-xl bg-card">
                  <p className="text-muted-foreground text-sm">
                    Belum ada transaksi
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                          Tipe
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                          Judul
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">
                          Tanggal
                        </th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">
                          Kategori
                        </th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_TRANSACTIONS.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b border-border hover:bg-secondary/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium ${
                                t.type === "pemasukan"
                                  ? "text-primary"
                                  : "text-destructive"
                              }`}
                            >
                              {t.type === "pemasukan" ? "↑" : "↓"}
                              {t.type === "pemasukan"
                                ? "Pemasukan"
                                : "Pengeluaran"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground">
                            {t.title}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                            {t.date}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                            {t.category}
                          </td>
                          <td className="py-3 px-4 text-right text-foreground font-medium">
                            {formatIDR(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
