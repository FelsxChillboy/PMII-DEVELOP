"use client"

import { useActionState, useState, useCallback } from "react"
import { motion } from "framer-motion"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import Toast from "@/components/Toast"
import { MapPin, Mail, Phone, Send, AlertCircle } from "lucide-react"
import { submitContact } from "./actions"
import { duration, easing } from "@/lib/animation"

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
    value: "+62 821-1234-5678",
    href: "tel:+6282112345678",
  },
]

export default function KontakPage() {
  const [state, formAction, pending] = useActionState(submitContact, null)
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
    show: false, type: "success", message: "",
  })

  const showSuccess = state?.success && !toast.show
  const showError = state?.error && !toast.show

  if (showSuccess) {
    setTimeout(() => setToast({ show: true, type: "success", message: "Pesan berhasil dikirim!" }), 100)
  }
  if (showError) {
    setTimeout(() => setToast({ show: true, type: "error", message: state.error || "" }), 100)
  }

  const handleCloseToast = useCallback(() => setToast(prev => ({ ...prev, show: false })), [])

  if (state?.success && !toast.show) {
    setTimeout(() => {}, 0)
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
              {CONTACT_INFO.map((info, i) => {
                const Icon = info.icon
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, ...easing.springGentle }}
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
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Nama Anda"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      required
                    />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subjek
                  </label>
                  <input
                    name="subject"
                    type="text"
                    placeholder="Subjek pesan"
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    required
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pesan
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tulis pesan Anda..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
                    required
                  />
                </motion.div>

                {state?.error && !toast.show && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {state.error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={pending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pending ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Mengirim...
                    </motion.span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Kirim Pesan
                    </>
                  )}
                </motion.button>
              </motion.form>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={handleCloseToast}
      />
    </div>
  )
}
