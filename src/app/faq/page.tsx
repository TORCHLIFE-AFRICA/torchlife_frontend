import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { FaqSection } from "@/src/components/landingPage/faq-section";

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FaqSection />
      <Footer />
    </div>
  );
}
