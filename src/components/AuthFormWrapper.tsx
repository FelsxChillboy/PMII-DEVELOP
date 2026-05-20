"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 20 },
  },
}

interface AuthFormWrapperProps {
  children: React.ReactNode
  className?: string
}

export function AuthFormWrapper({ children, className }: AuthFormWrapperProps) {
  const reducedMotion = useReducedMotion()
  const variants = reducedMotion ? undefined : containerVariants
  const itemVariant = reducedMotion ? undefined : itemVariants

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AuthFormItem({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return <>{children}</>

  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  )
}
