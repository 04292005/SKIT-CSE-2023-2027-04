export const SITE = {
  name: "Community Hero",
  tagline: "AI-assisted civic reporting for stronger communities",
  description:
    "Community Hero helps residents report civic issues and follow their progress through an AI-assisted, transparent workflow.",
} as const

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report Issue" },
  { href: "/map", label: "Live Map" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports", label: "My Reports" },
] as const

export const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const
