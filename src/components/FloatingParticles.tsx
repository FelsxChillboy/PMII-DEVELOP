"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import * as THREE from "three"
import { useTheme } from "next-themes"

interface ParticleData {
  radius: number
  xDist: number
  yDist: number
  zDist: number
  speed: number
}

function Particle({ radius, xDist, yDist, zDist, speed }: ParticleData) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  const scale = useMemo(() => 0.4 + Math.random() * 0.6, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * speed + offset
    meshRef.current.position.x = Math.sin(t) * xDist
    meshRef.current.position.y = Math.cos(t * 0.7) * yDist + Math.sin(t * 0.3) * 2
    meshRef.current.position.z = Math.cos(t) * zDist
    meshRef.current.rotation.x = t * 0.5
    meshRef.current.rotation.y = t * 0.3
  })

  return (
    <Sphere ref={meshRef} args={[radius * scale, 16, 16]}>
      <MeshDistortMaterial
        color="hsl(var(--primary))"
        opacity={0.25}
        transparent
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.3
    meshRef.current.rotation.y = t * 0.5
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color="hsl(var(--primary))"
          opacity={0.15}
          transparent
          distort={0.6}
          speed={3}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  )
}

function ParticlesScene() {
  const particles = useMemo(() => {
    const items: ParticleData[] = []
    for (let i = 0; i < 25; i++) {
      items.push({
        radius: 0.15 + Math.random() * 0.25,
        xDist: 2 + Math.random() * 4,
        yDist: 2 + Math.random() * 3,
        zDist: 1 + Math.random() * 3,
        speed: 0.3 + Math.random() * 0.5,
      })
    }
    return items
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="hsl(var(--primary))" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="hsl(var(--accent))" />
      <CentralOrb />
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function FloatingParticles({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className} />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className={`absolute inset-0 pointer-events-none ${className || ""}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
         <color attach="background" args={[isDark ? "#0a0f1a" : "#ffffff"]} />
        <ParticlesScene />
      </Canvas>
    </div>
  )
}
