import type { Metadata } from "next";

import {
  PublicSiteFooter,
  PublicSiteHeader,
} from "@/src/components/landingPage/PublicSiteChrome";
import { TrackCaseHero } from "@/src/components/get-involved/track-case-hero";
import { TrackCaseWhat } from "@/src/components/get-involved/track-case-what";
import { TrackCaseTransparency } from "@/src/components/get-involved/track-case-transparency";
import { TrackCaseHelp } from "@/src/components/get-involved/track-case-help";

export const metadata: Metadata = {
  title: "Track a Case | TorchLife",
  description:
    "Stay connected to the story. Track case progress, updates, support activity, and outcomes on TorchLife.",
};

export default function TrackCasePage() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[var(--brand-ink)]">
      <PublicSiteHeader />
      <TrackCaseHero />
      <TrackCaseWhat />
      <TrackCaseTransparency />
      <TrackCaseHelp />
      <PublicSiteFooter />
    </main>
  );
}
