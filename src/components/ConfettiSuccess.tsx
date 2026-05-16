"use client"

import { useEffect, useRef } from "react"

const COLORS = ["#38BDF8", "#FBBF24", "#34D399", "#A78BFA", "#F472B6", "#F87171"]

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; color: string
  rotation: number; rotationSpeed: number
  opacity: number
}

export default function ConfettiSuccess() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!
    c.width = window.innerWidth
    c.height = window.innerHeight
    const ctx = c.getContext("2d")!

    const particles: Particle[] = [
      ...Array.from({ length: 120 }, () => ({
        x: c.width / 2 + (Math.random() - 0.5) * 300,
        y: c.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 18 - 2,
        size: Math.random() * 10 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
      })),
      ...Array.from({ length: 30 }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height * 0.5,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 1,
        size: Math.random() * 4 + 1,
        color: "#38BDF8",
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        opacity: 1,
      })),
    ]

    let frame: number

    function animate() {
      ctx.clearRect(0, 0, c.width, c.height)
      let alive = false
      for (const p of particles) {
        if (p.opacity <= 0) continue
        alive = true
        p.x += p.vx; p.vy += 0.2; p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity -= 0.003

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }
      if (alive) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)

    const onResize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas ref={ref} className="fixed inset-0 z-50 pointer-events-none" />
  )
}
