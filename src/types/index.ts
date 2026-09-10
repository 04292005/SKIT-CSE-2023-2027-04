export type NavLink = {
  href: string
  label: string
}

export type SectionTitleProps = {
  title: string
  subtitle?: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export type LoadingProps = {
  label?: string
  fullPage?: boolean
  className?: string
}

export type GlassPanelProps = {
  children: import("react").ReactNode
  className?: string
  as?: "div" | "section" | "article"
}

export type TrustBadgeProps = {
  label: string
  icon: import("react").ComponentType<{ className?: string }>
  className?: string
}
