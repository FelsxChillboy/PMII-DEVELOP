import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import SectionTag from "@/components/SectionTag"
import AnimatedSection, { StaggerItem } from "@/components/AnimatedSection"
import Card3D from "@/components/Card3D"
import RegisterEventButton from "@/components/RegisterEventButton"
import { MapPin, Clock, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const PER_PAGE = 9

export const revalidate = 60

interface Props {
  searchParams?: Promise<{ page?: string }>
}

function getStatus(date: Date, capacity: number, registrations: number) {
  const now = new Date()
  if (date < now) return { label: "Selesai", variant: "secondary" as const }
  if (registrations >= capacity) return { label: "Penuh", variant: "destructive" as const }
  return { label: "Terbuka", variant: "default" as const }
}

const formatDate = (d: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export default async function KegiatanPage({ searchParams }: Props) {
  const session = await auth()
  const userId = session?.user?.id
  const sp = await searchParams
  const page = Math.max(1, Number(sp?.page) || 1)

  const [events, total, userRegistrations] = await Promise.all([
    prisma.event.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        capacity: true,
        _count: { select: { registrations: true } },
      },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.event.count(),
    userId
      ? prisma.registration.findMany({
          where: { userId },
          select: { eventId: true, status: true },
        }).then((regs) => {
          const map = new Map<string, { status: string }>()
          for (const r of regs) map.set(r.eventId, { status: r.status })
          return map
        })
      : Promise.resolve(new Map<string, { status: string }>()),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 section-grid-light opacity-[0.05]" />
        <div className="absolute -top-40 -right-40 h-100 w-100 rounded-full bg-accent/3 blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">KALENDER KEGIATAN</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Agenda <span className="text-gradient">Kegiatan</span>
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
            <div className="text-center py-20 animate-scale-in">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Clock className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base">
                Belum ada kegiatan yang dijadwalkan.
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                Nantikan jadwal kegiatan terbaru
              </p>
            </div>
          ) : (
            <>
              {totalPages > 1 && (
                <div className="mb-6 text-xs text-muted-foreground">
                  {total} kegiatan &middot; Halaman {page} dari {totalPages}
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const statusInfo = getStatus(event.date, event.capacity, event._count.registrations)
                  const day = event.date.getDate()
                  const month = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(event.date)
                  const userReg = userRegistrations.get(event.id)

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
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
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

                        <div className="mt-4 pt-4 border-t border-border/50">
                          <RegisterEventButton
                            eventId={event.id}
                            eventTitle={event.title}
                            capacity={event.capacity}
                            registrations={event._count.registrations}
                            isLoggedIn={!!userId}
                            isRegistered={!!userReg}
                            registrationStatus={userReg?.status || null}
                          />
                        </div>
                      </Card3D>
                    </StaggerItem>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-12">
                  <Link
                    href={`/kegiatan?page=${page - 1}`}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-all ${page <= 1 ? "pointer-events-none opacity-30 border-border/30" : "border-border hover:bg-secondary hover:border-primary/30"}`}
                    aria-disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/kegiatan?page=${p}`}
                      className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-full text-sm font-medium transition-all ${p === page ? "bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 scale-105" : "border border-border hover:bg-secondary hover:border-primary/30"}`}
                    >
                      {p}
                    </Link>
                  ))}
                  <Link
                    href={`/kegiatan?page=${page + 1}`}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-all ${page >= totalPages ? "pointer-events-none opacity-30 border-border/30" : "border-border hover:bg-secondary hover:border-primary/30"}`}
                    aria-disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
