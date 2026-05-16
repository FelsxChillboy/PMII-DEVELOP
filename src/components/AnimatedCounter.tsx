"use client"

import { useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface AnimatedCounterProps {
  value: number
  currency?: boolean
  className?: string
}

export default function AnimatedCounter({
  value,
  currency = false,
  className,
}: AnimatedCounterProps) {
  const reducedMotion = useReducedMotion()

  const raw = useMotionValue(0)
  const spring = useSpring(raw, {
    stiffness: reducedMotion ? 10000 : 120,
    damping: reducedMotion ? 500 : 14,
  })

  useEffect(() => {
    raw.set(value)
  }, [value, raw])

  const displayValue = useTransform(spring, (n) => {
    if (currency) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(n)
    }
    return Math.round(n).toLocaleString("id-ID")
  })

  return <motion.span className={className}>{displayValue}</motion.span>
}
