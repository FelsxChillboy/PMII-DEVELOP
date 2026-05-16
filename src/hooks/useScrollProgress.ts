"use client"

import { useState, useEffect } from "react"
import { useScroll } from "framer-motion"

export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", setProgress)
    return () => unsubscribe()
  }, [scrollYProgress])

  return progress
}
