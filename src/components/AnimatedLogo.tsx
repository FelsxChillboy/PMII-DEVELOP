"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { animate, createTimeline, cubicBezier } from "animejs"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface AnimatedLogoProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  invert?: boolean
}

export default function AnimatedLogo({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  invert = false,
}: AnimatedLogoProps) {
  const reducedMotion = useReducedMotion()
  const ringRef = useRef<HTMLDivElement>(null)
  const dot1Ref = useRef<HTMLDivElement>(null)
  const dot2Ref = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return

    const ring = ringRef.current
    const dot1 = dot1Ref.current
    const dot2 = dot2Ref.current
    const glow = glowRef.current
    if (!ring || !dot1 || !dot2 || !glow) return

    const tl = createTimeline({})

    tl.add(ring, {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 1200,
      ease: "outBack(2)",
    })

    tl.add(dot1, {
      translateX: [0, 6],
      opacity: [0, 1],
      duration: 700,
      ease: cubicBezier(0.16, 1, 0.3, 1),
    }, "-=500")

    tl.add(dot2, {
      translateX: [0, -6],
      opacity: [0, 1],
      duration: 700,
      ease: cubicBezier(0.16, 1, 0.3, 1),
    }, "-=400")

    tl.add(glow, {
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.3, 0.8],
      duration: 2500,
      ease: cubicBezier(0.16, 1, 0.3, 1),
      loop: true,
    }, "-=600")

    tl.add(dot1, {
      translateX: [
        { value: 6, duration: 1500 },
        { value: 0, duration: 1500 },
        { value: -6, duration: 1500 },
        { value: 0, duration: 1500 },
      ],
      translateY: [
        { value: 0, duration: 1500 },
        { value: 6, duration: 1500 },
        { value: 0, duration: 1500 },
        { value: -6, duration: 1500 },
      ],
      duration: 6000,
      loop: true,
      ease: cubicBezier(0.16, 1, 0.3, 1),
    }, "-=400")

    tl.add(dot2, {
      translateX: [
        { value: -6, duration: 2000 },
        { value: 0, duration: 2000 },
        { value: 6, duration: 2000 },
      ],
      translateY: [
        { value: 3, duration: 2000 },
        { value: -3, duration: 2000 },
        { value: 3, duration: 2000 },
      ],
      duration: 6000,
      loop: true,
      ease: cubicBezier(0.16, 1, 0.3, 1),
    }, "-=400")

    return () => {
      animate(ring, { opacity: 0, duration: 0 })
      animate(dot1, { opacity: 0, duration: 0 })
      animate(dot2, { opacity: 0, duration: 0 })
      animate(glow, { opacity: 0, duration: 0 })
    }
  }, [reducedMotion])

  return (
    <div ref={containerRef} className="relative inline-flex items-center justify-center">
      <div
        ref={ringRef}
        className="pointer-events-none absolute h-[calc(100%+12px)] w-[calc(100%+12px)] rounded-full border border-primary/40"
        style={{ opacity: 0, transform: "scale(0)" }}
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[calc(100%+20px)] w-[calc(100%+20px)] rounded-full bg-primary/10"
        style={{ opacity: 0, transform: "scale(0.8)" }}
      />
      <div
        ref={dot1Ref}
        className="pointer-events-none absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary"
        style={{ opacity: 0 }}
      />
      <div
        ref={dot2Ref}
        className="pointer-events-none absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-primary"
        style={{ opacity: 0 }}
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 ${invert ? "brightness-0 invert" : ""} ${className}`}
        priority={priority}
      />
    </div>
  )
}
