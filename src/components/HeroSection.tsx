"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, useCursor } from "@react-three/drei"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import * as THREE from "three"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Award } from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import AnimatedCounter from "@/components/AnimatedCounter"

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generatePositions(count: number) {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (seededRandom(i * 1) - 0.5) * 20
    pos[i * 3 + 1] = (seededRandom(i * 2 + 1) - 0.5) * 20
    pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 10 - 5
  }
  return pos
}

function Particles({ count = 60 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummyRef = useRef(new THREE.Object3D())

  const positions = useMemo(() => generatePositions(count), [count])

  useFrame((state) => {
    if (!mesh.current) return
    const dummy = dummyRef.current
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      dummy.position.set(
        positions[i3] + Math.sin(t * 0.3 + i) * 0.5,
        positions[i3 + 1] + Math.cos(t * 0.2 + i) * 0.5,
        positions[i3 + 2]
      )
      dummy.rotation.set(t * 0.1 + i, t * 0.15 + i, 0)
      dummy.scale.setScalar(0.5 + Math.sin(t * 0.5 + i) * 0.3)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} wireframe />
    </instancedMesh>
  )
}

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.4
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, -3]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <icosahedronGeometry args={[0.8, 2]} />
      <MeshDistortMaterial
        color={hovered ? "#FBBF24" : "#38BDF8"}
        speed={3}
        distort={hovered ? 0.5 : 0.15}
        radius={1}
      />
    </mesh>
  )
}

function HeroCanvas() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.5]}
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
      <FloatingOrb />
    </Canvas>
  )
}

const STATS = [
  { icon: Users, value: 50, suffix: "+", label: "Kader Aktif" },
  { icon: Calendar, value: 20, suffix: "+", label: "Kegiatan/Tahun" },
  { icon: Award, value: 5, suffix: "+", label: "Tahun Berdiri" },
]

export default function HeroSection() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const bgY = useSpring(rawY, { stiffness: 100, damping: 30 })

  const rawOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 30 })

  useGSAP(() => {
    if (reducedMotion) return
    const title = titleRef.current
    if (!title) return
    const chars = title.querySelectorAll(".reveal-char")
    gsap.from(chars, {
      y: 120,
      opacity: 0,
      rotateX: -90,
      stagger: 0.04,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.3,
    })
  }, [reducedMotion])

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity: reducedMotion ? 1 : opacity }}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0F172A]"
    >
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          y: reducedMotion ? 0 : bgY,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />

      <HeroCanvas />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary font-medium mb-6"
          >
            <span className="h-px w-8 bg-primary" />
            PERGERAKAN MAHASISWA ISLAM INDONESIA
          </motion.div>

          <h1
            ref={titleRef}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6 perspective-1000"
          >
            {"PR PMII Rayon Teknik UNUSIA Jakpus".split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
                <span className="reveal-char inline-block">{word}</span>
              </span>
            ))}
            <br className="hidden sm:block" />
            <span className="text-primary">
              {"Membangun Peradaban Digital".split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
                  <span className="reveal-char inline-block">{word}</span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base sm:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed"
          >
            Membangun kader intelektual organik yang berintegritas melalui
            persilangan nilai pergerakan dan presisi teknik di era digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="/tentang"
              className="group relative inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Bergabung Sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/kegiatan"
              className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-all"
            >
              Lihat Kegiatan
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 sm:mt-20 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="group">
              <stat.icon className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-heading text-2xl sm:text-3xl font-bold text-white">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
