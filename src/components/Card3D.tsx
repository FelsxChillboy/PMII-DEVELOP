"use client"

import { useRef, useCallback, useState, type ReactNode } from "react"
import { motion, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface Card3DProps {
  children: ReactNode
  className?: string
  asLink?: boolean
  href?: string
}

export default function Card3D({ children, className, asLink, href }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [glare, setGlare] = useState({ x: 50, y: 50 })

  const rotateX = useSpring(0, { stiffness: 200, damping: 25 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 })
  const cardScale = useSpring(1, { stiffness: 300, damping: 20 })

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      rotateX.set(-(y - 0.5) * 10)
      rotateY.set((x - 0.5) * 10)
      cardScale.set(1.02)
      setGlare({ x: x * 100, y: y * 100 })
    },
    [rotateX, rotateY, cardScale]
  )

  const handlePointerLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    cardScale.set(1)
    setGlare({ x: 50, y: 50 })
  }, [rotateX, rotateY, cardScale])

  const sharedProps = {
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    style: {
      rotateX: rotateX as unknown as number,
      rotateY: rotateY as unknown as number,
      scale: cardScale as unknown as number,
      transformStyle: "preserve-3d" as const,
    } as React.CSSProperties,
    className: cn(
      "group relative rounded-xl border border-border bg-card overflow-hidden cursor-default [perspective:800px]",
      asLink && "hover:border-primary/30 transition-colors duration-300",
      className
    ),
  }

  if (asLink) {
    return (
      <motion.a ref={ref as unknown as React.Ref<HTMLAnchorElement>} href={href} {...sharedProps}>
        <GlareEffects glare={glare} />
        {children}
      </motion.a>
    )
  }

  return (
    <motion.div ref={ref} {...sharedProps}>
      <GlareEffects glare={glare} />
      {children}
    </motion.div>
  )
}

function GlareEffects({ glare }: { glare: { x: number; y: number } }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(56,189,248,0.08) 0%, transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: `radial-gradient(circle at ${100 - glare.x}% ${100 - glare.y}%, rgba(255,255,255,0.03) 0%, transparent 50%)`,
        }}
      />
    </>
  )
}
