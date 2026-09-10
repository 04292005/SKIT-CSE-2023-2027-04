"use client"

import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

import { GlassPanel } from "@/components/common/glass-panel"
import { cn } from "@/lib/utils"
import { LIVE_TRACKING } from "@/features/landing/constants"
import { useInViewAnimation, useReducedMotionPreference } from "@/features/landing/hooks"
import { fadeInUp } from "@/features/landing/utils"

import { SectionContainer, SectionShell } from "./section-shell"
import { SectionHeading } from "./section-heading"

export function LiveTrackingSection() {
  const { t } = useTranslation()
  const { ref, isInView } = useInViewAnimation()
  const prefersReducedMotion = useReducedMotionPreference()
  const headingId = "live-tracking-heading"
  const { issue } = LIVE_TRACKING

  return (
    <SectionShell
      id={LIVE_TRACKING.id}
      ariaLabelledby={headingId}
      variant="default"
    >
      <SectionContainer ref={ref}>
        <SectionHeading
          id={headingId}
          eyebrow={t("landing.live_tracking.eyebrow")}
          title={t("landing.live_tracking.title")}
          description={t("landing.live_tracking.description")}
        />

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <GlassPanel className="overflow-hidden rounded-3xl border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 lg:p-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {t("landing.live_tracking.sampleLabel")}
                </span>
                <h3 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
                  {t("landing.live_tracking.issue.category")}
                </h3>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300">
                {t("landing.live_tracking.issue.ward")}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {t("landing.live_tracking.labels.progress")}
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {issue.progress}%
                  </span>
                </div>
                <div
                  className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  role="progressbar"
                  aria-valuenow={issue.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Issue resolution progress"
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: `${issue.progress}%` } : { width: "0%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardField label={t("landing.live_tracking.labels.engineerStatus")} value={t("landing.live_tracking.issue.engineerStatus")} />
                <DashboardField label={t("landing.live_tracking.labels.eta")} value={t("landing.live_tracking.issue.eta")} />
                <DashboardField
                  label={t("landing.live_tracking.labels.verification")}
                  value={t("landing.live_tracking.issue.verification")}
                  className="sm:col-span-2 lg:col-span-1"
                />
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </SectionContainer>
    </SectionShell>
  )
}

function DashboardField({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  )
}
