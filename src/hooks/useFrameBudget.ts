"use client"

import { useEffect, useRef } from "react"

export function useFrameBudget(targetFps = 60) {
  const frameTimeRef = useRef<number[]>([])

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    let rafId: number
    let lastTime = performance.now()

    const check = (now: number) => {
      const delta = now - lastTime
      frameTimeRef.current.push(delta)
      if (frameTimeRef.current.length > 60) frameTimeRef.current.shift()

      const avg =
        frameTimeRef.current.reduce((a, b) => a + b, 0) /
        frameTimeRef.current.length
      const fps = 1000 / avg

      if (fps < targetFps * 0.8) {
        console.warn(
          `⚠️ [Perf] ${fps.toFixed(0)}fps (target ${targetFps})`
        )
      }

      lastTime = now
      rafId = requestAnimationFrame(check)
    }

    rafId = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafId)
  }, [targetFps])
}
