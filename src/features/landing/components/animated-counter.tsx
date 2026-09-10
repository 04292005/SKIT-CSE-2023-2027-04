"use client"

import { GlassPanel } from "@/components/common/glass-panel"
import { useAnimatedCounter } from "@/features/landing/hooks"
import type { AnimatedCounterProps } from "@/features/landing/types"

export function AnimatedCounter({
  value,
  suffix = "",
  label,
  active,
}: AnimatedCounterProps) {
  const count = useAnimatedCounter(value, active)

  return (
    <GlassPanel className="h-full rounded-3xl border-slate-200 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
      <p
        className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
        aria-live="polite"
      >
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
    </GlassPanel>
  )
}
