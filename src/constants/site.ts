export const SITE = {
  name: "NagarSeva",
  tagline: "AI-Powered Civic Issue Reporting Platform",
  description:
    "NagarSeva is an AI-powered civic issue reporting and tracking platform designed to make civic reporting easier, smarter and more transparent.",
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
