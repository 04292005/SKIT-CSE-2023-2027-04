import type { LandingPageProps } from "@/features/landing/types"
import { cn } from "@/lib/utils"

import { AgentPipelineSection } from "./agent-pipeline-section"
import { AiSolutionSection } from "./ai-solution-section"
import { CivicProblemSection } from "./civic-problem-section"
import { CommunityImpactSection } from "./community-impact-section"
import { DigitalTwinSection } from "./digital-twin-section"
import { FinalCtaSection } from "./final-cta-section"
import { GoogleTechSection } from "./google-tech-section"
import { HeroSection } from "./hero-section"
import { LiveTrackingSection } from "./live-tracking-section"

export function LandingPage({ className }: LandingPageProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <HeroSection />
      <CivicProblemSection />
      <AiSolutionSection />
      <AgentPipelineSection />
      <LiveTrackingSection />
      <DigitalTwinSection />
      <GoogleTechSection />
      <CommunityImpactSection />
      <FinalCtaSection />
    </div>
  )
}
