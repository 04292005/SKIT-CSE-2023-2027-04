"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import {
  ChevronDown,
  Globe,
  Mail,
  Sparkles,
  UsersRound,
} from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { ContactForm } from "./contact-form"

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left text-lg font-semibold text-slate-900 focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 shrink-0 text-slate-400"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-4 leading-7 text-slate-600 text-sm sm:text-base">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage() {
  const { t } = useTranslation()

  const faqs = [
    {
      question: t("contact.faq.q1", "Is Community Hero an official municipal service?"),
      answer: t("contact.faq.a1", "No. Community Hero is currently a Google Solution Challenge project and civic workflow demonstration unless adopted by a participating authority."),
    },
    {
      question: t("contact.faq.q2", "Does the contact form send messages?"),
      answer: t("contact.faq.a2", "No. This page currently demonstrates the user interface only. A production backend can be connected later."),
    },
    {
      question: t("contact.faq.q3", "Are homepage statistics real?"),
      answer: t("contact.faq.a3", "No. All dashboards, AI-generated insights and impact metrics are illustrative demonstrations and are labelled accordingly."),
    },
  ] as const

  return (
    <main className="bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 py-12 md:py-16 lg:py-20">
      <PageContainer size="default">

        <header className="mx-auto max-w-3xl py-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            {t("contact.eyebrow", "Project Contact")}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            {t("contact.title", "Let's Build More Responsive Communities")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t("contact.description", "Community Hero explores how AI-assisted civic reporting helps residents and local authorities collaborate from issue reporting through transparent resolution.")}
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

          <aside className="space-y-6">

            {/* Google Solution Challenge Card */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                {t("contact.challenge.title", "Google Solution Challenge")}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("contact.challenge.desc", "Community Hero demonstrates how responsible AI can improve transparency, accessibility and collaboration between citizens and local authorities.")}
              </p>
            </div>

            {/* Project Developer Card */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UsersRound className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                {t("contact.developer.title", "Project Developer")}
              </h2>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p className="font-bold text-slate-900 text-base">{t("contact.developer.name", "Shrestha Swami")}</p>
                <p className="font-medium text-slate-700">{t("contact.developer.degree", "B.Tech Computer Science & Engineering (Data Science)")}</p>
                <p className="text-slate-500">{t("contact.developer.institution", "SKIT Jaipur")}</p>
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    {t("contact.developer.focus", "AI • Data Science • Civic Technology")}
                  </span>
                </div>
              </div>
            </div>

            {/* Connect with the Developer Card */}
            <div
              id="project-links"
              className="p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {t("contact.links.title", "Connect with the Developer")}
              </h2>

              <div className="mt-5 space-y-4">

                <a 
                  href="mailto:shresthaswami25@gmail.com" 
                  className="flex items-center gap-3 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  <Mail className="h-5 w-5 text-emerald-700" />
                  <span className="text-sm sm:text-base font-medium underline decoration-slate-300 hover:decoration-emerald-500">shresthaswami25@gmail.com</span>
                </a>

                <a 
                  href="https://github.com/Shrestha-Swami/community-hero" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  <Globe className="h-5 w-5 text-emerald-700" />
                  <span className="text-sm sm:text-base font-medium underline decoration-slate-300 hover:decoration-emerald-500">{t("contact.links.github", "GitHub Profile")}</span>
                </a>

                <a 
                  href="https://linkedin.com/in/shrestha-swami" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  <svg className="h-5 w-5 text-emerald-700 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"/>
                  </svg>
                  <span className="text-sm sm:text-base font-medium underline decoration-slate-300 hover:decoration-emerald-500">{t("contact.links.linkedin", "LinkedIn Profile")}</span>
                </a>

              </div>

              <p className="mt-5 text-xs leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
                {t("contact.links.note", "Open to collaboration, research opportunities, and civic technology discussions.")}
              </p>
            </div>

          </aside>

          <ContactForm />

        </div>

        <section className="mt-14">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              {t("contact.faq.eyebrow", "Quick Answers")}
            </p>

            <h2 className="mt-4 text-2xl font-semibold text-slate-900 lg:text-3xl">
              {t("contact.faq.title", "Frequently Asked Questions")}
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-4">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

        </section>

      </PageContainer>
    </main>
  )
}