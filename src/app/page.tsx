import { Navbar } from "@/src/components/landingPage/navbar";
import { HeroSection } from "@/src/components/landingPage/hero-section";
import { UseCasesSection } from "@/src/components/landingPage/use-cases-section";
import { CoreValuesSection } from "@/src/components/landingPage/core-values-section";
import { PartnersSection } from "@/src/components/landingPage/partners-section";
import { StepsToHelpSection } from "@/src/components/landingPage/steps-to-help-section";
import { FaqSection } from "@/src/components/landingPage/faq-section";
import { CtaSection } from "@/src/components/landingPage/cta-section";
import { Footer } from "@/src/components/landingPage/footer";
import { CampaignSamplesSection } from "../components/landingPage/blog-preview-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CampaignSamplesSection title="Campaign Sample" />
      <UseCasesSection />
      <CoreValuesSection />
      <PartnersSection />
      <StepsToHelpSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
