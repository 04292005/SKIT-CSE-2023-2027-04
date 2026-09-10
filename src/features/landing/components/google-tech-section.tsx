"use client"

import { motion } from "framer-motion"

import { useTranslation } from "react-i18next"
import { GOOGLE_TECH } from "@/features/landing/constants"
import { useInViewAnimation, useReducedMotionPreference } from "@/features/landing/hooks"
import { staggerContainer } from "@/features/landing/utils"

import { SectionContainer, SectionShell } from "./section-shell"
import { SectionHeading } from "./section-heading"
import { TechCard } from "./tech-card"

export function GoogleTechSection() {
  const { t } = useTranslation()
  const { ref, isInView } = useInViewAnimation()
  const prefersReducedMotion = useReducedMotionPreference()
  const headingId = "google-tech-heading"

  return (
    <SectionShell
      id={GOOGLE_TECH.id}
      ariaLabelledby={headingId}
      variant="gradient"
    >
      <SectionContainer ref={ref}>
        <SectionHeading
          id={headingId}
          eyebrow={t("landing.google.eyebrow")}
          title={t("landing.google.title")}
          description={t("landing.google.description")}
          align="center"
          className="mx-auto"
        />

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {GOOGLE_TECH.technologies.map((tech, index) => (
            <TechCard
              key={tech.id}
              icon={tech.icon}
              title={t(`landing.google.technologies.${tech.id}.title`)}
              category={tech.category}
              categoryLabel={t(`landing.google.technologies.${tech.id}.category`)}
              description={t(`landing.google.technologies.${tech.id}.description`)}
              index={index}
            />
          ))}
        </motion.div>
      </SectionContainer>
    </SectionShell>
  )
}
