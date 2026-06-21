import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/src/components/landingPage/navbar";
import { HeroSection } from "@/src/components/landingPage/hero-section";
import { UseCasesSection } from "@/src/components/landingPage/use-cases-section";
import { CoreValuesSection } from "@/src/components/landingPage/core-values-section";
import { PartnersSection } from "@/src/components/landingPage/partners-section";
import { StepsToHelpSection } from "@/src/components/landingPage/steps-to-help-section";
import { CtaSection } from "@/src/components/landingPage/cta-section";
import { Footer } from "@/src/components/landingPage/footer";
import { CampaignSamplesSection } from "../components/landingPage/blog-preview-section";

export default async function Home() {
  const cookieStore = await cookies();
  const hasSession =
    Boolean(cookieStore.get("accessToken")?.value) ||
    Boolean(cookieStore.get("refreshToken")?.value);

  if (hasSession) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CampaignSamplesSection title="Active Campaigns" />
      <UseCasesSection />
      <CoreValuesSection />
      <PartnersSection />
      <StepsToHelpSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
