"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <motion.p
          initial={{ opacity: 0, y: -40, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 150, damping: 15 }}
          className="font-heading text-8xl font-bold text-primary"
        >
          404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-heading text-2xl font-bold text-foreground mt-4 mb-2"
        >
          Halaman Tidak Ditemukan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-muted-foreground text-sm mb-8"
        >
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring" as const, stiffness: 200, damping: 20 }}
        >
          <Link
            href="/"
            className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
