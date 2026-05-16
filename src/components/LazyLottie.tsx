"use client"

import dynamic from "next/dynamic"

const LottieShowcase = dynamic(() => import("@/components/LottieShowcase"), {
  ssr: false,
  loading: () => <div className="h-32 w-32 rounded-2xl bg-secondary animate-pulse" />,
})

interface LazyLottieProps {
  type: "pulse" | "heartbeat"
  className?: string
}

export default function LazyLottie({ type, className }: LazyLottieProps) {
  return <LottieShowcase type={type} className={className} />
}
