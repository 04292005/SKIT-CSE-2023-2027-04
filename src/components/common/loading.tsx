import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { LoadingProps } from "@/types"

export function Loading({
  label = "Loading",
  fullPage = false,
  className,
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        fullPage && "min-h-[50vh]",
        className
      )}
    >
      <Spinner className="size-8 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
