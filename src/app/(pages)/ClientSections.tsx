"use client"

import dynamic from "next/dynamic"

export const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0F172A] animate-pulse" />,
})

