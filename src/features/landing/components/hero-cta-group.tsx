import Link from "next/link"
import { ArrowRight, Map } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HeroCtaGroupProps } from "@/features/landing/types"

export function HeroCtaGroup({ primary, secondary, className }: HeroCtaGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
        className
      )}
    >
      <Button
        asChild
        size="lg"
        className="h-12 rounded-2xl px-6 text-base shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <Link href={primary.href}>
          {primary.label}
          <ArrowRight className="size-4" />
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-12 px-6 text-base rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <Link href={secondary.href}>
          <Map className="size-4" />
          {secondary.label}
        </Link>
      </Button>
    </div>
  )
}
