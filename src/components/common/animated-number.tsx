"use client"

import { useReducedMotion } from "framer-motion"

import { useAnimatedCounter } from "@/features/landing/hooks/use-animated-counter"
import { cn } from "@/lib/utils"

type AnimatedNumberProps = {
  value: number
  suffix?: string
  className?: string
}

export function AnimatedNumber({
  value,
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const prefersReducedMotion = useReducedMotion()
  const animatedValue = useAnimatedCounter(value, true, 700)
  const displayedValue = prefersReducedMotion ? value : animatedValue

  return (
    <span className={cn(className)} aria-label={`${value}${suffix}`}>
      {displayedValue.toLocaleString()}
      {suffix}
    </span>
  )
}
