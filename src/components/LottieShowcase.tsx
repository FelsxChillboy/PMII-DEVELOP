"use client"

import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
  ssr: false,
  loading: () => (
    <div className="w-[120px] h-[120px] rounded-full bg-primary/10 animate-pulse" />
  ),
})

import pulseData from "@/components/lottie/pulse.json"
import heartbeatData from "@/components/lottie/heartbeat.json"

const ANIMATIONS = {
  pulse: { data: pulseData, label: "Semangat" },
  heartbeat: { data: heartbeatData, label: "Peduli" },
} as const

type AnimationKey = keyof typeof ANIMATIONS

interface LottieShowcaseProps {
  type?: AnimationKey
  className?: string
  size?: number
}

export default function LottieShowcase({
  type = "pulse",
  className,
  size = 120,
}: LottieShowcaseProps) {
  const anim = ANIMATIONS[type]

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <LottieAnimation
        animationData={anim.data}
        width={size}
        height={size}
      />
      <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
        {anim.label}
      </span>
    </div>
  )
}
