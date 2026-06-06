import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import Link from "next/link"
import { deleteEvent } from "@/lib/admin-actions"
import { Plus, ExternalLink, Calendar, Trash2, ChevronLeft, ChevronRight, Users } from "lucide-react"

const PER_PAGE = 20

async function getEvents(page: number) {
  try {
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        orderBy: { date: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          date: true,
          location: true,
          capacity: true,
          status: true,
          _count: { select: { registrations: true } },
        },
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
      }),
      prisma.event.count(),
    ])
    return { events, total }
  } catch {
    return null
  }
}

export default async function AdminKegiatan(props: { searchParams?: Promise<{ page?: string }> }) {
  const sp = await props.searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const data = await getEvents(page)
  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Kegiatan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola kegiatan dan acara
          </p>
        </div>
        <Link
          href="/admin/kegiatan/buat"
          className="inline-flex h-9 px-4 items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Buat Kegiatan
        </Link>
      </div>

      {!data && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500 mb-6">
          Database tidak terhubung.
        </div>
      )}

      {data && (
        <div className="mb-4 text-xs text-muted-foreground">
          {data.total} kegiatan &middot; Halaman {page} dari {totalPages}
        </div>
      )}

      <div className="grid gap-4">
        {data?.events.length === 0 && (
          <div className="p-8 text-center text-muted-foreground rounded-xl border border-border">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada kegiatan.</p>
          </div>
        )}
        {data?.events.map((event) => (
          <div
            key={event.id}
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-heading font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {event.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>{new Date(event.date).toLocaleDateString("id-ID")}</span>
                  <span>{event.location}</span>
                  <span>
                    {event._count.registrations} / {event.capacity} peserta
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Link
                  href={`/admin/kegiatan/${event.id}/registrations`}
                  className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                >
                  <Users className="h-3 w-3" />
                  Pendaftar
                </Link>
                <Link
                  href={`/admin/kegiatan/${event.id}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                >
                  Edit <ExternalLink className="h-3 w-3" />
                </Link>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-xs transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={`/admin/kegiatan?page=${page - 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/kegiatan?page=${p}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/kegiatan?page=${page + 1}`}
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
