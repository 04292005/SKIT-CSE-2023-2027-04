"use client"

import { useTranslation } from "react-i18next"
import {
  Cookie,
  Database,
  Image,
  LockKeyhole,
  Mail,
  MapPin,
  Mic,
  UserRound,
} from "lucide-react"

import { InformationPage } from "@/components/common/information-page"

export default function PrivacyPage() {
  const { t } = useTranslation()

  const sections = [
    {
      title: t("privacy.sections.data_collection.title", "Data Collection"),
      icon: UserRound,
      description: t(
        "privacy.sections.data_collection.description",
        "Community Hero collects the information needed to operate the civic reporting demonstration. This can include your Google account name, email address, report description, category, report status, and technical timestamps."
      ),
    },
    {
      title: t("privacy.sections.authentication.title", "Authentication"),
      icon: LockKeyhole,
      description: t(
        "privacy.sections.authentication.description",
        "Google sign-in is handled through Firebase Authentication. Community Hero uses your authenticated user identifier to associate reports with your account. Passwords are not collected or stored by this application."
      ),
    },
    {
      title: t("privacy.sections.firebase.title", "Firebase Usage"),
      icon: Database,
      description: t(
        "privacy.sections.firebase.description",
        "Firestore stores account-related profile information, submitted report details, AI analysis results, location details when provided, and report status history. Firebase services are configured by the project operator."
      ),
    },
    {
      title: t("privacy.sections.location.title", "Location Permissions"),
      icon: MapPin,
      description: t(
        "privacy.sections.location.description",
        "Location access is requested through your browser when you use reporting features. If granted, coordinates, accuracy, and a resolved address may be included with your report. You can deny or revoke location access in browser settings."
      ),
    },
    {
      title: t("privacy.sections.media.title", "Image and Video Selection"),
      icon: Image,
      description: t(
        "privacy.sections.media.description",
        "Media you select is used to request AI-assisted issue analysis. The current report record stores media type information and the resulting analysis; it does not store the original selected media file in Firestore."
      ),
    },
    {
      title: t("privacy.sections.voice.title", "Voice Interaction"),
      icon: Mic,
      description: t(
        "privacy.sections.voice.description",
        "Speech-to-Text and Text-to-Speech use browser-provided Web Speech capabilities. Browser and operating-system vendors may process speech according to their own policies. Community Hero does not intentionally store raw voice recordings."
      ),
    },
    {
      title: t("privacy.sections.cookies.title", "Cookies and Local Storage"),
      icon: Cookie,
      description: t(
        "privacy.sections.cookies.description",
        "Firebase Authentication may use browser storage to maintain your signed-in session. Community Hero also uses local browser storage for preferences such as language when you are signed out. No advertising cookies are intentionally added by this project."
      ),
    },
    {
      title: t("privacy.sections.contact.title", "Contact"),
      icon: Mail,
      description: t(
        "privacy.sections.contact.description",
        "For privacy questions, use the Contact page. The public project email is currently a team-supplied placeholder and should be replaced with the final support address before launch."
      ),
    },
  ] as const

  return (
    <InformationPage
      eyebrow={t("privacy.eyebrow", "Project policy")}
      title={t("privacy.title", "Privacy Policy")}
      description={t(
        "privacy.description",
        "A plain-language overview of the information Community Hero uses and how the current demonstration handles it."
      )}
      updated={t("privacy.updated", "28 June 2026")}
      sections={sections}
    />
  )
}
