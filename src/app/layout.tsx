import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Footer, Navbar } from "@/components/layout"
import { SITE } from "@/constants"
import { AppProviders } from "@/providers"

import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-slate-50/40 text-slate-950">
        <AppProviders>
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-xl transition-transform focus:translate-y-0"
          >
            Skip to main content
          </a>
          <Navbar />
          <div id="main-content" className="contents">
            {children}
          </div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  )
}
