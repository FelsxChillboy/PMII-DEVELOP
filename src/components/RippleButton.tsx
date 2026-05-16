"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface RippleButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
}

export default function RippleButton({ children, className, ...props }: RippleButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}
