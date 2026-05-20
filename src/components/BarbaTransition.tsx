"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

type TransitionPhase = "idle" | "leaving" | "entering"
type Direction = "forward" | "back"

interface BarbaTransitionProps {
  children: React.ReactNode
  namespace?: string
}

const DURATION = {
  leave: 320,
  enter: 420,
  overlay: 60,
  total: 800,
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function TransitionProgress({ onEnd }: { onEnd: () => void }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let cancelled = false
    const start = performance.now()

    const frame = () => {
      if (cancelled) return
      const elapsed = performance.now() - start
      const t = Math.min(elapsed / DURATION.total, 1)
      bar.style.transform = `scaleX(${easeOutCubic(t)})`
      if (t < 1) requestAnimationFrame(frame)
      else onEnd()
    }

    requestAnimationFrame(frame)
    return () => { cancelled = true }
  }, [onEnd])

  return (
    <div className="barba-progress" aria-hidden>
      <div ref={barRef} className="barba-progress-fill" />
    </div>
  )
}

export default function BarbaTransition({ children, namespace }: BarbaTransitionProps) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayChildren, setDisplayChildren] = useState(children)
  const [phase, setPhase] = useState<TransitionPhase>("idle")
  const [dir, setDir] = useState<Direction>("forward")
  const [showProgress, setShowProgress] = useState(false)
  const prevPathname = useRef(pathname)
  const navStack = useRef<string[]>([pathname])

  const resolvedNamespace =
    namespace ??
    (pathname === "/"
      ? "home"
      : pathname.replace(/\//g, "-").replace(/^-/, "") || "default")

  useEffect(() => {
    if (pathname === prevPathname.current) {
      prevPathname.current = pathname
      return
    }

    const container = containerRef.current
    if (!container) return

    const stack = navStack.current
    const prevIdx = stack.indexOf(pathname)
    const isBack = prevIdx !== -1 && prevIdx === stack.length - 2

    if (isBack) {
      setDir("back")
      stack.pop()
    } else {
      setDir("forward")
      stack.push(pathname)
    }

    let cancelled = false

    const runTransition = async () => {
      setShowProgress(true)
      setPhase("leaving")

      await new Promise<void>((resolve) => {
        const onEnd = () => resolve()
        container.addEventListener("animationend", onEnd, { once: true })
        setTimeout(resolve, DURATION.leave + 50)
      })

      if (cancelled) return

      setDisplayChildren(children)
      prevPathname.current = pathname

      await new Promise((r) => requestAnimationFrame(r))
      await new Promise((r) => setTimeout(r, DURATION.overlay))

      if (cancelled) return

      setPhase("entering")

      await new Promise<void>((resolve) => {
        const onEnd = () => resolve()
        container.addEventListener("animationend", onEnd, { once: true })
        setTimeout(resolve, DURATION.enter + 50)
      })

      setPhase("idle")
    }

    runTransition()

    return () => {
      cancelled = true
    }
  }, [pathname, children])

  return (
    <>
      {showProgress && (
        <TransitionProgress onEnd={() => setShowProgress(false)} />
      )}

      {phase !== "idle" && (
        <div className="barba-overlay" />
      )}

      <div
        ref={containerRef}
        data-barba="container"
        data-barba-namespace={resolvedNamespace}
        data-barba-direction={dir}
        className={`barba-container${phase === "leaving" ? ` is-leaving is-leaving-${dir}` : ""}${phase === "entering" ? ` is-entering is-entering-${dir}` : ""}`}
        aria-hidden={phase === "leaving"}
      >
        {displayChildren}
      </div>
    </>
  )
}
