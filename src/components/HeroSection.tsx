"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Award } from "lucide-react"

function Particles({ count = 60 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      dummy.position.set(
        positions[i3] + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.5,
        positions[i3 + 1] + Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.5,
        positions[i3 + 2]
      )
      dummy.rotation.set(
        state.clock.elapsedTime * 0.1 + i,
        state.clock.elapsedTime * 0.15 + i,
        0
      )
      dummy.scale.setScalar(0.5 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.3)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial
        color="#38BDF8"
        transparent
        opacity={0.6}
        wireframe
      />
    </instancedMesh>
  )
}

function HeroCanvas() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 60 }}
      className="!absolute inset-0 !pointer-events-none"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Particles count={80} />
      </Float>
    </Canvas>
  )
}

const STATS = [
  { icon: Users, value: "50+", label: "Kader Aktif" },
  { icon: Calendar, value: "20+", label: "Kegiatan/Tahun" },
  { icon: Award, value: "5+", label: "Tahun Berdiri" },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0F172A]">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />

      <HeroCanvas />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary font-medium mb-6">
            <span className="h-px w-8 bg-primary" />
            PERGERAKAN MAHASISWA ISLAM INDONESIA
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            PR PMII <br className="hidden sm:block" />
            <span className="text-primary">Rayon Teknik</span> <br className="hidden sm:block" />
            UNUSIA Jakpus
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
            Membangun kader intelektual organik yang berintegritas melalui
            persilangan nilai pergerakan dan presisi teknik di era digital.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/tentang"
              className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors gap-2"
            >
              Bergabung Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/kegiatan"
              className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors"
            >
              Lihat Kegiatan
            </Link>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <stat.icon className="h-5 w-5 text-primary mb-2" />
              <p className="font-heading text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
