"use client"

import { animated, useSpring } from "@react-spring/web"

interface AnimatedCounterProps {
  value: number
  currency?: boolean
  className?: string
}

export default function AnimatedCounter({
  value,
  currency = false,
  className,
}: AnimatedCounterProps) {
  const { number } = useSpring({
    number: value,
    from: { number: 0 },
    config: { mass: 1, tension: 120, friction: 14 },
  })

  return (
    <animated.span className={className}>
      {number.to((n) => {
        if (currency) {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(n)
        }
        return Math.round(n).toLocaleString("id-ID")
      })}
    </animated.span>
  )
}
