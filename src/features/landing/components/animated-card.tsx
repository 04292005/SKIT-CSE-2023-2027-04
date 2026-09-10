"use client"

import { motion } from "framer-motion"

import { GlassPanel } from "@/components/common/glass-panel"
import { cn } from "@/lib/utils"
import type { AnimatedCardProps } from "@/features/landing/types"
import { fadeInUp } from "@/features/landing/utils"

export function AnimatedCard({
  icon: Icon,
  title,
  description,
  index = 0,
  className,
}: AnimatedCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      transition={{ delay: index * 0.08 }}
    >
      <GlassPanel
        className={cn(
          "group h-full rounded-3xl border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8",
          className
        )}
      >
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
          <Icon className="size-5" aria-hidden />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>
      </GlassPanel>
    </motion.div>
  )
}
