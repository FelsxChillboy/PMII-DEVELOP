"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import AnimatedCounter from "@/components/AnimatedCounter"

const ConfettiSuccess = dynamic(() => import("@/components/ConfettiSuccess"), { ssr: false })
import { CheckCircle, Banknote, Wallet, QrCode, HandCoins, Heart } from "lucide-react"
import { useUIStore } from "@/store/ui"
import { useDonationStream } from "@/lib/useDonationStream"
import { variants, easing } from "@/lib/animation"

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000]
const PAYMENT_METHODS = [
  { id: "transfer", label: "Transfer Bank", icon: Banknote },
  { id: "ewallet", label: "E-Wallet", icon: Wallet },
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "tunai", label: "Tunai", icon: HandCoins },
]

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

const amountBtnVariants = {
  idle: { scale: 1, borderColor: "rgb(51,65,85)" },
  selected: {
    scale: [1, 1.05, 1],
    borderColor: "rgb(56,189,248)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
}

export default function DonasiPage() {
  useDonationStream()
  const donationTotal = useUIStore((s) => s.donationTotal)

  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [method, setMethod] = useState("transfer")
  const [message, setMessage] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleQuickAmount = (val: number) => {
    setAmount(val)
    setCustomAmount("")
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    setCustomAmount(val)
    setAmount(val ? parseInt(val) : 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <ConfettiSuccess />
        <div className="divide-y divide-border">
          <AnimatedSection className="py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
                  className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-6"
                >
                  <CheckCircle className="h-8 w-8 text-accent" />
                </motion.div>
                <SectionTag className="mb-4">DUKUNGAN TERKIRIM</SectionTag>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
                  Jazakallahu <span className="text-accent">Khairan</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Terima kasih atas dukungan Anda. Donasi Anda akan digunakan
                  untuk program kaderisasi dan kegiatan sosial.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </>
    )
  }

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">DUKUNG PERGERAKAN</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Donasi &amp; <span className="text-accent">Fundraising</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Bantu kami memperkuat program kaderisasi dan kegiatan sosial
              organisasi.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easing.standard }}
            className="mt-8 inline-flex items-center gap-4 px-6 py-4 rounded-xl border border-accent/30 bg-accent/5"
          >
            <Heart className="h-6 w-6 text-accent animate-pulse" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Donasi Terkumpul
              </p>
              <p className="font-heading text-2xl font-bold text-accent">
                <AnimatedCounter value={donationTotal} currency />
              </p>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={variants.staggerContainer}
            >
              <motion.p variants={variants.staggerItem} className="block text-sm font-medium text-foreground mb-3">
                Jumlah Donasi
              </motion.p>
              <motion.div variants={variants.staggerItem} className="grid grid-cols-4 gap-3 mb-3">
                {QUICK_AMOUNTS.map((val) => (
                  <motion.button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    variants={amountBtnVariants}
                    animate={amount === val ? "selected" : "idle"}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`h-12 rounded-xl border text-sm font-semibold transition-colors ${
                      amount === val
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {val / 1000}K
                  </motion.button>
                ))}
              </motion.div>
              <motion.div variants={variants.staggerItem}>
                <input
                  type="text"
                  placeholder="Jumlah Lainnya (Rp)"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </motion.div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="block text-sm font-medium text-foreground mb-3"
              >
                Metode Pembayaran
              </motion.p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon
                  const selected = method === pm.id
                  return (
                    <motion.button
                      key={pm.id}
                      type="button"
                      onClick={() => setMethod(pm.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      animate={
                        selected
                          ? { borderColor: "rgb(56, 189, 248)", scale: 1.04 }
                          : { borderColor: "rgb(51, 65, 85)", scale: 1 }
                      }
                      transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm transition-colors ${
                        selected
                          ? "bg-primary/10 text-primary"
                          : "bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{pm.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Pesan (Opsional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan dukungan Anda..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <motion.label
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ x: 4 }}
              transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
            >
              <div
                className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                  anonymous
                    ? "bg-accent border-accent"
                    : "border-border group-hover:border-accent/50"
                }`}
                onClick={() => setAnonymous(!anonymous)}
              >
                <AnimatePresence>
                  {anonymous && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="h-3 w-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-sm text-muted-foreground">
                Donasi sebagai Anonim
              </span>
            </motion.label>

            <motion.button
              type="submit"
              disabled={amount <= 0}
              whileHover={amount > 0 ? { scale: 1.01 } : {}}
              whileTap={amount > 0 ? { scale: 0.99 } : {}}
              className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-semibold text-base hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <AnimatePresence mode="wait">
                {amount > 0 ? (
                  <motion.span
                    key="with-amount"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Kirim Donasi ({formatIDR(amount)})
                  </motion.span>
                ) : (
                  <motion.span
                    key="no-amount"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Pilih Jumlah Donasi
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </div>
      </AnimatedSection>
    </div>
  )
}
