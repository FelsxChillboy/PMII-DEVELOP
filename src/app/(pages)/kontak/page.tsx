"use client"

import { useActionState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import { MapPin, Mail, Phone, Send, AlertCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { submitContact } from "./actions"
import { duration, easing } from "@/lib/animation"

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Alamat",
    href : "https://maps.app.goo.gl/ccuMbSL6C9bqyQ9U6",
    value: "1, Jl. Matraman Dalam III No.RT 13, RT.10/RW.7, Pegangsaan, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10320",
    
  },
  {
    icon: Mail,
    label: "Email",
    value: "rayonteknikunusia@gmail.com",
    href: "mailto:rayonteknikunusia@gmail.com",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "+6281292675810",
    href: "https://wa.me/+6281292675810",
  },
  {
    icon: Globe,
    label: "Instagram",
    value: "rayonteknikunusia",
    href: "https://www.instagram.com/rayonteknikunusia",
  },
]

export default function KontakPage() {
  const [state, formAction, pending] = useActionState(submitContact, null)

  if (state?.success) {
    toast.success("Pesan berhasil dikirim!")
  }
  if (state?.error) {
    toast.error(state.error)
  }

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 section-grid-light opacity-[0.05]" />
        <div className="absolute -top-40 -right-40 h-100 w-100 rounded-full bg-primary/3 blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">HUBUNGI KAMI</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Kontak &amp; <span className="text-gradient">Komunikasi</span>
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
              {CONTACT_INFO.map((info, i) => {
                const Icon = info.icon
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, ...easing.springGentle }}
                  >
                    <Card className="p-5 glass-panel glass-panel-hover">
                      <CardContent className="p-0 flex items-start gap-4">
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
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            <div className="lg:col-span-3">
              <motion.form
                action={formAction}
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: duration.normal, ease: easing.standard }}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nama Lengkap
                    </label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Nama Anda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subjek
                  </label>
                  <Input
                    name="subject"
                    type="text"
                    placeholder="Subjek pesan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Pesan
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Tulis pesan Anda..."
                    rows={5}
                    required
                  />
                </div>

                {state?.error && !state.success && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {state.error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={pending}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {pending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Kirim Pesan
                    </>
                  )}
                </Button>
              </motion.form>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
