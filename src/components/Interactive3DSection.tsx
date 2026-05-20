"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useEffect, useRef } from "react"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import dynamic from "next/dynamic"
import AnimatedSection from "@/components/AnimatedSection"

const PhysicsWorld = dynamic(
  () => import("@/components/three/physics/PhysicsWorld"),
  { ssr: false }
)

const PhysicsOrb = dynamic(
  () => import("@/components/three/physics/PhysicsOrb"),
  { ssr: false }
)

const ORBS = [
  { position: [-3, 3, -2] as [number, number, number], color: "#38BDF8", hoverColor: "#FBBF24", geometry: "icosahedron" as const },
  { position: [3, 1, -3] as [number, number, number], color: "#A78BFA", hoverColor: "#F472B6", geometry: "octahedron" as const },
  { position: [0, 5, -4] as [number, number, number], color: "#34D399", hoverColor: "#F87171", geometry: "icosahedron" as const },
  { position: [-1.2, 7, -1.5] as [number, number, number], color: "#FBBF24", hoverColor: "#38BDF8", geometry: "torus" as const },
  { position: [4, 6, -5] as [number, number, number], color: "#F472B6", hoverColor: "#34D399", geometry: "octahedron" as const },
]

function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={0.8}
      />
    </EffectComposer>
  )
}

const SIZES = [0.75, 0.85, 0.7, 0.9, 0.8]

function PhysicsScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        touchAction: "none",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-5, 3, 5]} intensity={0.6} color="#FBBF24" />
      <Suspense fallback={null}>
        <PhysicsWorld showGround={false}>
          {ORBS.map((orb, i) => (
            <PhysicsOrb
              key={i}
              position={orb.position}
              color={orb.color}
              hoverColor={orb.hoverColor}
              geometry={orb.geometry}
              size={SIZES[i]}
            />
          ))}
        </PhysicsWorld>
      </Suspense>
      <Effects />
    </Canvas>
  )
}

export default function Interactive3DSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-background via-background to-background/50">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-3">
            EKSPLORASI 3D INTERAKTIF
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Sentuh &amp; <span className="text-primary">Interaksikan</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mt-4">
            Klik setiap objek 3D untuk melihat reaksi fisik yang realistis.
          </p>
        </AnimatedSection>
      </div>

      <div
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
        style={{ height: "500px" }}
      >
        <div className="relative w-full h-full rounded-2xl border border-border bg-card/50 overflow-hidden">
          {inView && <PhysicsScene />}
        </div>
      </div>
    </section>
  )
}
