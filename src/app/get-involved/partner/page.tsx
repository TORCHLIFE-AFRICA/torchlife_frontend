import type { Metadata } from "next";

import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { SectionWrapper } from "@/src/components/landingPage/section-wrapper";
import { PartnersSection } from "@/src/components/landingPage/partners-section";
import { Button } from "@/src/components/ui/button";
import { PageHero } from "@/src/components/get-involved/page-hero";
import { SectionHeading } from "@/src/components/get-involved/section-heading";
import { AudienceGrid, type AudienceItem } from "@/src/components/get-involved/audience-grid";
import { FeatureCardGrid, type FeatureItem } from "@/src/components/get-involved/feature-card-grid";

export const metadata: Metadata = {
  title: "Partner With TorchLife",
  description:
    "Work with us to help more women access support when pregnancy healthcare becomes difficult to afford.",
};

const PARTNER_EMAIL = "partner@torchlife.co";
const mailtoWithSubject = (subject: string) =>
  `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent(subject)}`;

// No real, consented photography exists yet — each card is a purpose-matched
// brand illustration instead of a mismatched or placeholder stock photo. See
// audience-grid.tsx for the reasoning.
const partnerAudiences: AudienceItem[] = [
  {
    icon: "Hospital",
    title: "Hospitals & Healthcare Providers",
    description:
      "Help us connect verified healthcare needs to the right healthcare relationships.",
  },
  {
    icon: "Briefcase",
    title: "Companies",
    description: "Support maternal healthcare through employee, customer or corporate initiatives.",
  },
  {
    icon: "Landmark",
    title: "Foundations & NGOs",
    description: "Work with TorchLife on targeted healthcare support and community initiatives.",
  },
  {
    icon: "HandCoins",
    title: "Philanthropists",
    description: "Support meaningful healthcare needs and help more families access care.",
  },
  {
    icon: "Globe2",
    title: "Communities",
    description: "Bring people together around cases, education and practical support.",
  },
  {
    icon: "Stethoscope",
    title: "Healthcare Professionals",
    description: "Contribute expertise, referrals and healthcare perspective where appropriate.",
  },
];

const partnershipForms: FeatureItem[] = [
  {
    icon: "HeartHandshake",
    title: "Case Support",
    description: "Support selected verified healthcare cases.",
  },
  {
    icon: "UserPlus",
    title: "Referrals",
    description: "Help TorchLife identify people who may need support.",
  },
  {
    icon: "Stethoscope",
    title: "Healthcare Connections",
    description: "Help connect TorchLife with relevant healthcare providers.",
  },
  {
    icon: "Users",
    title: "Community Reach",
    description:
      "Introduce TorchLife to communities that may benefit from or contribute to the platform.",
  },
  {
    icon: "Lightbulb",
    title: "Expertise",
    description:
      "Provide healthcare, financial, operational, technology or other relevant expertise.",
  },
  {
    icon: "Award",
    title: "Sponsored Initiatives",
    description:
      "Where applicable, organizations can support specific maternal healthcare initiatives.",
  },
];

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        pill="Partner"
        title="Build with TorchLife"
        description="Work with us to help more women access support when pregnancy healthcare becomes difficult to afford."
        primaryCta={{
          label: "Partner with TorchLife",
          href: mailtoWithSubject("Partnership Inquiry"),
          external: true,
        }}
        secondaryCta={{
          label: "Tell us how you can help",
          href: mailtoWithSubject("How I Can Help"),
          external: true,
        }}
        image="/maternal-healthcare-africa-clinic.jpg"
        imageAlt="A healthcare provider in a clinic setting"
        floatingBadge={{
          icon: "HeartHandshake",
          title: "6 ways to build with us",
          subtitle: "Hospitals, companies, NGOs & more",
        }}
      />

      <SectionWrapper className="bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Partner" title="Who can partner with us?" />
          <AudienceGrid items={partnerAudiences} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Partner" title="What partnership can look like" />
          <FeatureCardGrid items={partnershipForms} columns="md:grid-cols-2 lg:grid-cols-3" />
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <a href={mailtoWithSubject("Become a Partner")}>Become a Partner →</a>
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* Reused verbatim from the homepage, per the content doc:
          "Our partners ... same way it exists." */}
      <PartnersSection />

      <Footer />
    </div>
  );
}
