"use client"

import { motion } from "framer-motion"

import { GlassPanel } from "@/components/common/glass-panel"
import { cn } from "@/lib/utils"
import type { TechCardProps } from "@/features/landing/types"
import { fadeInUp } from "@/features/landing/utils"

const categoryColors: Record<string, string> = {
  AI: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Backend: "border-indigo-200 bg-indigo-50/50 text-indigo-700",
  Maps: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Speech: "border-amber-200 bg-amber-50 text-amber-700",
  Translation: "border-violet-200 bg-violet-50 text-violet-700",
  Analytics: "border-rose-200 bg-rose-50 text-rose-700",
}

export function TechCard({
  icon: Icon,
  title,
  category,
  categoryLabel,
  description,
  index = 0,
}: TechCardProps) {
  const badgeClass = categoryColors[category] || "border-slate-200 bg-slate-50 text-slate-600"

  return (
    <motion.div variants={fadeInUp} transition={{ delay: index * 0.06 }}>
      <GlassPanel className="group h-full rounded-3xl border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-50/50 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white shadow-xs">
          <Icon className="size-5" aria-hidden />
        </div>
        <span className={cn("mb-3 inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", badgeClass)}>
          {categoryLabel}
        </span>
        <h3 className="mb-2 text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </GlassPanel>
    </motion.div>
  )
}
