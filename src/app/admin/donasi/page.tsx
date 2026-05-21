import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import { revalidatePath } from "next/cache"
import { notifyDonationUpdate } from "@/lib/sse-broadcaster"
import { Download, ChevronLeft, ChevronRight, Wallet, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { DonationStatus } from "@prisma/client"

const PER_PAGE = 20

interface Props {
  searchParams?: Promise<{ page?: string; status?: string }>
}

async function updateStatus(formData: FormData) {
  "use server"
  const { error: authErr } = await requireAdmin()
  if (authErr) return

  const id = formData.get("id") as string
  const status = formData.get("status") as string
  if (!id || !status) return

  try {
    await prisma.donation.update({
      where: { id },
      data: { status: status as DonationStatus },
    })
    revalidatePath("/admin/donasi")
    notifyDonationUpdate()
  } catch (err) {
    console.error("Update donation status failed:", err)
  }
}

const STATUS_LABELS: Record<string, string> = { PENDING: "Menunggu", SUCCESS: "Berhasil", FAILED: "Gagal" }
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  SUCCESS: "bg-green-500/10 text-green-500",
  FAILED: "bg-red-500/10 text-red-500",
}

export default async function AdminDonasi({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const filterStatus = sp?.status

  const where = filterStatus && ["PENDING", "SUCCESS", "FAILED"].includes(filterStatus)
    ? { status: filterStatus as DonationStatus }
    : {}

  const [donations, total, stats] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.donation.count({ where }),
    prisma.donation.groupBy({
      by: ["status"],
      _sum: { amount: true },
      _count: true,
    }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const totalAmount = stats.reduce((sum, s) => sum + (s._sum.amount || 0), 0)
  const successAmount = stats.find((s) => s.status === "SUCCESS")?._sum.amount || 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Donasi</h1>
          <p className="text-sm text-muted-foreground">Kelola donasi masuk</p>
        </div>
        <a
          href="/api/admin/donations/export"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </a>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-border bg-card">
          <Wallet className="h-5 w-5 text-primary mb-3" />
          <p className="text-2xl font-bold tracking-tight">Rp{(totalAmount / 1000).toFixed(0)}rb</p>
          <p className="text-xs text-muted-foreground mt-1">Total Semua Donasi</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <TrendingUp className="h-5 w-5 text-green-500 mb-3" />
          <p className="text-2xl font-bold tracking-tight text-green-500">Rp{(successAmount / 1000).toFixed(0)}rb</p>
          <p className="text-xs text-muted-foreground mt-1">Donasi Berhasil</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <p className="text-2xl font-bold tracking-tight mb-1">{stats.find((s) => s.status === "PENDING")?._count || 0}</p>
          <p className="text-xs text-muted-foreground">Menunggu Pembayaran</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {["", "PENDING", "SUCCESS", "FAILED"].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/donasi?status=${s}` : "/admin/donasi"}
            className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              (filterStatus || "") === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {s ? STATUS_LABELS[s] || s : "Semua"}
          </Link>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mb-4">{total} donasi</div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Donatur</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Jumlah</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Tanggal</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Belum ada donasi.</td>
                </tr>
              )}
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{d.donorName || d.user?.name || "Anonim"}</p>
                    <p className="text-xs text-muted-foreground">{d.donorEmail || d.user?.email || ""}</p>
                  </td>
                  <td className="p-4 font-medium">Rp{d.amount.toLocaleString("id-ID")}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[d.status] || ""}`}>
                      {STATUS_LABELS[d.status] || d.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {d.createdAt.toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 text-right">
                    {d.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-1">
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={d.id} />
                          <input type="hidden" name="status" value="SUCCESS" />
                          <button className="inline-flex px-2 py-1 rounded text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
                            Konfirmasi
                          </button>
                        </form>
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={d.id} />
                          <input type="hidden" name="status" value="FAILED" />
                          <button className="inline-flex px-2 py-1 rounded text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                            Tolak
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={`/admin/donasi?page=${page - 1}${filterStatus ? `&status=${filterStatus}` : ""}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/donasi?page=${p}${filterStatus ? `&status=${filterStatus}` : ""}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/donasi?page=${page + 1}${filterStatus ? `&status=${filterStatus}` : ""}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
