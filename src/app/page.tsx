import { Navbar } from "@/src/components/navbar"
import { HeroSection } from "@/src/components/hero-section"
import { UseCasesSection } from "@/src/components/use-cases-section"
import { CoreValuesSection } from "@/src/components/core-values-section"
import { HowItWorksSection } from "@/src/components/how-it-works-section"
import { PartnersSection } from "@/src/components/partners-section"
import { CatchPhrasesSection } from "@/src/components/catch-phrases-section"
import { StepsToHelpSection } from "@/src/components/steps-to-help-section"
import { BlogPreviewSection } from "@/src/components/blog-preview-section"
import { FaqSection } from "@/src/components/faq-section"
import { CtaSection } from "@/src/components/cta-section"
import { Footer } from "@/src/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <UseCasesSection />
      <CoreValuesSection />
      <HowItWorksSection />
      <PartnersSection />
      <CatchPhrasesSection />
      <StepsToHelpSection />
      <BlogPreviewSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
