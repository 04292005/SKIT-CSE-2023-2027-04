"use client"

import { motion } from "framer-motion"

import { GlassPanel } from "@/components/common/glass-panel"
import { cn } from "@/lib/utils"
import type { AgentPipelineItemProps } from "@/features/landing/types"
import { fadeInUp } from "@/features/landing/utils"

export function AgentPipelineItem({
  icon: Icon,
  title,
  responsibility,
  index,
  badge,
}: Omit<AgentPipelineItemProps, "isLast">) {
  return (
    <motion.li
      variants={fadeInUp}
      transition={{ delay: index * 0.06 }}
      className="h-full"
    >
      <GlassPanel className="group flex h-full flex-col rounded-3xl border-slate-200 p-5 sm:p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-100">
            <Icon className="size-4.5" aria-hidden />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {badge ? (
          <span className="mt-3.5 w-fit rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
            {badge}
          </span>
        ) : null}

        <h3 className={cn("text-base font-semibold text-slate-900", badge ? "mt-2" : "mt-3.5")}>
          {title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
          {responsibility}
        </p>
      </GlassPanel>
    </motion.li>
  )
}

export function AgentPipelineConnector() {
  return (
    <div
      aria-hidden
      className="absolute left-8 right-8 top-7 hidden h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent lg:block"
      style={{ top: "1.75rem" }}
    />
  )
}
