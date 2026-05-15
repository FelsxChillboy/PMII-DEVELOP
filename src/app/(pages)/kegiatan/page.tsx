"use client"

import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import { MapPin, Clock, Users } from "lucide-react"

interface KegiatanItem {
  id: string
  title: string
  type: string
  status: string
  date: string
  location: string
  time: string
  registered: number
  capacity: number
}

const DEMO_KEGIATAN: KegiatanItem[] = []

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  terbuka: {
    label: "Terbuka",
    className: "bg-primary/10 text-primary",
  },
  penuh: { label: "Penuh", className: "bg-destructive/10 text-destructive" },
  berlangsung: {
    label: "Berlangsung",
    className: "bg-chart-2/10 text-chart-2",
  },
  selesai: {
    label: "Selesai",
    className: "bg-muted text-muted-foreground",
  },
  dibatalkan: {
    label: "Dibatalkan",
    className: "bg-destructive/10 text-destructive",
  },
}

export default function KegiatanPage() {
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

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {DEMO_KEGIATAN.length === 0 ? (
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
              {DEMO_KEGIATAN.map((item) => {
                const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.draft
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            month: "short",
                          })}
                        </p>
                        <p className="font-heading text-2xl font-bold text-foreground">
                          {new Date(item.date).getDate()}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="text-xs text-primary uppercase tracking-wider mb-1">
                      {item.type}
                    </p>
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {item.registered}/{item.capacity} Pendaftar
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
