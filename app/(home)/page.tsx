import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Pricing } from "@/components/landing/pricing";
import { CTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <>
      {/* Pas besoin de Navbar ici, elle est dans le layout ! */}
      <Hero />
      <Stats />
      <FeaturesGrid />
      <Pricing />
      <CTA />
      {/* Pas besoin de Footer ici, il est dans le layout ! */}
    </>
  );
}