"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export default function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const words = children.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

   const child = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -60,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 18,
        stiffness: 100,
      },
    },
  }

  return (
    <p ref={ref} className={cn("inline-block", className)}>
      <motion.span
        className="inline-flex flex-wrap gap-x-[0.25em] gap-y-1"
        variants={container}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={child}
            className="inline-block"
            style={{ perspective: 800, transformStyle: "preserve-3d" }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </p>
  )
}

export function TypewriterText({ children, speed = 50, className }: { children: string; speed?: number; className?: string }) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasStarted.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          let i = 0
          const interval = setInterval(() => {
            if (i <= children.length) {
              setDisplayText(children.slice(0, i))
              i++
            } else {
              setIsComplete(true)
              clearInterval(interval)
            }
          }, speed)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [children, speed])

  return (
    <span ref={ref} className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: isComplete ? Infinity : 0, duration: 0.8 }}
        className="inline-block w-[0.1em] h-[1em] bg-primary ml-0.5 translate-y-[0.15em]"
      />
    </span>
  )
}
