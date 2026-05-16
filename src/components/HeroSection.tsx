"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, MeshDistortMaterial, useCursor } from "@react-three/drei"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import * as THREE from "three"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Award } from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import AnimatedCounter from "@/components/AnimatedCounter"
import { duration, easing } from "@/lib/animation"

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

function Particles({ count = 60, mouse }: { count?: number; mouse?: React.MutableRefObject<THREE.Vector2> }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummyRef = useRef(new THREE.Object3D())

  const positions = useMemo(() => generatePositions(count), [count])

  useFrame((state) => {
    if (!mesh.current) return
    const dummy = dummyRef.current
    const t = state.clock.elapsedTime
    const mx = mouse?.current ? mouse.current.x * 0.3 : 0
    const my = mouse?.current ? mouse.current.y * 0.3 : 0
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      dummy.position.set(
        positions[i3] + Math.sin(t * 0.3 + i) * 0.5 + mx,
        positions[i3 + 1] + Math.cos(t * 0.2 + i) * 0.5 + my,
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

function FloatingOrb({ mouse }: { mouse?: React.MutableRefObject<THREE.Vector2> }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const targetPos = useRef(new THREE.Vector3(0, 0, -3))
  useCursor(hovered)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.3
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.5

    if (mouse?.current) {
      targetPos.current.x = mouse.current.x * 1.5
      targetPos.current.y = mouse.current.y * 1.5
    }
    targetPos.current.y += Math.sin(t * 0.4) * 0.2

    meshRef.current.position.lerp(targetPos.current, 0.05)
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

function MouseTracker({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const { pointer } = useThree()
  useFrame(() => {
    mouse.current.lerp(pointer, 0.05)
  })
  return null
}

function HeroCanvas({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
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
      <MouseTracker mouse={mouse} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Particles count={80} mouse={mouse} />
      </Float>
      <FloatingOrb mouse={mouse} />
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
  const mouse = useRef(new THREE.Vector2())

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const bgY = useSpring(rawY, { stiffness: 100, damping: 30 })

  const rawContentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentY = useSpring(rawContentY, { stiffness: 100, damping: 30 })

  const rawOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 30 })

  const rawParticleY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const particleY = useSpring(rawParticleY, { stiffness: 100, damping: 30 })

  const titleWords = ["PR PMII", "Rayon Teknik", "UNUSIA Jakpus"]
  const subtitleWords = "Membangun Peradaban Digital".split(" ")

  if (reducedMotion) {
    return (
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#0F172A]"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary font-medium mb-6">
              <span className="h-px w-8 bg-primary" />
              PERGERAKAN MAHASISWA ISLAM INDONESIA
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              PR PMII Rayon Teknik UNUSIA Jakpus
              <br />
              <span className="text-primary">Membangun Peradaban Digital</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
              Membangun kader intelektual organik yang berintegritas melalui
              persilangan nilai pergerakan dan presisi teknik di era digital.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/tentang"
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
              >
                Bergabung Sekarang
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/kegiatan"
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-white/20 text-white font-medium text-sm"
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
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0F172A]"
    >
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          y: bgY,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />

      <motion.div style={{ y: particleY }} className="absolute inset-0">
        <HeroCanvas mouse={mouse} />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: duration.normal, delay: 0.1, ease: easing.standard }}
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary font-medium mb-6"
          >
            <span className="h-px w-8 bg-primary" />
            PERGERAKAN MAHASISWA ISLAM INDONESIA
          </motion.div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            <motion.span
              className="inline-flex flex-wrap"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
              }}
            >
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block overflow-hidden mr-[0.25em]"
                  variants={{
                    hidden: { y: 120, opacity: 0, rotateX: -90 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      rotateX: 0,
                      transition: { type: "spring", stiffness: 120, damping: 18 },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
            <br className="hidden sm:block" />
            <span className="text-primary">
              <motion.span
                className="inline-flex flex-wrap"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.6 } },
                }}
              >
                {subtitleWords.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block overflow-hidden mr-[0.25em]"
                    variants={{
                      hidden: { y: 120, opacity: 0, rotateX: -90 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        transition: { type: "spring", stiffness: 120, damping: 18 },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.8, ease: easing.standard }}
            className="text-base sm:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed"
          >
            Membangun kader intelektual organik yang berintegritas melalui
            persilangan nilai pergerakan dan presisi teknik di era digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 1, ease: easing.standard }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
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
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              <Link
                href="/kegiatan"
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-all"
              >
                Lihat Kegiatan
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: duration.slow, ease: easing.standard }}
          className="mt-16 sm:mt-20 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              className="group"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <stat.icon className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-heading text-2xl sm:text-3xl font-bold text-white">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
