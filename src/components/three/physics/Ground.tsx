"use client"

import { RigidBody } from "@react-three/rapier"

export function Ground() {
  return (
    <RigidBody type="fixed" colliders="hull">
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  )
}
