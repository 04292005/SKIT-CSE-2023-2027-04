"use client"

import { useTranslation } from "react-i18next"
import {
  BadgeAlert,
  Bot,
  Building2,
  Copyright,
  Scale,
  ShieldCheck,
} from "lucide-react"

import { InformationPage } from "@/components/common/information-page"

export default function TermsPage() {
  const { t } = useTranslation()

  const sections = [
    {
      title: t("terms.sections.acceptable_use.title", "Acceptable Use"),
      icon: ShieldCheck,
      description: t(
        "terms.sections.acceptable_use.description",
        "Use Community Hero only for lawful civic reporting and evaluation. Do not submit harassment, illegal material, intentionally false reports, malicious files, or content that violates another person’s privacy or safety."
      ),
    },
    {
      title: t("terms.sections.user_resp.title", "User Responsibilities"),
      icon: BadgeAlert,
      description: t(
        "terms.sections.user_resp.description",
        "You are responsible for the accuracy and appropriateness of the information you submit. Avoid including unnecessary personal or sensitive information, and confirm that you have permission to share selected media."
      ),
    },
    {
      title: t("terms.sections.ownership.title", "Content Ownership"),
      icon: Copyright,
      description: t(
        "terms.sections.ownership.description",
        "You retain ownership of content you create. By submitting a report, you permit the project to process that content as needed to analyze, display, route, and demonstrate the civic reporting workflow."
      ),
    },
    {
      title: t("terms.sections.disclaimer.title", "AI Assistance Disclaimer"),
      icon: Bot,
      description: t(
        "terms.sections.disclaimer.description",
        "AI output can be incomplete or incorrect. Categories, summaries, confidence values, priorities, translations, and recommendations are assistive signals and should be reviewed by people before consequential action is taken."
      ),
    },
    {
      title: t("terms.sections.notice.title", "Municipal Demonstration Notice"),
      icon: Building2,
      description: t(
        "terms.sections.notice.description",
        "Community Hero is a solution-challenge project and civic workflow demonstration. Unless a participating authority explicitly states otherwise, submitting a report here does not replace an official emergency or municipal reporting channel."
      ),
      items: [
        t("terms.sections.notice.item1", "Do not use Community Hero for emergencies."),
        t("terms.sections.notice.item2", "Use local emergency services when immediate safety is at risk."),
        t("terms.sections.notice.item3", "Demo metrics, forecasts, and community health indicators are illustrative where labelled."),
      ] as const,
    },
    {
      title: t("terms.sections.liability.title", "Limitation of Liability"),
      icon: Scale,
      description: t(
        "terms.sections.liability.description",
        "The project is provided for demonstration and evaluation without a guarantee of uninterrupted availability, municipal response, issue resolution, or AI accuracy. Applicable legal rights and responsibilities may vary by jurisdiction."
      ),
    },
  ] as const

  return (
    <InformationPage
      eyebrow={t("terms.eyebrow", "Project terms")}
      title={t("terms.title", "Terms of Service")}
      description={t(
        "terms.description",
        "Practical terms for responsible use of the Community Hero demonstration and its AI-assisted reporting workflow."
      )}
      updated={t("terms.updated", "28 June 2026")}
      sections={sections}
    />
  )
}
