"use client"

import { motion } from "framer-motion"

import { GlassPanel } from "@/components/common/glass-panel"
import { TrustBadge } from "@/components/common/trust-badge"
import { HERO, HERO_TRUST_BADGES } from "@/features/landing/constants"
import { useReducedMotionPreference } from "@/features/landing/hooks"
import type { HeroSectionProps } from "@/features/landing/types"
import { fadeInUp, staggerContainer } from "@/features/landing/utils"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

import { HeroBackground } from "./hero-background"
import { HeroCtaGroup } from "./hero-cta-group"

export function HeroSection({ className }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const { t } = useTranslation()

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: staggerContainer,
      }

  const childMotionProps = prefersReducedMotion ? {} : { variants: fadeInUp }

  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/40",
        className
      )}
    >
      <HeroBackground />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <motion.div className="mx-auto max-w-4xl" {...motionProps}>
          <motion.div {...childMotionProps}>
            <GlassPanel className="mb-6 inline-flex items-center gap-2 px-4 py-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-slate-600">
                {t("landing.hero.eyebrow")}
              </span>
            </GlassPanel>
          </motion.div>

          <motion.p
            {...childMotionProps}
            className="mb-4 text-base font-medium tracking-tight text-emerald-700 sm:text-lg"
          >
            {t("landing.hero.tagline")}
          </motion.p>

          <motion.h1
            id="hero-heading"
            {...childMotionProps}
            className="text-5xl font-semibold tracking-tight text-slate-900 lg:text-6xl lg:leading-[1.08]"
          >
            {t("landing.hero.headline.before")}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {t("landing.hero.headline.highlight")}
            </span>
          </motion.h1>

          <motion.p
            {...childMotionProps}
            className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            {t("landing.hero.description")}
          </motion.p>

          <motion.div {...childMotionProps} className="mt-8">
            <HeroCtaGroup
              primary={{ ...HERO.ctas.primary, label: t("landing.hero.ctas.primary") }}
              secondary={{ ...HERO.ctas.secondary, label: t("landing.hero.ctas.secondary") }}
            />
          </motion.div>

          <motion.div
            {...childMotionProps}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {HERO_TRUST_BADGES.map((badge) => (
              <TrustBadge
                key={badge.id}
                label={t(`landing.hero.trust_badges.${badge.id}`)}
                icon={badge.icon}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
