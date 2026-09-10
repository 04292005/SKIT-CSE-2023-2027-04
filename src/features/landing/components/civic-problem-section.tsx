"use client"

import { motion } from "framer-motion"

import { useTranslation } from "react-i18next"
import { CIVIC_PROBLEM } from "@/features/landing/constants"
import { useInViewAnimation, useReducedMotionPreference } from "@/features/landing/hooks"
import { staggerContainer } from "@/features/landing/utils"

import { AnimatedCard } from "./animated-card"
import { SectionContainer, SectionShell } from "./section-shell"
import { SectionHeading } from "./section-heading"

export function CivicProblemSection() {
  const { t } = useTranslation()
  const { ref, isInView } = useInViewAnimation()
  const prefersReducedMotion = useReducedMotionPreference()
  const headingId = "civic-problem-heading"

  return (
    <SectionShell
      id={CIVIC_PROBLEM.id}
      ariaLabelledby={headingId}
      
     variant="soft">
      <SectionContainer ref={ref}>
        <SectionHeading
          id={headingId}
          eyebrow={t("landing.problem.eyebrow")}
          title={t("landing.problem.title")}
          description={t("landing.problem.description")}
        />

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:gap-6"
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {CIVIC_PROBLEM.cards.map((card, index) => (
            <AnimatedCard
              key={card.id}
              icon={card.icon}
              title={t(`landing.problem.cards.${card.id}.title`)}
              description={t(`landing.problem.cards.${card.id}.description`)}
              index={index}
            />
          ))}
        </motion.div>
      </SectionContainer>
    </SectionShell>
  )
}
