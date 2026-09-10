import { cn } from "@/lib/utils"
import type { SectionHeadingProps } from "@/features/landing/types"

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl space-y-4 lg:mb-12",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-slate-600 lg:text-lg">{description}</p>
      ) : null}
    </div>
  )
}
