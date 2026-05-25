"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

interface GradientBorderProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  borderWidth?: number
  duration?: number
}

export function GradientBorder({
  children,
  className,
  containerClassName,
  borderWidth = 2,
  duration = 6,
}: GradientBorderProps) {
  return (
    <div className={cn("relative p-[1px] rounded-xl", containerClassName)}>
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: `conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), transparent, hsl(var(--primary)))`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className="absolute rounded-xl"
        style={{
          inset: borderWidth,
          background: "hsl(var(--background))",
        }}
      />
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  )
}

interface AnimatedGridProps {
  className?: string
  color?: string
  dotSize?: number
  spacing?: number
}

export function AnimatedGrid({
  className,
  dotSize = 1,
  spacing = 24,
}: AnimatedGridProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-0", className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid-dots"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={spacing / 2} cy={spacing / 2} r={dotSize} fill="hsl(var(--primary) / 0.15)" />
          </pattern>
          <linearGradient id="grid-fade-top" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="1" />
            <stop offset="30%" stopColor="hsl(var(--background))" stopOpacity="0" />
            <stop offset="70%" stopColor="hsl(var(--background))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-dots)" />
        <rect width="100%" height="100%" fill="url(#grid-fade-top)" />
      </svg>
    </div>
  )
}

interface GlowButtonProps {
  children: ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export function GlowButton({
  children,
  className,
  onClick,
  type = "button",
}: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold overflow-hidden",
        "bg-primary text-primary-foreground",
        "transition-all duration-300",
        className
      )}
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(60% 60% at center, hsl(var(--primary) / 0.5), transparent)`,
        }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

interface ShimmerButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function ShimmerButton({
  children,
  className,
  onClick,
}: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{
          transform: "translateX(-100%)",
          animation: "shimmer-slide 2s infinite",
        }}
      />
      <span className="relative z-10">{children}</span>
      <style>{`
        @keyframes shimmer-slide {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  )
}
