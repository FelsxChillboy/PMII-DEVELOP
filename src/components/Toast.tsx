"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  show: boolean
  type?: "success" | "error"
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({
  show,
  type = "success",
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    clearTimer()
    setTimeout(onClose, 300)
  }, [onClose, clearTimer])

  useEffect(() => {
    if (show) {
      setVisible(true)
      clearTimer()
      timerRef.current = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, duration)
    }
    return () => clearTimer()
  }, [show, duration, onClose, clearTimer])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
          className={cn(
            "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg max-w-sm",
            type === "success"
              ? "bg-accent/10 border-accent/30 text-accent"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          )}
        >
          {type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={handleClose}
            className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
