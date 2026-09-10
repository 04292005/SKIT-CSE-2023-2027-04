import { cn } from "@/lib/utils"
import type { TrustBadgeProps } from "@/types"

export function TrustBadge({ label, icon: Icon, className }: TrustBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md",
        className
      )}
    >
      <Icon className="size-3.5 text-emerald-600" aria-hidden />
      {label}
    </span>
  )
}
