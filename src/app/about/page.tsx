import type { Metadata } from "next";

import { AboutHero } from "@/src/components/about/sections/AboutHero";
import { BeliefsSection } from "@/src/components/about/sections/BeliefsSection";
import { CommunitySection } from "@/src/components/about/sections/CommunitySection";
import { DifferenceSection } from "@/src/components/about/sections/DifferenceSection";
import { DirectionSection } from "@/src/components/about/sections/DirectionSection";
import { ParticipateSection } from "@/src/components/about/sections/ParticipateSection";
import { ProgressSection } from "@/src/components/about/sections/ProgressSection";
import { TeamSection } from "@/src/components/about/sections/TeamSection";
import { WhatWeAreBuildingSection } from "@/src/components/about/sections/WhatWeAreBuildingSection";
import { WhereWeStartedSection } from "@/src/components/about/sections/WhereWeStartedSection";
import { WhyWeExistSection } from "@/src/components/about/sections/WhyWeExistSection";
import {
  PublicSiteFooter,
  PublicSiteHeader,
} from "@/src/components/landingPage/PublicSiteChrome";

export const metadata: Metadata = {
  title: "About | TorchLife",
  description:
    "TorchLife is building trusted infrastructure around maternal healthcare, starting with verified financial support for pregnancy-related healthcare needs.",
  alternates: { canonical: "/about" },
};

/**
 * The page reads as one argument, in order: why TorchLife exists, where it
 * started, what it is building, how it works, who builds it, who surrounds it,
 * what it believes, what it has done, where it is going, and how to take part.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#10211f]">
      <PublicSiteHeader />
      <AboutHero />
      <WhyWeExistSection />
      <WhereWeStartedSection />
      <WhatWeAreBuildingSection />
      <DifferenceSection />
      <TeamSection />
      <CommunitySection />
      <BeliefsSection />
      <ProgressSection />
      <DirectionSection />
      <ParticipateSection />
      <PublicSiteFooter />
    </main>
  );
}
