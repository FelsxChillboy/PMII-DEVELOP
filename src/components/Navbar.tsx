"use client"

import { useState, useEffect, useRef, memo } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import SearchBar from "@/components/SearchBar"

const NavbarLogo3D = dynamic(() => import("@/components/NavbarLogo3D"), { ssr: false })

const NAV_LINKS = [
  { label: "Beranda", path: "/" },
  { label: "Tentang", path: "/tentang" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Kontak", path: "/kontak" },
]

const UPDATE_LINKS = [
  { label: "Berita", path: "/berita" },
  { label: "Opini", path: "/opini" },
]

export default memo(function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  const { scrollY, scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  const isUpdateActive = pathname.startsWith("/berita") || pathname.startsWith("/opini")

  useEffect(() => {
    let ticking = false
    const THRESHOLD = 15
    const unsubscribe = scrollY.on("change", (current) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const delta = current - lastScrollY.current
        if (Math.abs(delta) > THRESHOLD || current <= 80) {
          if (current > lastScrollY.current && current > 80) {
            setHidden(true)
          } else {
            setHidden(false)
          }
          lastScrollY.current = current
        }
        ticking = false
      })
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
          <NavbarLogo3D className="h-9 w-9 shrink-0" />
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
                    transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}

          <div
            className="relative"
            onMouseEnter={() => setUpdateOpen(true)}
            onMouseLeave={() => setUpdateOpen(false)}
          >
            <button
              type="button"
              className={cn(
                "relative px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isUpdateActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {isUpdateActive && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">Update</span>
            </button>

            <AnimatePresence>
              {updateOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-44 rounded-3xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl"
                >
                  {UPDATE_LINKS.map((item) => {
                    const isActiveItem = pathname.startsWith(item.path)
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                          "block rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                          isActiveItem
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-1">
          <SearchBar />
          <Link
            href="/kontak"
            className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Hubungi Kami
          </Link>

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
              transition={{ type: "spring" as const, damping: 25, stiffness: 200 }}
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
                <div className="rounded-2xl border border-border bg-background/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Update
                  </p>
                  {UPDATE_LINKS.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border my-2" />
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
})
