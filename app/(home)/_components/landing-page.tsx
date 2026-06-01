import { CTA } from "./cta";
import { FeaturesGrid } from "./features-grid";
import { Hero } from "./hero";
import { Stats } from "./stats";
import type { SuggestionBlock } from "../_actions/get-home-suggestions";

export function LandingPage({ suggestionBlock }: { suggestionBlock: SuggestionBlock }) {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturesGrid suggestionBlock={suggestionBlock} />
      <CTA />
    </>
  );
}
