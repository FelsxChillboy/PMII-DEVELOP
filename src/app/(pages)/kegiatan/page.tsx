import { prisma } from "@/lib/prisma"
import SectionTag from "@/components/SectionTag"
import AnimatedSection, { StaggerItem } from "@/components/AnimatedSection"
import Card3D from "@/components/Card3D"
import { MapPin, Clock, Users, Calendar } from "lucide-react"

function getStatus(date: Date, capacity: number, registrations: number) {
  const now = new Date()
  if (date < now) return { label: "Selesai", className: "bg-muted text-muted-foreground" }
  if (registrations >= capacity) return { label: "Penuh", className: "bg-destructive/10 text-destructive" }
  return { label: "Terbuka", className: "bg-primary/10 text-primary" }
}

const formatDate = (d: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export default async function KegiatanPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { registrations: true } } },
  })

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">KALENDER KEGIATAN</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Agenda <span className="text-primary">Kegiatan</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              RTL, Makrab, Diskusi, dan berbagai kegiatan kaderisasi lainnya.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="staggerContainer" className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base">
                Belum ada kegiatan yang dijadwalkan.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const statusInfo = getStatus(event.date, event.capacity, event._count.registrations)
                const day = event.date.getDate()
                const month = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(event.date)

                return (
                  <StaggerItem key={event.id}>
                    <Card3D className="p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            {month}
                          </p>
                          <p className="font-heading text-2xl font-bold text-foreground">
                            {day}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <h3 className="font-heading font-semibold text-foreground mb-3">
                        {event.title}
                      </h3>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {event._count.registrations}/{event.capacity} Pendaftar
                          </span>
                        </div>
                      </div>
                    </Card3D>
                  </StaggerItem>
                )
              })}
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
