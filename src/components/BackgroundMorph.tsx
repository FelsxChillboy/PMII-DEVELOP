"use client"

import { useEffect, useRef, useState } from "react"
import { createTimeline, morphTo } from "animejs"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const BLOB_PATHS = [
  "M200 300C200 170 320 120 400 180C480 240 580 150 680 220C780 290 740 420 640 480C540 540 440 580 340 520C240 460 200 430 200 300Z",
  "M260 260C320 140 480 180 520 290C560 400 660 360 700 420C740 480 640 560 540 520C440 480 340 540 240 480C140 420 200 380 260 260Z",
  "M180 350C180 230 300 160 400 200C500 240 600 180 680 260C760 340 700 480 580 530C460 580 360 620 260 560C160 500 180 470 180 350Z",
]

export default function BackgroundMorph() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const blob1Ref = useRef<SVGPathElement>(null)
  const blob2Ref = useRef<SVGPathElement>(null)
  const blob3Ref = useRef<SVGPathElement>(null)
  const ref1Ref = useRef<SVGPathElement>(null)
  const ref2Ref = useRef<SVGPathElement>(null)
  const ref3Ref = useRef<SVGPathElement>(null)
  const tlRef = useRef<ReturnType<typeof createTimeline> | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const b1 = blob1Ref.current
    const b2 = blob2Ref.current
    const b3 = blob3Ref.current
    const r1 = ref1Ref.current
    const r2 = ref2Ref.current
    const r3 = ref3Ref.current
    if (!b1 || !b2 || !b3 || !r1 || !r2 || !r3) return

    if (!inView) {
      if (tlRef.current) {
        tlRef.current.pause()
      }
      return
    }

    const morphPrecision = 0.6
    const morphDuration = 5000

    const tl = createTimeline({ loop: true })
    tlRef.current = tl

    tl.add(b1, { d: morphTo(r2, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" })
    tl.add(b1, { d: morphTo(r3, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" })
    tl.add(b1, { d: morphTo(r1, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" })

    tl.add(b2, { d: morphTo(r3, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" }, 0)
    tl.add(b2, { d: morphTo(r1, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" })
    tl.add(b2, { d: morphTo(r2, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" })

    tl.add(b3, { d: morphTo(r1, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" }, 0)
    tl.add(b3, { d: morphTo(r2, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" })
    tl.add(b3, { d: morphTo(r3, morphPrecision), duration: morphDuration, ease: "cubicBezier(0.16, 1, 0.3, 1)" })

    return () => {
      tlRef.current = null
      b1.setAttribute("d", BLOB_PATHS[0])
      b2.setAttribute("d", BLOB_PATHS[1])
      b3.setAttribute("d", BLOB_PATHS[2])
    }
  }, [reducedMotion, inView])

  if (reducedMotion) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full opacity-40"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <path ref={blob1Ref} d={BLOB_PATHS[0]} className="fill-primary/5" style={{ transformOrigin: "400px 300px" }} />
        <path ref={blob2Ref} d={BLOB_PATHS[1]} className="fill-blue-500/5" style={{ transformOrigin: "400px 300px" }} />
        <path ref={blob3Ref} d={BLOB_PATHS[2]} className="fill-indigo-500/5" style={{ transformOrigin: "400px 300px" }} />
        <path ref={ref1Ref} d={BLOB_PATHS[0]} fill="none" stroke="none" />
        <path ref={ref2Ref} d={BLOB_PATHS[1]} fill="none" stroke="none" />
        <path ref={ref3Ref} d={BLOB_PATHS[2]} fill="none" stroke="none" />
      </svg>
    </div>
  )
}
