"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react"

const NAV_LINKS = [
  { label: "Beranda", path: "/" },
  { label: "Tentang", path: "/tentang" },
  { label: "Berita", path: "/berita" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Donasi", path: "/donasi" },
  { label: "Transparansi", path: "/transparansi" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = () => signOut({ callbackUrl: "/" })

  const { scrollY, scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (current) => {
      if (current > lastScrollY.current && current > 80) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = current
    })
    return () => unsubscribe()
  }, [scrollY])

  return (
    <motion.header
      initial={false}
      animate={hidden ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-primary origin-left"
        style={{ scaleX: progressScale }}
      />
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://media.base44.com/images/public/6a0614bbe8ea40108cd58983/6842b6f37_Logo_RayonTeknik2022.svg"
            alt="Logo PR PMII Rayon Teknik"
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
          <span className="hidden sm:inline font-heading text-sm font-semibold tracking-tight text-foreground">
            PR PMII<span className="text-primary"> Rayon Teknik</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.path === "/"
                ? pathname === "/"
                : pathname.startsWith(link.path)
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "relative px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/kontak"
            className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Hubungi Kami
          </Link>

          {session?.user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex h-9 px-3 items-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Keluar"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/daftar"
                className="inline-flex h-9 px-4 items-center justify-center rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Daftar
              </Link>
              <Link
                href="/login"
                className="inline-flex h-9 px-4 items-center justify-center rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
              >
                Masuk
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 z-50 w-72 bg-background border-l border-border lg:hidden"
            >
              <nav className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link, i) => {
                  const isActive =
                    link.path === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.path)
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-lg text-sm font-medium transition-colors block",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
                <div className="border-t border-border my-2" />
                {session?.user ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/daftar"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors block text-center"
                    >
                      Daftar
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors block text-center"
                    >
                      Masuk
                    </Link>
                  </>
                )}
                <Link
                  href="/kontak"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 h-10 px-4 flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Hubungi Kami
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
