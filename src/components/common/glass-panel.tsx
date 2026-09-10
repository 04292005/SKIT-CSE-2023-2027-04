import { cn } from "@/lib/utils"
import type { GlassPanelProps } from "@/types"

export function GlassPanel({
  children,
  className,
  as: Component = "div",
}: GlassPanelProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-white/60 bg-white/55 shadow-[0_8px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </Component>
  )
}
