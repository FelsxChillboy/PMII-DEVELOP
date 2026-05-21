"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Award } from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import AnimatedCounter from "@/components/AnimatedCounter"
import { Spotlight } from "@/components/Spotlight"
import { FlipWords } from "@/components/FlipWords"
import { duration, easing } from "@/lib/animation"

const BackgroundMorph = dynamic(() => import("@/components/BackgroundMorph"), {
  ssr: false,
})

const STATS = [
  { icon: Users, value: 50, suffix: "+", label: "Kader Aktif" },
  { icon: Calendar, value: 20, suffix: "+", label: "Kegiatan/Tahun" },
  { icon: Award, value: 5, suffix: "+", label: "Tahun Berdiri" },
]

export default function HeroSection() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const titleWords = ["PR PMII", "Rayon Teknik", "UNUSIA Jakarta Pusat"]

  if (reducedMotion) {
    return (
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-background"
      >
        <div className="absolute inset-0 section-grid opacity-[0.06]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary font-medium mb-6">
              <span className="h-px w-8 bg-primary" />
              PERGERAKAN MAHASISWA ISLAM INDONESIA
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              PR PMII Rayon Teknik UNUSIA Jakarta Pusat
              <br />
              <span className="text-gradient">Membangun Peradaban Digital</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Membangun kader intelektual organik yang berintegritas melalui
              persilangan nilai pergerakan dan presisi teknik di era digital.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/tentang"
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Bergabung Sekarang
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/kegiatan"
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-border text-foreground font-medium text-sm hover:bg-secondary transition-all"
              >
                Lihat Kegiatan
              </Link>
            </div>
          </div>

          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 section-grid opacity-[0.06]" />
      <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-accent/5 blur-[100px]" />

      <Spotlight className="z-2" fill="hsl(var(--primary))" size={600} />
      <BackgroundMorph />

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background z-1" />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.1, ease: easing.standard }}
          >
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary font-medium mb-6 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              PERGERAKAN MAHASISWA ISLAM INDONESIA
            </div>
          </motion.div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
            <motion.span
              className="inline-flex flex-wrap"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
              }}
            >
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block overflow-hidden mr-[0.25em]"
                  variants={{
                    hidden: { y: 80, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: duration.slow, ease: easing.standard },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
            <br className="hidden sm:block" />
            <span className="text-gradient relative inline-block">
              <FlipWords words={["Membangun Peradaban Digital", "Menata Masa Depan Teknik", "Menggerakkan Intelektualitas"]} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.8, ease: easing.standard }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            Membangun kader intelektual organik yang berintegritas melalui
            persilangan nilai pergerakan dan presisi teknik di era digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 1, ease: easing.standard }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="/tentang"
              className="group relative inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Bergabung Sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/kegiatan"
              className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-border text-foreground font-medium text-sm hover:bg-secondary transition-all active:scale-[0.97]"
            >
              Lihat Kegiatan
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: duration.slow, ease: easing.standard }}
            className="mt-16 sm:mt-20 flex flex-wrap gap-8 sm:gap-14"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                className="group"
                whileHover={{ y: -4 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <stat.icon className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
