"use client"

import { motion } from "framer-motion"

import { GlassPanel } from "@/components/common/glass-panel"
import { cn } from "@/lib/utils"
import type { ScoreCardProps } from "@/features/landing/types"
import { fadeInUp } from "@/features/landing/utils"

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600"
  if (score >= 70) return "text-teal-600"
  return "text-amber-600"
}

function scoreRingColor(score: number) {
  if (score >= 80) return "stroke-emerald-500"
  if (score >= 70) return "stroke-teal-500"
  return "stroke-amber-500"
}

export function ScoreCard({ label, score, trend, index = 0 }: ScoreCardProps) {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div variants={fadeInUp} transition={{ delay: index * 0.06 }}>
      <GlassPanel className="flex h-full flex-col items-center rounded-3xl border-slate-200 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
        <div className="relative mb-4 size-24">
          <svg
            className="size-full -rotate-90"
            viewBox="0 0 80 80"
            aria-hidden
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              className="stroke-slate-100"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              className={cn(scoreRingColor(score), "transition-all duration-700")}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center text-2xl font-semibold",
              scoreColor(score)
            )}
          >
            {score}
          </span>
        </div>
        <h3 className="text-base font-semibold text-slate-900">{label}</h3>
        <p className="mt-1 text-xs text-slate-500">{trend}</p>
      </GlassPanel>
    </motion.div>
  )
}
