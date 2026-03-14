import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Pricing } from "@/components/landing/pricing";
import { CTA } from "@/components/landing/cta";

/**
 * LandingPage Component.
 * Acts as the main marketing entry point. 
 * Orchestrates multiple high-impact sections to showcase the product's value.
 */
export default function LandingPage() {
  return (
    <>
      {/* 1. Hero Section: 
          Captures attention immediately with the main value proposition and primary CTA. 
      */}
      <Hero />

      {/* 2. Stats Section: 
          Builds social proof and credibility by showing key numbers (users, books, etc.).
      */}
      <Stats />

      {/* 3. Features Grid: 
          Details the core functionalities, highlighting the AI integration.
      */}
      <FeaturesGrid />

      {/* 4. Pricing: 
          Presents the different tiers (Free, Pro, Enterprise) clearly to the user.
      */}
      <Pricing />

      {/* 5. CTA (Call to Action): 
          The final nudge to encourage users to sign up before reaching the footer.
      */}
      <CTA />
    </>
  );
}