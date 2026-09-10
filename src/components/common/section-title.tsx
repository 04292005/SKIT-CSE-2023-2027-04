import { cn } from "@/lib/utils"
import type { SectionTitleProps } from "@/types"

export function SectionTitle({
  title,
  subtitle,
  description,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {subtitle ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
          {subtitle}
        </p>
      ) : null}

      <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
