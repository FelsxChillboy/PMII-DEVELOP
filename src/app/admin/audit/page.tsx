import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

const PER_PAGE = 30

interface Props {
  searchParams?: Promise<{ page?: string; action?: string; entity?: string }>
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Buat",
  UPDATE: "Ubah",
  DELETE: "Hapus",
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: "text-green-500 bg-green-500/10",
  UPDATE: "text-blue-500 bg-blue-500/10",
  DELETE: "text-red-500 bg-red-500/10",
}

const ENTITY_LABELS: Record<string, string> = {
  NEWS: "Berita",
  EVENT: "Kegiatan",
  FINANCIAL_REPORT: "Keuangan",
  DONATION: "Donasi",
  USER: "Pengguna",
  REGISTRATION: "Pendaftaran",
  CONTACT: "Kontak",
  MEDIA: "Media",
}

export default async function AdminAudit({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard")

  const sp = await searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const filterAction = sp?.action
  const filterEntity = sp?.entity

  const where: Record<string, unknown> = {}
  if (filterAction && ["CREATE", "UPDATE", "DELETE"].includes(filterAction)) {
    where.action = filterAction
  }
  if (filterEntity) {
    where.entity = filterEntity
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const entities = Object.keys(ENTITY_LABELS)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Audit Log</h1>
          <p className="text-sm text-muted-foreground">Riwayat perubahan data</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Link
          href="/admin/audit"
          className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!filterAction && !filterEntity ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          Semua
        </Link>
        {["CREATE", "UPDATE", "DELETE"].map((a) => (
          <Link
            key={a}
            href={`/admin/audit?action=${a}${filterEntity ? `&entity=${filterEntity}` : ""}`}
            className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterAction === a ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {ACTION_LABELS[a]}
          </Link>
        ))}
        <span className="text-muted-foreground text-xs px-1">|</span>
        {entities.map((e) => (
          <Link
            key={e}
            href={`/admin/audit?entity=${e}${filterAction ? `&action=${filterAction}` : ""}`}
            className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterEntity === e ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {ENTITY_LABELS[e]}
          </Link>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mb-4">{total} catatan</div>

      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-sm">Belum ada catatan audit.</p>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground">Aksi</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Entitas</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Pengguna</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[log.action] || ""}`}>
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {ENTITY_LABELS[log.entity] || log.entity}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground font-mono hidden sm:table-cell max-w-[120px] truncate">
                    {log.entityId}
                  </td>
                  <td className="p-3 text-xs">
                    {log.user?.name || log.user?.email || log.userId.slice(0, 8)}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">
                    {log.createdAt.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/audit?page=${p}${filterAction ? `&action=${filterAction}` : ""}${filterEntity ? `&entity=${filterEntity}` : ""}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
