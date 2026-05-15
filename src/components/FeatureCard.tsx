"use client"

import { useRef, useCallback } from "react"
import { motion, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

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

  const rotateX = useSpring(0, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 })
  const scale = useSpring(1, { stiffness: 300, damping: 20 })

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      rotateX.set(-y * 10)
      rotateY.set(x * 10)
      scale.set(1.02)
    },
    [rotateX, rotateY, scale]
  )

  const handlePointerLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }, [rotateX, rotateY, scale])

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        {
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        } as any
      }
      className={cn(
        "group p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors duration-300 cursor-default",
        "[perspective:800px]",
        className
      )}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
        style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
      >
        <div className="text-primary">{icon}</div>
      </motion.div>
      <h3
        className="font-heading font-semibold text-lg text-foreground mb-2"
        style={{ transform: "translateZ(20px)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-muted-foreground leading-relaxed"
        style={{ transform: "translateZ(10px)" }}
      >
        {description}
      </p>
    </motion.div>
  )
}
