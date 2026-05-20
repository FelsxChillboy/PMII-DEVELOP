import { prisma } from "@/lib/prisma"
import { Mail, CheckCircle2, XCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toggleMessageRead, deleteMessage } from "@/lib/admin-actions"

const PER_PAGE = 20

async function getMessages(page: number) {
  try {
    const [messages, total] = await Promise.all([
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
      }),
      prisma.contact.count(),
    ])
    return { messages, total }
  } catch (err) {
    console.error("Get messages failed:", err)
    return { messages: [], total: 0 }
  }
}

export default async function AdminKontakPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const sp = await props.searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const { messages, total } = await getMessages(page)
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          <span className="text-primary">Pesan</span> Masuk
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola pesan dari pengunjung halaman kontak.
        </p>
      </div>

      <div className="text-xs text-muted-foreground">
        {total} pesan &middot; Halaman {page} dari {totalPages}
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Belum ada pesan masuk.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition-colors ${
                msg.read ? "border-border bg-card/50" : "border-primary/30 bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {msg.name}
                    </h3>
                    {!msg.read && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                        Baru
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {msg.email} &middot;{" "}
                    {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {msg.subject}
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                    {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={toggleMessageRead.bind(null, msg.id)}>
                    <button
                      type="submit"
                      title={msg.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                        msg.read
                          ? "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          : "text-primary bg-primary/10 hover:bg-primary/20"
                      }`}
                    >
                      {msg.read ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  </form>
                  <form action={deleteMessage.bind(null, msg.id)}>
                    <button
                      type="submit"
                      title="Hapus pesan"
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={`/admin/kontak?page=${page - 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/kontak?page=${p}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/kontak?page=${page + 1}`}
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
