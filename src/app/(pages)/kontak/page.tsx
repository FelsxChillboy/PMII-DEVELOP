"use client"

import { useState } from "react"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import { MapPin, Mail, Phone, CheckCircle, Send } from "lucide-react"

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Alamat",
    value: "Kampus UNUSIA, Jl. Taman Amir Hamzah No. 5, Jakarta Pusat 10430",
  },
  {
    icon: Mail,
    label: "Email",
    value: "pmii.rayonteknik@unusia.ac.id",
    href: "mailto:pmii.rayonteknik@unusia.ac.id",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "+62 812-XXXX-XXXX",
    href: "tel:+62812XXXXXXXX",
  },
]

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="divide-y divide-border">
        <AnimatedSection className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionTag className="mb-4">PESAN TERKIRIM</SectionTag>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
                Pesan <span className="text-primary">Terkirim!</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Terima kasih, pesan Anda telah kami terima. Tim kami akan
                menghubungi Anda segera.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">HUBUNGI KAMI</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Kontak &amp; <span className="text-primary">Komunikasi</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Silakan hubungi kami melalui formulir di bawah atau kontak yang
              tersedia.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            <div className="lg:col-span-2 space-y-6">
              {CONTACT_INFO.map((info) => {
                const Icon = info.icon
                return (
                  <div
                    key={info.label}
                    className="p-5 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-sm text-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-foreground">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    placeholder="Subjek pesan"
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pesan
                  </label>
                  <textarea
                    placeholder="Tulis pesan Anda..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors gap-2"
                >
                  <Send className="h-4 w-4" />
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
