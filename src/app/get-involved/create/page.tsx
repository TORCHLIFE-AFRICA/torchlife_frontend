import type { Metadata } from "next";

import {
  PublicSiteFooter,
  PublicSiteHeader,
} from "@/src/components/landingPage/PublicSiteChrome";
import { CreateCaseHero } from "@/src/components/get-involved/create-case-hero";
import { CreateCaseWho } from "@/src/components/get-involved/create-case-who";
import { CreateCaseHow } from "@/src/components/get-involved/create-case-how";
import { CreateCaseNeed } from "@/src/components/get-involved/create-case-need";
import { CreateCaseAfter } from "@/src/components/get-involved/create-case-after";

export const metadata: Metadata = {
  title: "Start a Campaign | TorchLife",
  description:
    "Start a campaign for pregnancy healthcare support on TorchLife. Learn who can create a case, how it works, what's needed, and what happens after you submit.",
};

export default function CreateCasePage() {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      <PublicSiteHeader />
      <CreateCaseHero />
      <CreateCaseWho />
      <CreateCaseHow />
      <CreateCaseNeed />
      <CreateCaseAfter />
      <PublicSiteFooter />
    </main>
  );
}
