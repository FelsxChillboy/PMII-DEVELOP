"use client"

import { createContext, useContext, type RefObject } from "react"
import type Lenis from "lenis"
import { useLenis } from "@/hooks/useLenis"

const LenisContext = createContext<RefObject<Lenis | null> | null>(null)

export function useLenisInstance() {
  const ctx = useContext(LenisContext)
  if (!ctx) throw new Error("useLenisInstance must be used within <LenisProvider>")
  return ctx
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useLenis()

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  )
}
