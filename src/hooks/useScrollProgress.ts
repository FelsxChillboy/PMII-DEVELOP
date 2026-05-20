"use client"

import { useRef, useEffect } from "react"
import { useScroll } from "framer-motion"

export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  const progressRef = useRef(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => { progressRef.current = v })
    return () => unsubscribe()
  }, [scrollYProgress])

  return progressRef
}
