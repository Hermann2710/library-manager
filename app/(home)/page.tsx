import { getHomeSuggestions } from "./_actions/get-home-suggestions";
import { LandingPage } from "./_components/landing-page";

export const dynamic = "force-dynamic";

export default async function LandingRoute() {
  const suggestionBlock = await getHomeSuggestions();

  return <LandingPage suggestionBlock={suggestionBlock} />;
}
