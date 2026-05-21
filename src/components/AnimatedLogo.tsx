"use client"

import Image from "next/image"

interface AnimatedLogoProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  invert?: boolean
}

export default function AnimatedLogo({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  invert = false,
}: AnimatedLogoProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 ${invert ? "brightness-0 invert" : ""} ${className}`}
        priority={priority}
      />
    </div>
  )
}

