"use client"

import { BrainCircuit, ShieldCheck, Languages, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

import { GlassPanel } from "@/components/common/glass-panel"
import { useInViewAnimation, useReducedMotionPreference } from "@/features/landing/hooks"
import { fadeInUp, staggerContainer } from "@/features/landing/utils"

import { SectionContainer, SectionShell } from "./section-shell"

export function FinalCtaSection() {
  const { ref, isInView } = useInViewAnimation()
  const prefersReducedMotion = useReducedMotionPreference()
  const { t } = useTranslation()
  const headingId = "credibility-heading"

  const highlights = [
    {
      id: "ai",
      icon: BrainCircuit,
      title: t("landing.credibility.cards.ai.title", "AI-Assisted Reporting"),
      desc: t("landing.credibility.cards.ai.desc", "Instantly categorizes, summarizes, and prioritizes reports with vision, location, and speech analysis."),
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      id: "tracking",
      icon: ShieldCheck,
      title: t("landing.credibility.cards.tracking.title", "Transparent Tracking"),
      desc: t("landing.credibility.cards.tracking.desc", "Keeps residents and officials updated in real time through structured progress timelines."),
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      id: "i18n",
      icon: Languages,
      title: t("landing.credibility.cards.i18n.title", "Multilingual Accessibility"),
      desc: t("landing.credibility.cards.i18n.desc", "Translates the interface into 8 regional languages with integrated Speech-to-Text inputs."),
      color: "text-cyan-600 bg-cyan-50 border-cyan-100",
    },
    {
      id: "verification",
      icon: Users,
      title: t("landing.credibility.cards.verification.title", "Community Verification"),
      desc: t("landing.credibility.cards.verification.desc", "Builds municipal trust through verified local coordinates and multi-neighbor confirmations."),
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ]

  return (
    <SectionShell
      id="credibility-showcase"
      ariaLabelledby={headingId}
      variant="default"
    >
      <SectionContainer ref={ref}>
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-10 lg:mb-12"
        >
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl"
          >
            {t("landing.credibility.title", "Built for Transparent Civic Collaboration")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 lg:text-lg">
            {t("landing.credibility.description", "Community Hero demonstrates how AI-assisted workflows, multilingual accessibility, and transparent reporting can strengthen collaboration between citizens and local authorities.")}
          </p>
        </motion.div>

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                transition={{ delay: index * 0.05 }}
              >
                <GlassPanel className="h-full rounded-3xl border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 flex flex-col items-start text-left">
                  <div className={`mb-4 flex size-11 items-center justify-center rounded-2xl border ${item.color}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </GlassPanel>
              </motion.div>
            )
          })}
        </motion.div>
      </SectionContainer>
    </SectionShell>
  )
}
