"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { useReducedMotion } from "./useReducedMotion"

interface UseLenisOptions {
  duration?: number
  lerp?: number
  smoothWheel?: boolean
  syncTouch?: boolean
  wheelMultiplier?: number
  touchMultiplier?: number
  orientation?: "vertical" | "horizontal"
  gestureOrientation?: "vertical" | "horizontal" | "both"
  anchors?: boolean
}

export function useLenis({
  duration = 1.2,
  lerp = 0.1,
  smoothWheel = true,
  syncTouch = true,
  wheelMultiplier = 1,
  touchMultiplier = 1,
  orientation = "vertical",
  gestureOrientation = "vertical",
  anchors = true,
}: UseLenisOptions = {}) {
  const reducedMotion = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      duration,
      lerp,
      smoothWheel,
      syncTouch,
      wheelMultiplier,
      touchMultiplier,
      orientation,
      gestureOrientation,
      anchors,
      autoRaf: true,
    })

    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [
    reducedMotion,
    duration,
    lerp,
    smoothWheel,
    syncTouch,
    wheelMultiplier,
    touchMultiplier,
    orientation,
    gestureOrientation,
    anchors,
  ])

  return lenisRef
}
