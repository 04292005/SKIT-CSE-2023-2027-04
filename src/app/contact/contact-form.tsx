"use client"

import { useState } from "react"
import { CheckCircle2, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const { t } = useTranslation()

  if (submitted) {
    return (
      <div
        className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex min-h-72 flex-col items-center justify-center p-8 text-center"
        role="status"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-slate-950">
          {t("contact.form.successTitle", "Message prepared")}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
          {t("contact.form.successMessage", "This demonstration form does not send data to a backend. Connect a verified team inbox before production launch.")}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 px-4 py-2.5 text-sm font-semibold text-slate-700 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          {t("contact.form.backText", "Back to form")}
        </button>
      </div>
    )
  }

  return (
    <form
      className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("contact.form.name", "Name")}
          </label>
          <input 
            id="contact-name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200" 
            name="name" 
            autoComplete="name" 
            required 
            placeholder={t("contact.form.placeholderName", "John Doe")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("contact.form.email", "Email")}
          </label>
          <input
            id="contact-email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t("contact.form.placeholderEmail", "john@example.com")}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="contact-subject" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {t("contact.form.subject", "Subject")}
        </label>
        <input 
          id="contact-subject"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200" 
          name="subject" 
          required 
          placeholder={t("contact.form.placeholderSubject", "How can we help?")}
        />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {t("contact.form.message", "Message")}
        </label>
        <textarea 
          id="contact-message"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200 min-h-36 resize-y" 
          name="message" 
          required 
          placeholder={t("contact.form.placeholderMessage", "Tell us more details...")}
        />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        {t("contact.form.demoText", "UI demonstration only—this form does not transmit or store your message.")}
      </p>
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg sm:w-auto cursor-pointer"
      >
        {t("contact.form.submitButton", "Prepare message")}
        <Send className="size-4" aria-hidden />
      </button>
    </form>
  )
}
