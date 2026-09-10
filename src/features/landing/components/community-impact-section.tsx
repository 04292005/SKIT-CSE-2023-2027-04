"use client"

import { motion } from "framer-motion"

import { useTranslation } from "react-i18next"
import { COMMUNITY_IMPACT } from "@/features/landing/constants"
import { useInViewAnimation, useReducedMotionPreference } from "@/features/landing/hooks"
import { staggerContainer } from "@/features/landing/utils"

import { AnimatedCounter } from "./animated-counter"
import { SectionContainer, SectionShell } from "./section-shell"
import { SectionHeading } from "./section-heading"

export function CommunityImpactSection() {
  const { t } = useTranslation()
  const { ref, isInView } = useInViewAnimation()
  const prefersReducedMotion = useReducedMotionPreference()
  const headingId = "community-impact-heading"
  const active = isInView || Boolean(prefersReducedMotion)

  return (
    <SectionShell
      id={COMMUNITY_IMPACT.id}
      ariaLabelledby={headingId}
      
     variant="indigo">
      <SectionContainer ref={ref}>
        <SectionHeading
          id={headingId}
          eyebrow={t("landing.impact.eyebrow")}
          title={t("landing.impact.title")}
          description={t("landing.impact.description")}
          align="center"
          className="mx-auto"
        />

        <p className="mx-auto mb-8 w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-center text-xs font-semibold text-amber-700">
          {t("landing.impact.demoLabel")}
        </p>

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={active ? "visible" : "hidden"}
          variants={staggerContainer}
          role="list"
          aria-label="Community impact statistics"
        >
          {COMMUNITY_IMPACT.stats.map((stat) => (
            <div key={stat.id} role="listitem">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                label={t(`landing.impact.stats.${stat.id}.label`)}
                active={active}
              />
            </div>
          ))}
        </motion.div>
      </SectionContainer>
    </SectionShell>
  )
}
