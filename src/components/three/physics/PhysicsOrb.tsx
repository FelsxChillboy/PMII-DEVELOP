"use client"

import { useRef, useState, useCallback } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshDistortMaterial, useCursor } from "@react-three/drei"
import { RigidBody, type RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"

interface PhysicsOrbProps {
  position?: [number, number, number]
  color?: string
  hoverColor?: string
  size?: number
  geometry?: "icosahedron" | "octahedron" | "torus"
}

function getGeometry(type: PhysicsOrbProps["geometry"] = "icosahedron") {
  switch (type) {
    case "octahedron":
      return <octahedronGeometry args={[1, 0]} />
    case "torus":
      return <torusGeometry args={[0.7, 0.3, 16, 32]} />
    default:
      return <icosahedronGeometry args={[1, 1]} />
  }
}

export default function PhysicsOrb({
  position = [0, 3, 0],
  color = "#38BDF8",
  hoverColor = "#FBBF24",
  size = 1,
  geometry = "icosahedron",
}: PhysicsOrbProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const dragOffset = useRef(new THREE.Vector3())
  const worldPos = useRef(new THREE.Vector3())

  useCursor(hovered)

  const handlePointerDown = useCallback(
    (e: any) => {
      e.stopPropagation()
      setClicked((p) => !p)

      if (rigidBodyRef.current) {
        rigidBodyRef.current.applyImpulse(
          { x: 0, y: 5, z: 0 },
          true
        )
      }
    },
    []
  )

  const handlePointerEnter = useCallback(() => setHovered(true), [])
  const handlePointerLeave = useCallback(() => setHovered(false), [])

  useFrame((state) => {
    if (!meshRef.current) return

    if (!dragging) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }

    if (clicked && !dragging) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.08
      meshRef.current.scale.setScalar(scale)
    } else if (!clicked) {
      meshRef.current.scale.setScalar(1)
    }
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={position}
      restitution={0.5}
      friction={0.3}
      linearDamping={0.5}
      angularDamping={0.3}
      colliders="ball"
      scale={size}
    >
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {getGeometry(geometry)}
        <MeshDistortMaterial
          color={hovered ? hoverColor : clicked ? "#F87171" : color}
          speed={hovered ? 3 : 2}
          distort={hovered ? 0.5 : clicked ? 0.7 : 0.1}
          radius={1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </RigidBody>
  )
}
