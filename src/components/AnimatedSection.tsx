"use client"

import { useRef } from "react"
import { motion, useInView, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimationVariant = "fadeUp" | "fadeLeft" | "scaleIn" | "stagger" | "clipReveal"

const variantMap: Record<AnimationVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8, filter: "blur(8px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.5 } },
  },
  stagger: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  },
  clipReveal: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  },
}

interface AnimatedSectionProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  className?: string
  once?: boolean
}

export default function AnimatedSection({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      variants={variantMap[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
