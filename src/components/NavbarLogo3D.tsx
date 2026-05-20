"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { SVGLoader, SVGResultPaths } from "three/examples/jsm/loaders/SVGLoader.js"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { Color, Mesh, BufferGeometry, ExtrudeGeometry, Float32BufferAttribute } from "three"

function getColor(path: SVGResultPaths): Color {
  if (path.color) return path.color
  const fill = path.userData?.style?.fill
  if (fill && fill !== "none") {
    try { return new Color(fill) }
    catch { return new Color("#38BDF8") }
  }
  return new Color("#38BDF8")
}

function LogoMesh() {
  const meshRef = useRef<Mesh>(null!)
  const svgData = useLoader(SVGLoader, "/Logo-rayon.svg")

  const { geometry, scale } = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    const geoms: BufferGeometry[] = []

    svgData.paths.forEach((path) => {
      const fillColor = getColor(path)
      const shapes = path.toShapes(true)

      shapes.forEach((shape) => {
        const points = shape.getPoints(20)
        points.forEach((p) => {
          if (p.x < minX) minX = p.x
          if (p.x > maxX) maxX = p.x
          if (p.y < minY) minY = p.y
          if (p.y > maxY) maxY = p.y
        })

        const geom = new ExtrudeGeometry(shape, {
          depth: 0.08, bevelEnabled: true, bevelThickness: 0.015,
          bevelSize: 0.008, bevelSegments: 1,
        })

        const pos = geom.getAttribute("position")
        for (let i = 0; i < pos.count; i++) pos.array[i * 3 + 1] = -pos.array[i * 3 + 1]
        pos.needsUpdate = true
        geom.computeVertexNormals()

        const colors = new Float32Array(pos.count * 3)
        for (let i = 0; i < pos.count; i++) {
          colors[i * 3] = fillColor.r
          colors[i * 3 + 1] = fillColor.g
          colors[i * 3 + 2] = fillColor.b
        }
        geom.setAttribute("color", new Float32BufferAttribute(colors, 3))
        geoms.push(geom)
      })
    })

    if (geoms.length === 0) return { geometry: null, scale: 1 }

    let merged: BufferGeometry
    if (geoms.length === 1) { merged = geoms[0] }
    else { merged = mergeGeometries(geoms); geoms.forEach((g) => { if (g !== merged) g.dispose() }) }

    merged.computeBoundingBox()
    merged.center()

    const w = maxX - minX || 1, h = maxY - minY || 1
    return { geometry: merged, scale: 2.5 / Math.max(w, h) }
  }, [svgData])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.sin(t * 0.12) * 0.15
    meshRef.current.rotation.y = t * 0.3
    meshRef.current.rotation.z = Math.sin(t * 0.08) * 0.02
    state.invalidate()
  })

  if (!geometry) return null

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <meshPhysicalMaterial vertexColors roughness={0.25} metalness={0.05} clearcoat={0.2} />
    </mesh>
  )
}

export default function NavbarLogo3D({ className }: { className?: string }) {
  return (
    <div className={className} style={{ width: 36, height: 36 }}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.5], fov: 25, near: 0.1, far: 10 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <directionalLight position={[-2, -2, 2]} intensity={0.3} color="#38BDF8" />
        <Suspense fallback={null}>
          <LogoMesh />
        </Suspense>
      </Canvas>
    </div>
  )
}
