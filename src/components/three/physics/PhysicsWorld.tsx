"use client"

import { Physics, type PhysicsProps } from "@react-three/rapier"
import { Ground } from "./Ground"

interface PhysicsWorldProps extends Partial<PhysicsProps> {
  children: React.ReactNode
  showGround?: boolean
}

export default function PhysicsWorld({
  children,
  showGround = true,
  ...props
}: PhysicsWorldProps) {
  return (
    <Physics
      gravity={[0, -9.81, 0]}
      colliders="hull"
      timeStep={1 / 60}
      {...props}
    >
      {showGround && <Ground />}
      {children}
    </Physics>
  )
}
