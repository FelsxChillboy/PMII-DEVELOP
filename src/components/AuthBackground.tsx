"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export default function AuthBackground() {
  const reducedMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      time += 0.003
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createRadialGradient(
        canvas.width * (0.5 + 0.3 * Math.sin(time * 0.7)),
        canvas.height * (0.4 + 0.2 * Math.cos(time * 0.5)),
        0,
        canvas.width * (0.5 + 0.3 * Math.sin(time * 0.7)),
        canvas.height * (0.4 + 0.2 * Math.cos(time * 0.5)),
        Math.max(canvas.width, canvas.height) * 0.6,
      )
      gradient.addColorStop(0, "hsla(199, 89%, 60%, 0.12)")
      gradient.addColorStop(0.5, "hsla(222, 84%, 5%, 0)")
      gradient.addColorStop(1, "hsla(222, 84%, 5%, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.6 + 0.25 * Math.cos(time * 0.4)),
        canvas.height * (0.6 + 0.2 * Math.sin(time * 0.6)),
        0,
        canvas.width * (0.6 + 0.25 * Math.cos(time * 0.4)),
        canvas.height * (0.6 + 0.2 * Math.sin(time * 0.6)),
        Math.max(canvas.width, canvas.height) * 0.4,
      )
      gradient2.addColorStop(0, "hsla(45, 97%, 47%, 0.06)")
      gradient2.addColorStop(1, "hsla(222, 84%, 5%, 0)")

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
