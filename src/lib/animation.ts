import type { Variants } from "framer-motion"

export const easing = {
  standard: [0.16, 1, 0.3, 1] as const,
  accelerate: [0.7, 0, 1, 0.5] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  springGentle: { type: "spring" as const, stiffness: 80, damping: 25 },
  springSnappy: { type: "spring" as const, stiffness: 300, damping: 30 },
}

export const duration = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  enter: 0.5,
  exit: 0.2,
}

const stdEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.normal, ease: stdEase },
    },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.normal, ease: stdEase },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: duration.normal },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 20 },
    },
  },
}