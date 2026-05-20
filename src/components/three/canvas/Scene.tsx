"use client"

import { Canvas } from "@react-three/fiber"
import { Preload } from "@react-three/drei"
import { Suspense, useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SceneCanvasProps {
  children: React.ReactNode
  className?: string
  pointerEvents?: boolean
}

function useInView(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}

export default function SceneCanvas({
  children,
  className,
  pointerEvents = false,
}: SceneCanvasProps) {
  const { ref, inView } = useInView()

  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      {inView && (
        <Canvas
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 5], fov: 45 }}
          frameloop="demand"
          dpr={[1, 1.5]}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: pointerEvents ? "auto" : "none",
            zIndex: pointerEvents ? 10 : 0,
          }}
        >
          <Suspense fallback={null}>
            {children}
            <Preload all />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
