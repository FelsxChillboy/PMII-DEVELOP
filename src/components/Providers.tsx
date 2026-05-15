"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { ReactLenis } from "lenis/react"
import { Analytics } from "@vercel/analytics/react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export default function Providers({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ReactLenis
        root
        options={{
          duration: reducedMotion ? 0 : 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          infinite: false,
        }}
      >
        {children}
        <Analytics />
      </ReactLenis>
    </QueryClientProvider>
  )
}
