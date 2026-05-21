"use client"

import { useRef, useCallback } from "react"
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
  const glareRef = useRef({ x: 50, y: 50 })

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const rotateX = -(y - 0.5) * 8
      const rotateY = (x - 0.5) * 8
      glareRef.current.x = x * 100
      glareRef.current.y = y * 100
      const el = ref.current
      if (el) {
        el.style.setProperty("--glare-x", `${glareRef.current.x}%`)
        el.style.setProperty("--glare-y", `${glareRef.current.y}%`)
        el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
      }
    },
    []
  )

  const handlePointerLeave = useCallback(() => {
    glareRef.current.x = 50
    glareRef.current.y = 50
    const el = ref.current
    if (el) {
      el.style.setProperty("--glare-x", "50%")
      el.style.setProperty("--glare-y", "50%")
      el.style.transform = ""
    }
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "group relative p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/20 cursor-default overflow-hidden",
        "[perspective:800px] transition-all duration-300 ease-out will-change-transform hover:shadow-lg hover:shadow-primary/[0.02]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), hsl(var(--primary) / 0.06) 0%, transparent 60%)`,
        }}
      />
      <div
        className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 relative"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="text-primary">{icon}</div>
      </div>
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
    </div>
  )
}
