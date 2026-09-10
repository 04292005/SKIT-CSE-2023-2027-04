import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Cloud,
  Eye,
  FileX,
  Gauge,
  Globe,
  Languages,
  Map,
  MapPin,
  MessageSquare,
  Mic,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react"

export const HERO = {
  eyebrow: "AI-Powered Civic Intelligence Platform",
  tagline: "One Report. Six AI Agents. One Stronger Community.",
  headline: {
    before: "When neighbors speak up, ",
    highlight: "communities transform.",
  },
  description:
    "Community Hero transforms a citizen report into an AI-assisted, prioritized, and trackable civic workflow—helping residents and local authorities collaborate more effectively from reporting to resolution.",
  ctas: {
    primary: {
      label: "Report an Issue",
      href: "/report",
    },
    secondary: {
      label: "Explore Live Map",
      href: "/map",
    },
  },
} as const

export const HERO_TRUST_BADGES = [
  { id: "ai-powered", label: "AI Powered", icon: Sparkles },
  { id: "real-time", label: "Real-Time Tracking", icon: MapPin },
  { id: "multilingual", label: "Multilingual", icon: Languages },
] as const satisfies ReadonlyArray<{
  id: string
  label: string
  icon: LucideIcon
}>

export const CIVIC_PROBLEM = {
  id: "problem",
  eyebrow: "The civic problem",
  title: "Reporting should connect people—not bury them in paperwork",
  description:
    "Most cities still run on forms, phone trees, and hope. Citizens report once, then hear nothing. Trust erodes. Issues pile up. Community Hero exists to close that gap.",
  cards: [
    {
      id: "black-hole",
      icon: FileX,
      title: "Reports vanish into a black hole",
      description:
        "Citizens submit issues and never receive updates. Without visibility, people stop reporting—and problems grow unchecked.",
    },
    {
      id: "no-accountability",
      icon: AlertTriangle,
      title: "No one owns the outcome",
      description:
        "Departments pass tickets between desks. Residents cannot see who is responsible or when work will begin.",
    },
    {
      id: "language-barrier",
      icon: Globe,
      title: "Language locks people out",
      description:
        "Official portals assume English fluency and digital literacy, excluding the very communities that need help most.",
    },
    {
      id: "slow-response",
      icon: Gauge,
      title: "Urgency is invisible",
      description:
        "A pothole and a gas leak look the same in a spreadsheet. Without intelligent triage, critical issues wait in line.",
    },
  ],
} as const satisfies {
  id: string
  eyebrow: string
  title: string
  description: string
  cards: ReadonlyArray<{
    id: string
    icon: LucideIcon
    title: string
    description: string
  }>
}

export const AI_SOLUTION = {
  id: "solution",
  eyebrow: "THE REPORT WORKFLOW",
  title: "From Report to Resolution",
  description:
    "Community Hero guides every report through an AI-assisted civic workflow that helps residents, local authorities, and communities collaborate toward transparent issue resolution.",
  flow: [
    { id: "citizen", label: "Citizen", detail: "Snaps a photo, records a voice note, or taps a map pin" },
    { id: "agents", label: "AI Agents", detail: "Six specialized agents analyze, verify, and route the report" },
    { id: "authorities", label: "Authorities", detail: "Ward engineers and departments receive prioritized work orders" },
    { id: "community", label: "Community", detail: "Neighbors track progress and verify fixes together" },
    { id: "resolution", label: "Resolution", detail: "Issues close with proof—and trust is rebuilt block by block" },
  ],
} as const

export const AGENT_PIPELINE = {
  id: "agents",
  eyebrow: "AI agent pipeline",
  title: "Six agents. One coordinated workflow.",
  description:
    "Each capability has a focused role in turning citizen input into structured civic information, with future-facing features clearly identified.",
  agents: [
    {
      id: "vision",
      icon: Eye,
      title: "Vision Agent",
      responsibility: "Analyzes photos and visual evidence from citizen reports",
    },
    {
      id: "geo",
      icon: MapPin,
      title: "Geo Agent",
      responsibility: "Maps issues to precise ward boundaries and landmarks",
    },
    {
      id: "trust",
      icon: ShieldCheck,
      title: "Validation Agent",
      responsibility: "Validates report completeness and helps identify potential duplicate reports before routing.",
    },
    {
      id: "priority",
      icon: Gauge,
      title: "Priority Agent",
      responsibility: "Ranks urgency and community impact for faster response",
    },
    {
      id: "prediction",
      icon: TrendingUp,
      title: "Future Prediction",
      responsibility: "Designed to estimate issue resolution timelines using historical municipal report data.",
      badge: "Future Enhancement",
    },
    {
      id: "copilot",
      icon: MessageSquare,
      title: "Citizen Assistant",
      responsibility: "Guides citizens through multilingual assistance, speech interaction, and report tracking.",
    },
  ],
} as const satisfies {
  id: string
  eyebrow: string
  title: string
  description: string
  agents: ReadonlyArray<{
    id: string
    icon: LucideIcon
    title: string
    responsibility: string
    badge?: string
  }>
}

export const LIVE_TRACKING = {
  id: "map",
  eyebrow: "Live tracking preview",
  title: "Every report. Every status. In real time.",
  description:
    "Residents and officials share one transparent dashboard—so nobody has to call a helpline to ask what happened to their report.",
  sampleLabel: "Sample dashboard preview",
  issue: {
    ward: "Ward 18",
    category: "Road Repair",
    progress: 68,
    engineerStatus: "Engineer assigned — inspection complete",
    eta: "Estimated resolution: 4 days",
    verification: "3 of 5 neighbors verified on-site",
  },
} as const

export const DIGITAL_TWIN = {
  id: "twin",
  eyebrow: "Community digital twin",
  title: "Illustrative Community Health Dashboard",
  description:
    "This demonstration illustrates how aggregated civic reports can be visualized as community health indicators using AI-generated insights.",
  demoLabel: "AI Generated Demo",
  scores: [
    { id: "infrastructure", label: "Infrastructure", score: 74, trend: "+3 this month" },
    { id: "safety", label: "Safety", score: 81, trend: "+5 this month" },
    { id: "cleanliness", label: "Cleanliness", score: 69, trend: "+2 this month" },
    { id: "water", label: "Water", score: 77, trend: "Stable" },
    { id: "health", label: "Community Health", score: 85, trend: "+4 this month" },
  ],
} as const

export const GOOGLE_TECH = {
  id: "google",
  eyebrow: "Technology Stack",
  title: "Modern tech stack powered by AI & open standards",
  description:
    "Community Hero combines Google AI, Firebase infrastructure, and open-source maps to deliver a secure, localized experience.",
  technologies: [
    {
      id: "ai-studio",
      icon: Bot,
      title: "Google AI Studio",
      category: "AI",
      description: "Gemini powers AI-assisted vision analysis, multilingual understanding, intelligent summarization, and community assistance across the platform.",
    },
    {
      id: "firebase",
      icon: Cloud,
      title: "Firebase",
      category: "Backend",
      description: "Firebase Authentication, Firestore database, secure storage, and real-time synchronization power the complete application backend.",
    },
    {
      id: "maps",
      icon: Map,
      title: "OpenStreetMap + Leaflet",
      category: "Maps",
      description: "Interactive open-source maps provide issue locations, ward boundaries, and live geographic visualization.",
    },
    {
      id: "speech",
      icon: Mic,
      title: "Web Speech API",
      category: "Speech",
      description: "Browser-native Speech-to-Text and Text-to-Speech enable voice-based issue reporting and accessibility.",
    },
    {
      id: "translate",
      icon: Languages,
      title: "AI Powered Multilingual Translation",
      category: "Translation",
      description: "Gemini-powered multilingual translation enables citizens to interact with Community Hero in their preferred language.",
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Community Analytics Dashboard",
      category: "Analytics",
      description: "Interactive dashboards visualize issue statistics, category trends, response timelines, AI insights, and community health indicators.",
    },
  ],
} as const satisfies {
  id: string
  eyebrow: string
  title: string
  description: string
  technologies: ReadonlyArray<{
    id: string
    icon: LucideIcon
    title: string
    category: string
    description: string
  }>
}


export const COMMUNITY_IMPACT = {
  id: "impact",
  eyebrow: "Community impact",
  title: "Potential Community Impact",
  description:
    "Illustrative statistics demonstrating how transparent civic reporting can improve community engagement and municipal responsiveness.",
  demoLabel: "Illustrative Metrics",
  stats: [
    { id: "solved", label: "Issues Solved", value: 1247, suffix: "" },
    { id: "citizens", label: "Citizens Helped", value: 8934, suffix: "" },
    { id: "volunteer", label: "Volunteer Hours", value: 3420, suffix: "" },
    { id: "resolution", label: "Resolution Rate", value: 94, suffix: "%" },
  ],
} as const

export const FINAL_CTA = {
  id: "get-started",
  title: "Build Better Communities Together",
  description:
    "Join the movement to make civic reporting transparent, intelligent, and human. One report at a time, we strengthen the neighborhoods we call home.",
  ctas: {
    primary: { label: "Get Started", href: "#report" },
    secondary: { label: "Watch AI in Action", href: "#agents" },
  },
} as const

export const LANDING_SECTIONS = {
  hero: HERO,
  civicProblem: CIVIC_PROBLEM,
  aiSolution: AI_SOLUTION,
  agentPipeline: AGENT_PIPELINE,
  liveTracking: LIVE_TRACKING,
  digitalTwin: DIGITAL_TWIN,
  googleTech: GOOGLE_TECH,
  communityImpact: COMMUNITY_IMPACT,
  finalCta: FINAL_CTA,
} as const
