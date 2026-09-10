import { forwardRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { SectionShellProps } from "@/features/landing/types"

const variantClasses = {
  default: "bg-white",
  soft: "bg-slate-50/50",
  emerald: "bg-emerald-50/20",
  indigo: "bg-indigo-50/20",
  teal: "bg-teal-50/20",
  gradient: "bg-gradient-to-b from-slate-50 via-white to-emerald-50/20",
} as const

export function SectionShell({
  id,
  ariaLabelledby,
  children,
  className,
  variant = "default",
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("relative overflow-hidden", variantClasses[variant], className)}
    >
      {children}
    </section>
  )
}

export const SectionContainer = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(function SectionContainer({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20",
        className
      )}
    >
      {children}
    </div>
  )
})
