import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { approveRegistration, rejectRegistration, deleteRegistration } from "@/lib/admin-actions"
import { ArrowLeft, Check, X, Trash2, User } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  APPROVED: "bg-green-500/10 text-green-500",
  REJECTED: "bg-red-500/10 text-red-500",
}

export default async function EventRegistrationsPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/admin")

  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) notFound()

  const registrations = await prisma.registration.findMany({
    where: { eventId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/kegiatan"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Pendaftar Kegiatan
          </h1>
          <p className="text-sm text-muted-foreground">{event.title}</p>
        </div>
      </div>

      <div className="mb-4 text-xs text-muted-foreground">
        Total {registrations.length} pendaftar &middot; Kapasitas {event.capacity}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Pendaftar</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Tanggal Daftar</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada pendaftar.</p>
                  </td>
                </tr>
              )}
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-medium">{reg.user.name || "Tanpa Nama"}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {reg.user.email || "-"}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[reg.status] || ""}`}>
                      {reg.status === "PENDING" ? "Menunggu" : reg.status === "APPROVED" ? "Diterima" : "Ditolak"}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">
                    {reg.createdAt.toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {reg.status === "PENDING" && (
                        <>
                          <form action={approveRegistration}>
                            <input type="hidden" name="id" value={reg.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                              title="Terima"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </form>
                          <form action={rejectRegistration}>
                            <input type="hidden" name="id" value={reg.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              title="Tolak"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </form>
                        </>
                      )}
                      <form action={deleteRegistration}>
                        <input type="hidden" name="id" value={reg.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </form>
                    </div>
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
