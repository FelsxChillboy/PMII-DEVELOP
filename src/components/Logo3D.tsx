"use client"

import { useRef, useMemo, useState } from "react"
import { useLoader, useFrame } from "@react-three/fiber"
import { SVGLoader, SVGResultPaths } from "three/examples/jsm/loaders/SVGLoader.js"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { MeshTransmissionMaterial, useCursor } from "@react-three/drei"
import { Color, Vector2, Vector3, Mesh, BufferGeometry, ExtrudeGeometry, Float32BufferAttribute } from "three"

function getColor(path: SVGResultPaths): Color {
  if (path.color) return path.color
  const fill = path.userData?.style?.fill
  if (fill && fill !== "none") {
    try {
      return new Color(fill)
    } catch {
      return new Color("#38BDF8")
    }
  }
  return new Color("#38BDF8")
}

function Logo3D({ mouse }: { mouse?: React.MutableRefObject<Vector2> }) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const targetPos = useRef(new Vector3(0, 0, -3))
  useCursor(hovered)

  const svgData = useLoader(SVGLoader, "/Logo-rayon.svg")

  const { geometry, scale } = useMemo(() => {
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    const geoms: BufferGeometry[] = []

    svgData.paths.forEach((path) => {
      const fillColor = getColor(path)
      const shapes = path.toShapes(true)

      shapes.forEach((shape) => {
        const points = shape.getPoints(50)
        points.forEach((p) => {
          if (p.x < minX) minX = p.x
          if (p.x > maxX) maxX = p.x
          if (p.y < minY) minY = p.y
          if (p.y > maxY) maxY = p.y
        })

        const geom = new ExtrudeGeometry(shape, {
          depth: 0.15,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.015,
          bevelSegments: 3,
        })

        const pos = geom.getAttribute("position")
        for (let i = 0; i < pos.count; i++) {
          pos.array[i * 3 + 1] = -pos.array[i * 3 + 1]
        }
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
    if (geoms.length === 1) {
      merged = geoms[0]
    } else {
      merged = mergeGeometries(geoms)
      geoms.forEach((g) => {
        if (g !== merged) g.dispose()
      })
    }

    merged.computeBoundingBox()
    merged.center()

    const w = maxX - minX || 1
    const h = maxY - minY || 1
    const s = 3.5 / Math.max(w, h)

    return { geometry: merged, scale: s }
  }, [svgData])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.15
    meshRef.current.rotation.y = t * 0.12

    if (mouse?.current) {
      targetPos.current.x = mouse.current.x * 1.2
      targetPos.current.y = mouse.current.y * 1.2
    }
    targetPos.current.y += Math.sin(t * 0.25) * 0.15

    meshRef.current.position.lerp(targetPos.current, 0.04)
  })

  if (!geometry) return null

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 0, -3]}
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <MeshTransmissionMaterial
        vertexColors
        transmission={0.65}
        thickness={0.2}
        roughness={0.15}
        metalness={0.05}
        ior={1.4}
        chromaticAberration={0.05}
        backside
        backsideThickness={0.15}
        samples={4}
        resolution={256}
        emissive={hovered ? "#FBBF24" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  )
}

export default Logo3D
