"use client"

import { useRef, useCallback } from "react"
import { motion, useSpring, useMotionTemplate, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { duration } from "@/lib/animation"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const glareRef = useRef({ x: 50, y: 50 })

  const rotateX = useSpring(0, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 })
  const cardScale = useSpring(1, { stiffness: 300, damping: 20 })

  const shadowX = useTransform(rotateX, [-10, 10], [5, -5])
  const shadowY = useTransform(rotateY, [-10, 10], [5, -5])
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 25px rgba(0,0,0,0.4)`

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      rotateX.set(-(y - 0.5) * 12)
      rotateY.set((x - 0.5) * 12)
      cardScale.set(1.03)
      glareRef.current.x = x * 100
      glareRef.current.y = y * 100
      const el = ref.current
      if (el) {
        el.style.setProperty("--glare-x", `${glareRef.current.x}%`)
        el.style.setProperty("--glare-y", `${glareRef.current.y}%`)
      }
    },
    [rotateX, rotateY, cardScale]
  )

  const handlePointerLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    cardScale.set(1)
    glareRef.current.x = 50
    glareRef.current.y = 50
    const el = ref.current
    if (el) {
      el.style.setProperty("--glare-x", "50%")
      el.style.setProperty("--glare-y", "50%")
    }
  }, [rotateX, rotateY, cardScale])

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX: rotateX as unknown as number,
        rotateY: rotateY as unknown as number,
        scale: cardScale as unknown as number,
        boxShadow: shadow,
        transformStyle: "preserve-3d" as const,
      }}
      className={cn(
        "group relative p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-primary/30 cursor-default overflow-hidden",
        "[perspective:800px]",
        className
      )}
      transition={{ duration: duration.fast }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(56,189,248,0.08) 0%, transparent 60%)`,
        }}
      />
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors relative"
        style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
      >
        <div className="text-primary">{icon}</div>
      </motion.div>
      <h3
        className="font-heading font-semibold text-lg text-foreground mb-2 relative"
        style={{ transform: "translateZ(20px)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-muted-foreground leading-relaxed relative"
        style={{ transform: "translateZ(10px)" }}
      >
        {description}
      </p>
    </motion.div>
  )
}
