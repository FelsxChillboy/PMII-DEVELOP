"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // Agar tidak menghalangi klik pada UI HTML
        zIndex: 0,
      }}
    >
      <Suspense fallback={null}>
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}