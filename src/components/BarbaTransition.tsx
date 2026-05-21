"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface BarbaTransitionProps {
  children: React.ReactNode
}

export default function BarbaTransition({ children }: BarbaTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [status, setStatus] = useState<"idle" | "leaving" | "entering">("idle")
  const prevPathname = useRef(pathname)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (pathname === prevPathname.current) {
      setDisplayChildren(children)
      return
    }

    if (reducedMotion) {
      setDisplayChildren(children)
      prevPathname.current = pathname
      window.scrollTo(0, 0)
      return
    }

    let isCancelled = false

    const runTransition = async () => {
      // Step 1: Start exit fade out
      setStatus("leaving")

      // Wait for exit transition to complete (150ms)
      await new Promise((r) => setTimeout(r, 150))
      if (isCancelled) return

      // Step 2: Swap content and scroll to top
      setDisplayChildren(children)
      prevPathname.current = pathname
      window.scrollTo({ top: 0, left: 0 })

      // Step 3: Start enter fade in & slide up
      setStatus("entering")

      // Wait for enter transition to complete (250ms)
      await new Promise((r) => setTimeout(r, 250))
      if (isCancelled) return

      setStatus("idle")
    }

    runTransition()

    return () => {
      isCancelled = true
    }
  }, [pathname, children, reducedMotion])

  // Reduced motion: instant page switch
  if (reducedMotion) {
    return <div className="w-full">{children}</div>
  }

  return (
    <div className="relative w-full">
      {/* Sleek Top Progress Bar (Vercel/GitHub Style) */}
      {status !== "idle" && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{
            scaleX: status === "leaving" ? 0.75 : 1,
            opacity: status === "entering" ? [1, 1, 0] : 1,
          }}
          transition={{
            scaleX: { duration: status === "leaving" ? 0.3 : 0.2, ease: "easeOut" },
            opacity: { duration: 0.4, times: [0, 0.7, 1] },
          }}
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-primary z-[99999] shadow-[0_0_8px_rgba(56,189,248,0.4)] origin-left"
        />
      )}

      {/* Main Page Container */}
      <motion.div
        key={pathname === prevPathname.current ? pathname : prevPathname.current}
        animate={
          status === "leaving"
            ? { opacity: 0, y: -10, filter: "blur(2px)" }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        initial={
          status === "entering"
            ? { opacity: 0, y: 10, filter: "blur(2px)" }
            : false
        }
        transition={{
          duration: status === "leaving" ? 0.15 : 0.25,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
        className="w-full"
      >
        {displayChildren}
      </motion.div>
    </div>
  )
}
