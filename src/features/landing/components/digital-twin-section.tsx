"use client"

import { motion } from "framer-motion"

import { useTranslation } from "react-i18next"
import { DIGITAL_TWIN } from "@/features/landing/constants"
import { useInViewAnimation, useReducedMotionPreference } from "@/features/landing/hooks"
import { staggerContainer } from "@/features/landing/utils"

import { ScoreCard } from "./score-card"
import { SectionContainer, SectionShell } from "./section-shell"
import { SectionHeading } from "./section-heading"

export function DigitalTwinSection() {
  const { t } = useTranslation()
  const { ref, isInView } = useInViewAnimation()
  const prefersReducedMotion = useReducedMotionPreference()
  const headingId = "digital-twin-heading"

  return (
    <SectionShell
      id={DIGITAL_TWIN.id}
      ariaLabelledby={headingId}
      
     variant="teal">
      <SectionContainer ref={ref}>
        <SectionHeading
          id={headingId}
          eyebrow={t("landing.twin.eyebrow")}
          title={t("landing.twin.title")}
          description={t("landing.twin.description")}
          align="center"
          className="mx-auto"
        />

        <p className="mx-auto mb-8 w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-center text-xs font-semibold text-amber-700">
          {t("landing.twin.demoLabel")}
        </p>

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {DIGITAL_TWIN.scores.map((score, index) => (
            <ScoreCard
              key={score.id}
              label={t(`landing.twin.scores.${score.id}.label`)}
              score={score.score}
              trend={t(`landing.twin.scores.${score.id}.trend`)}
              index={index}
            />
          ))}
        </motion.div>
      </SectionContainer>
    </SectionShell>
  )
}
