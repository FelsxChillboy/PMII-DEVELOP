"use client"

import { useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  fill?: string
  size?: number
}

export function Spotlight({ className, fill = "white", size = 800 }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  return (
    <div
      ref={divRef}
      onMouseEnter={() => setOpacity(0.15)}
      onMouseLeave={() => setOpacity(0)}
      onMouseMove={handleMouseMove}
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(${size}px circle at ${position.x}% ${position.y}%, ${fill}, transparent 80%)`,
          }}
        />
      </div>
    </div>
  )
}
