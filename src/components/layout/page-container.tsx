import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageContainerProps = {
  children: ReactNode
  className?: string
  as?: "div" | "main" | "section"
  size?: "default" | "narrow" | "wide"
}

const sizeClasses = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
} as const

export function PageContainer({
  children,
  className,
  as: Component = "main",
  size = "default",
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full flex-1 px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:py-24 lg:px-8 lg:py-14",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  )
}
