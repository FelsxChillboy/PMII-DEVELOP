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
      const rotateX = -(y - 0.5) * 12
      const rotateY = (x - 0.5) * 12
      glareRef.current.x = x * 100
      glareRef.current.y = y * 100
      const el = ref.current
      if (el) {
        el.style.setProperty("--glare-x", `${glareRef.current.x}%`)
        el.style.setProperty("--glare-y", `${glareRef.current.y}%`)
        el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`
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
        "group relative p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-primary/30 cursor-default overflow-hidden",
        "[perspective:800px] transition-transform duration-200 ease-out will-change-transform",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(56,189,248,0.08) 0%, transparent 60%)`,
        }}
      />
      <div
        className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors relative"
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
