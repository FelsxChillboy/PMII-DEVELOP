"use client"

import { useRef } from "react"
import { motion, useInView, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { duration, easing, variants as globalVariants } from "@/lib/animation"

type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleIn" | "staggerContainer"

const variantMap: Record<AnimationVariant, Variants> = {
  fadeUp: globalVariants.fadeUp,
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.normal, ease: easing.standard } },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: duration.normal, ease: easing.standard } },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: duration.normal, ease: easing.standard } },
  },
  fadeIn: globalVariants.fadeIn,
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: duration.normal, ease: easing.standard } },
  },
  staggerContainer: globalVariants.staggerContainer,
}

interface AnimatedSectionProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  className?: string
  once?: boolean
  as?: "div" | "section"
}

export default function AnimatedSection({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  once = true,
  as = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-80px" })

  const MotionTag = as === "section" ? motion.section : motion.div

  return (
    <MotionTag
      ref={ref}
      variants={variantMap[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={globalVariants.staggerItem} className={cn(className)}>
      {children}
    </motion.div>
  )
}
