"use client"

import { useLottie } from "lottie-react"
import { cn } from "@/lib/utils"

interface LottieAnimationProps {
  animationData: unknown
  className?: string
  loop?: boolean
  autoplay?: boolean
  width?: number
  height?: number
}

export default function LottieAnimation({
  animationData,
  className,
  loop = true,
  autoplay = true,
  width = 200,
  height = 200,
}: LottieAnimationProps) {
  const { View } = useLottie({
    animationData: animationData as Record<string, unknown>,
    loop,
    autoplay,
  })

  return (
    <div className={cn(className)} style={{ width, height }}>
      {View}
    </div>
  )
}
