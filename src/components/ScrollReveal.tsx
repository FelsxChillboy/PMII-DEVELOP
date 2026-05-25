"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: ReactNode
  speed?: number
  direction?: "left" | "right"
  className?: string
  pauseOnHover?: boolean
}

export function Marquee({
  children,
  speed = 30,
  direction = "left",
  className,
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden whitespace-nowrap",
        className
      )}
    >
      <div
        className={cn(
          "inline-flex",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee${direction === "right" ? "-reverse" : ""} ${speed}s linear infinite`,
        }}
      >
        {children}
        {children}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  type?: "spring" | "tween"
  stiffness?: number
  damping?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  type = "spring",
  stiffness = 100,
  damping = 15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const getOffset = () => {
    const offset = 40
    switch (direction) {
      case "up": return { x: 0, y: offset }
      case "down": return { x: 0, y: -offset }
      case "left": return { x: offset, y: 0 }
      case "right": return { x: -offset, y: 0 }
      default: return { x: 0, y: offset }
    }
  }

  const offset = getOffset()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offset }
      }
      transition={{
        type,
        stiffness,
        damping,
        delay,
        duration: type === "tween" ? 0.6 : undefined,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  childrenDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  childrenDelay = 0,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childrenDelay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "scale"
}

export function StaggerItem({ children, className, direction = "up" }: StaggerItemProps) {
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      scale: direction === "scale" ? 0.8 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
