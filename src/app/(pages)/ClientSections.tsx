"use client"

import dynamic from "next/dynamic"

export const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0F172A] animate-pulse" />,
})

export const Interactive3DSection = dynamic(
  () => import("@/components/Interactive3DSection"),
  { ssr: false, loading: () => null }
)
