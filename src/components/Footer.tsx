"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, ArrowUp } from "lucide-react"

const FOOTER_LINKS = [
  { label: "Tentang Kami", path: "/tentang" },
  { label: "Berita", path: "/berita" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Donasi", path: "/donasi" },
  { label: "Transparansi", path: "/transparansi" },
]

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-border bg-background">
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={showBackToTop ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://media.base44.com/images/public/6a0614bbe8ea40108cd58983/6842b6f37_Logo_RayonTeknik2022.svg"
                alt="Logo PR PMII Rayon Teknik"
                width={40}
                height={40}
                className="h-10 w-10 brightness-0 invert"
              />
              <div>
                <p className="font-heading font-semibold text-sm text-foreground">
                  PR PMII RAYON TEKNIK
                </p>
                <p className="text-xs text-muted-foreground">UNUSIA JAKPUS</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Platform digital terpadu untuk manajemen kader PR PMII Rayon Teknik
              UNUSIA Jakarta Pusat.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="relative text-sm text-muted-foreground hover:text-primary transition-colors group inline-block"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Kontak
            </h3>
            <ul className="space-y-3">
              <motion.li
                whileHover={{ x: 4 }}
                className="flex items-start gap-2"
              >
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Kampus UNUSIA, Jl. Taman Amir Hamzah No. 5, Jakarta Pusat 10430
                </span>
              </motion.li>
              <motion.li
                whileHover={{ x: 4 }}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:pmii.rayonteknik@unusia.ac.id"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  pmii.rayonteknik@unusia.ac.id
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} PR PMII RAYON TEKNIK UNUSIA JAKPUS.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
