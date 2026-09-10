"use client"

import { motion } from "framer-motion"

import { useTranslation } from "react-i18next"
import { AGENT_PIPELINE } from "@/features/landing/constants"
import { useInViewAnimation, useReducedMotionPreference } from "@/features/landing/hooks"
import { staggerContainer } from "@/features/landing/utils"

import {
  AgentPipelineItem,
} from "./agent-pipeline-item"
import { SectionContainer, SectionShell } from "./section-shell"
import { SectionHeading } from "./section-heading"

export function AgentPipelineSection() {
  const { t } = useTranslation()
  const { ref, isInView } = useInViewAnimation()
  const prefersReducedMotion = useReducedMotionPreference()
  const headingId = "agent-pipeline-heading"

  return (
    <SectionShell
      id={AGENT_PIPELINE.id}
      ariaLabelledby={headingId}
      variant="emerald"
    >
      <SectionContainer ref={ref} className="pt-8 md:pt-10 lg:pt-12">
        <SectionHeading
          id={headingId}
          eyebrow={t("landing.agents.eyebrow")}
          title={t("landing.agents.title")}
          description={t("landing.agents.description")}
          align="center"
          className="mx-auto"
        />

        <div className="relative">
          <motion.ul
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={isInView || prefersReducedMotion ? "visible" : "hidden"}
            variants={staggerContainer}
            aria-label="AI agent pipeline"
          >
            {AGENT_PIPELINE.agents.map((agent, index) => (
              <AgentPipelineItem
                key={agent.id}
                icon={agent.icon}
                title={t(`landing.agents.list.${agent.id}.title`)}
                responsibility={t(`landing.agents.list.${agent.id}.responsibility`)}
                index={index}
                badge={"badge" in agent ? t("landing.agents.badges.future_enhancement", "Future Enhancement") : undefined}
              />
            ))}
          </motion.ul>
        </div>
      </SectionContainer>
    </SectionShell>
  )
}
