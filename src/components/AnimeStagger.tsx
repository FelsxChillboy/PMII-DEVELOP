"use client"

import { useEffect, useRef } from "react"
import { animate, stagger } from "animejs"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface AnimeStaggerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  from?: "first" | "center" | "last"
  direction?: "normal" | "reverse"
  start?: string | number
  once?: boolean
  as?: "div" | "section"
}

export default function AnimeStagger({
  children,
  className,
  staggerDelay = 60,
  from = "first",
  direction = "normal",
  start = 0,
  once = true,
  as = "div",
}: AnimeStaggerProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-80px" })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (reducedMotion || !isInView || !ref.current || hasAnimated.current) return

    hasAnimated.current = true
    const items = ref.current.querySelectorAll(".anime-stagger-item")

    if (items.length === 0) return

    animate(items as NodeListOf<HTMLElement>, {
      opacity: [0, 1],
      y: [30, 0],
      scale: [0.97, 1],
      delay: stagger(staggerDelay, { from, reversed: direction === "reverse", start }),
      duration: 600,
      ease: "outBack(2)",
    })

    return () => {
      animate(items as NodeListOf<HTMLElement>, { opacity: 1, y: 0, scale: 1 })
    }
  }, [isInView, reducedMotion, staggerDelay, from, direction, start])

  if (as === "section") {
    return (
      <section ref={ref} className={cn(className)}>
        {children}
      </section>
    )
  }

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

export function AnimeStaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("anime-stagger-item", className)}>
      {children}
    </div>
  )
}
