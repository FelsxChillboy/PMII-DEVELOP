"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing"
import { Vector2, InstancedMesh, Object3D } from "three"
import Logo3D from "@/components/Logo3D"
import { sharedMouse } from "@/lib/mouse"

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function Particles({ count = 250 }: { count?: number }) {
  const meshRef = useRef<InstancedMesh>(null!)
  const dummy = useRef(new Object3D())

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 3 + seededRandom(i * 5) * 8
      const theta = seededRandom(i * 7) * Math.PI * 2
      const phi = (seededRandom(i * 11) - 0.5) * Math.PI * 0.4
      const i3 = i * 3
      pos[i3] = Math.cos(theta) * Math.cos(phi) * radius
      pos[i3 + 1] = Math.sin(phi) * radius * 0.6
      pos[i3 + 2] = Math.sin(theta) * Math.cos(phi) * radius
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const mx = sharedMouse.current.x * 0.3
    const my = sharedMouse.current.y * 0.3
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      dummy.current.position.set(
        positions[i3] + Math.sin(t * 0.12 + i * 0.3) * 0.25 + mx,
        positions[i3 + 1] + Math.cos(t * 0.1 + i * 0.3) * 0.25 + my,
        positions[i3 + 2]
      )
      dummy.current.rotation.set(t * 0.04 + i, t * 0.06 + i, 0)
      const scale = 0.3 + Math.sin(t * 0.2 + i) * 0.2
      dummy.current.scale.setScalar(scale)
      dummy.current.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.current.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    state.invalidate()
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.06, 0]} />
      <meshStandardMaterial color="#38BDF8" transparent opacity={0.4} wireframe />
    </instancedMesh>
  )
}

function MouseTracker() {
  const { pointer } = useThree()
  useFrame((state) => {
    sharedMouse.current.x += (pointer.x - sharedMouse.current.x) * 0.08
    sharedMouse.current.y += (pointer.y - sharedMouse.current.y) * 0.08
    state.invalidate()
  })
  return null
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0">
      {inView && (
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={[1, 1.5]}
          frameloop="demand"
          className="!absolute inset-0 !pointer-events-none"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} />
          <spotLight position={[-5, 5, 5]} angle={0.5} penumbra={0.5} intensity={1.5} color="#38BDF8" />
          <spotLight position={[5, -5, 5]} angle={0.5} penumbra={0.5} intensity={1} color="#A78BFA" />
          <Environment preset="night" environmentIntensity={1.2} />
          <MouseTracker />
          <EffectComposer multisampling={2}>
            <Bloom
              luminanceThreshold={0.1}
              luminanceSmoothing={0.1}
              intensity={0.6}
              mipmapBlur
            />
            <ChromaticAberration
              offset={new Vector2(0.002, 0.002)}
              opacity={0.3}
            />
            <Vignette
              offset={0.3}
              darkness={0.6}
            />
          </EffectComposer>
          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <Particles count={250} />
          </Float>
          <Logo3D />
        </Canvas>
      )}
    </div>
  )
}
