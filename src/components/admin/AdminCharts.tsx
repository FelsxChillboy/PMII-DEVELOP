"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false })

interface ChartData {
  name: string
  value: number
}

interface AdminChartsProps {
  data: ChartData[]
  totalDonations: number
}

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export default function AdminCharts({ data, totalDonations }: AdminChartsProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Belum ada data donasi</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h3 className="font-heading font-semibold text-foreground mb-1">
        Donasi Bulanan
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Total: {formatIDR(totalDonations)}
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `Rp${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.625rem",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value) => formatIDR(Number(value) || 0)}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
