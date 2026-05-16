"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { duration, easing } from "@/lib/animation"

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: duration.normal, ease: easing.standard },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    filter: "blur(2px)",
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
