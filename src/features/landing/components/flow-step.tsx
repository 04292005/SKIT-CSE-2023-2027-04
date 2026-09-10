"use client"

import { motion } from "framer-motion"

import { GlassPanel } from "@/components/common/glass-panel"
import { cn } from "@/lib/utils"
import type { FlowStepProps } from "@/features/landing/types"
import { fadeInUp } from "@/features/landing/utils"

export function FlowStep({ label, detail, index, isLast }: FlowStepProps) {
  return (
    <motion.div variants={fadeInUp} className="relative flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700">
          {index + 1}
        </div>
        {!isLast ? (
          <motion.div
            aria-hidden
            className="my-2 w-px flex-1 min-h-8 bg-gradient-to-b from-emerald-300 to-emerald-100 origin-top"
            initial={{ scaleY: 0 }}
            variants={{
              visible: { scaleY: 1, transition: { duration: 0.8, ease: "easeOut", delay: index * 0.1 + 0.2 } }
            }}
          />
        ) : null}
      </div>

      <GlassPanel
        className={cn(
          "mb-4 flex-1 rounded-3xl border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6",
          isLast && "mb-0"
        )}
      >
        <p className="text-base font-semibold text-slate-900 sm:text-lg">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base">
          {detail}
        </p>
      </GlassPanel>
    </motion.div>
  )
}
