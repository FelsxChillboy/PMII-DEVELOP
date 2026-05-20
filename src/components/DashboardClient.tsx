"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Newspaper,
  Calendar,
  DollarSign,
  Mail,
  User,
  LogOut,
  ArrowRight,
} from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 20 },
  },
}

const QUICK_LINKS = [
  {
    href: "/berita",
    icon: Newspaper,
    label: "Berita",
    desc: "Baca berita terbaru",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    href: "/kegiatan",
    icon: Calendar,
    label: "Kegiatan",
    desc: "Lihat jadwal & daftar",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    href: "/donasi",
    icon: DollarSign,
    label: "Donasi",
    desc: "Berikan donasi",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    href: "/kontak",
    icon: Mail,
    label: "Kontak",
    desc: "Hubungi kami",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
]

interface DashboardClientProps {
  name?: string | null
  email?: string | null
  role?: string
  image?: string | null
}

export default function DashboardClient({
  name,
  email,
  role,
  image,
}: DashboardClientProps) {
  const reducedMotion = useReducedMotion()
  const variants = reducedMotion ? undefined : containerVariants
  const iv = reducedMotion ? undefined : itemVariants
  const roleLabel = role === "MEMBER" ? "Member" : "Anggota"

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div variants={iv} className="flex items-center gap-5 mb-10">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 p-[2px]">
            <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <User className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight truncate">
            {name || "Anggota"}
          </h1>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
          <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {roleLabel}
          </span>
        </div>
      </motion.div>

      <motion.div variants={iv} className="mb-3">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          Menu Cepat
        </h2>
      </motion.div>
      <motion.div
        variants={iv}
        className="grid sm:grid-cols-2 gap-3 mb-12"
      >
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300 overflow-hidden"
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${link.bg}`}
            />
            <div className="relative z-10 flex items-start gap-4">
              <div
                className={`h-10 w-10 rounded-lg ${link.bg} flex items-center justify-center shrink-0`}
              >
                <link.icon className={`h-5 w-5 ${link.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {link.desc}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </motion.div>

      <motion.div
        variants={iv}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="p-5 sm:p-6">
          <h2 className="font-heading text-lg font-bold tracking-tight mb-1">
            Selamat Datang di Dashboard Anggota
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dashboard ini adalah pusat informasi keanggotaan PR PMII Rayon
            Teknik UNUSIA Jakarta Pusat. Anda dapat mengakses berita
            terbaru, melihat jadwal kegiatan, melakukan donasi, dan
            menghubungi pengurus organisasi.
          </p>
        </div>
        <div className="border-t border-border px-5 sm:px-6 py-3 bg-secondary/30">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <span>
              Role:{" "}
              <span className="text-foreground font-medium">
                {roleLabel}
              </span>
            </span>
            <span>
              Status:{" "}
              <span className="text-green-500 font-medium">Aktif</span>
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
