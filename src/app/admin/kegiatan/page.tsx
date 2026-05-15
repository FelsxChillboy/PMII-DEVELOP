import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, ExternalLink, Calendar } from "lucide-react"

async function getEvents() {
  try {
    return await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: { _count: { select: { registrations: true } } },
    })
  } catch {
    return null
  }
}

export default async function AdminKegiatan() {
  const events = await getEvents()

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

      {!events && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500 mb-6">
          Database tidak terhubung.
        </div>
      )}

      <div className="grid gap-4">
        {events?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground rounded-xl border border-border">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada kegiatan.</p>
          </div>
        )}
        {events?.map((event) => (
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
              <Link
                href={`/admin/kegiatan/${event.id}`}
                className="shrink-0 inline-flex items-center gap-1 text-primary hover:underline text-xs"
              >
                Edit <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
