"use client"

import { Canvas } from "@react-three/fiber"
import { Preload } from "@react-three/drei"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

interface SceneCanvasProps {
  children: React.ReactNode
  className?: string
  pointerEvents?: boolean
}

export default function SceneCanvas({
  children,
  className,
  pointerEvents = false,
}: SceneCanvasProps) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: pointerEvents ? "auto" : "none",
        zIndex: pointerEvents ? 10 : 0,
      }}
      className={cn(className)}
    >
      <Suspense fallback={null}>
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
