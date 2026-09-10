import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export type HeroCta = {
  label: string
  href: string
}

export type HeroCtaGroupProps = {
  primary: HeroCta
  secondary: HeroCta
  className?: string
}

export type HeroSectionProps = {
  className?: string
}

export type SectionShellProps = {
  id?: string
  ariaLabelledby?: string
  children: ReactNode
  className?: string
  variant?: "default" | "soft" | "gradient" | "emerald" | "indigo" | "teal"
}

export type SectionHeadingProps = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export type AnimatedCardProps = {
  icon: LucideIcon
  title: string
  description: string
  index?: number
  className?: string
}

export type FlowStepProps = {
  label: string
  detail: string
  index: number
  isLast: boolean
}

export type AgentPipelineItemProps = {
  icon: LucideIcon
  title: string
  responsibility: string
  index: number
  isLast: boolean
  badge?: string
}

export type ScoreCardProps = {
  label: string
  score: number
  trend: string
  index?: number
}

export type TechCardProps = {
  icon: LucideIcon
  title: string
  category: string
  categoryLabel: string
  description: string
  index?: number
}

export type AnimatedCounterProps = {
  value: number
  suffix?: string
  label: string
  active: boolean
}

export type LandingPageProps = {
  className?: string
}
