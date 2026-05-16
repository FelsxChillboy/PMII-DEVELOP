"use client"

import { useEffect } from "react"

export default function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.onupdatefound = () => {
            const installing = reg.installing
            if (installing) {
              installing.onstatechange = () => {
                if (installing.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("PWA update available — refresh to update")
                }
              }
            }
          }
        })
        .catch((err) => {
          console.warn("Service worker registration failed:", err)
        })
    }
  }, [])

  return null
}
