import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { CoreValuesSection } from "@/components/core-values-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { PartnersSection } from "@/components/partners-section"
import { CatchPhrasesSection } from "@/components/catch-phrases-section"
import { StepsToHelpSection } from "@/components/steps-to-help-section"
import { BlogPreviewSection } from "@/components/blog-preview-section"
import { FaqSection } from "@/components/faq-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

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
