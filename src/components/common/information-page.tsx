"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

import { PageContainer } from "@/components/layout/page-container"

export type InformationSection = {
  title: string
  description: string
  icon: LucideIcon
  items?: readonly string[]
}

type InformationPageProps = {
  eyebrow: string
  title: string
  description: string
  updated?: string
  sections: readonly InformationSection[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function InformationPage({
  eyebrow,
  title,
  description,
  updated,
  sections,
}: InformationPageProps) {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/20 py-12 md:py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl"
      />
      <PageContainer className="relative" size="narrow" as="div">
        <header className="mb-8 border-b border-slate-200 pb-8 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600 lg:text-lg">{description}</p>
          {updated ? (
            <p className="mt-4 text-sm text-slate-500">Last updated: {updated}</p>
          ) : null}
        </header>

        <motion.div
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section) => {
            const Icon = section.icon

            return (
              <motion.section
                key={section.title}
                variants={cardVariants}
                className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7"
                aria-labelledby={`${section.title.toLowerCase().replaceAll(" ", "-")}-heading`}
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2
                      id={`${section.title.toLowerCase().replaceAll(" ", "-")}-heading`}
                      className="text-lg font-semibold text-slate-950"
                    >
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {section.description}
                    </p>
                    {section.items?.length ? (
                      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </motion.section>
            )
          })}
        </motion.div>
      </PageContainer>
    </main>
  )
}
