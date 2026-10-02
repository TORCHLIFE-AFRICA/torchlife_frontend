import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { SectionWrapper } from "@/src/components/landingPage/section-wrapper";
import { Button } from "@/src/components/ui/button";
import { PageHero } from "@/src/components/get-involved/page-hero";
import { SectionHeading } from "@/src/components/get-involved/section-heading";
import { AudienceGrid, type AudienceItem } from "@/src/components/get-involved/audience-grid";
import { ProcessTimeline, type ProcessStep } from "@/src/components/get-involved/process-timeline";
import { FlowChips } from "@/src/components/get-involved/flow-chips";
import { FeatureCardGrid, type FeatureItem } from "@/src/components/get-involved/feature-card-grid";

export const metadata: Metadata = {
  title: "Support a Verified Case | TorchLife",
  description:
    "Support verified pregnancy healthcare cases and make a real difference in someone's story.",
};

// Flip once recurring giving actually ships in the product — per the content
// doc: "Only ship this card once recurring giving actually exists."
const RECURRING_GIVING_ENABLED = false;

const verificationSteps: ProcessStep[] = [
  {
    title: "Case submitted",
    description:
      "A pregnancy healthcare need is submitted with the required information.",
  },
  {
    title: "Information reviewed",
    description: "Our team reviews the case details and supporting information.",
  },
  {
    title: "Healthcare details confirmed",
    description:
      "Relevant hospital or healthcare information is checked where applicable.",
  },
  {
    title: "Case made available",
    description:
      "Once the required checks are completed, the case can be presented for support.",
  },
];

// No real, consented photography exists yet — each card is a purpose-matched
// brand illustration instead of a mismatched or placeholder stock photo. See
// audience-grid.tsx for the reasoning.
const supportAudiences: AudienceItem[] = [
  {
    icon: "Smartphone",
    title: "Individuals",
    description: "Support a case directly and choose where your contribution goes.",
  },
  {
    icon: "Users",
    title: "Families & Friends",
    description:
      "Come together to support someone you know or help amplify a verified case.",
  },
  {
    icon: "Building2",
    title: "Organizations",
    description:
      "Companies and organizations can support selected cases or create broader support initiatives.",
  },
  {
    icon: "HandCoins",
    title: "Philanthropists",
    description:
      "Support larger or recurring healthcare needs and help more families access care.",
  },
];

const waysToSupport: FeatureItem[] = [
  {
    icon: "Target",
    title: "Support a specific case",
    description: "Choose a verified case and contribute directly.",
  },
  {
    icon: "Share2",
    title: "Share a case",
    description: "Help a case reach people who may be able to support it.",
  },
  {
    icon: "Building2",
    title: "Support through an organization",
    description: "Organizations can support selected cases or broader initiatives.",
  },
  ...(RECURRING_GIVING_ENABLED
    ? [
        {
          icon: "Repeat2" as const,
          title: "Become a recurring supporter",
          description:
            "Where available, contribute repeatedly to maternal healthcare support.",
        },
      ]
    : []),
];

const confidencePoints: FeatureItem[] = [
  {
    icon: "ShieldCheck",
    title: "Verified cases",
    description: "Healthcare needs are reviewed before cases are made available for support.",
  },
  {
    icon: "FileText",
    title: "Clear information",
    description: "See the information provided about the case before deciding to support.",
  },
  {
    icon: "TrendingUp",
    title: "Progress updates",
    description: "Follow available updates as the case moves forward.",
  },
  {
    icon: "Heart",
    title: "Responsible storytelling",
    description: "We present people's stories with dignity and respect.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        pill="Support"
        title="Help someone get the care they need"
        description="Support verified pregnancy healthcare cases and make a real difference in someone's story."
        primaryCta={{ label: "Browse Cases", href: "/campaigns" }}
        secondaryCta={{ label: "How verification works", href: "#verification" }}
        image="/pregnant-african-woman-smiling-in-modern-hospital-.jpg"
        imageAlt="A pregnant woman smiling in a modern hospital setting"
        floatingBadge={{
          icon: "ShieldCheck",
          title: "Every case reviewed",
          subtitle: "4-step verification before it's shared",
        }}
      />

      <SectionWrapper id="verification" className="bg-background scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Support"
            title="Support starts with knowing the need is real."
            description="Before a case is presented for support, TorchLife reviews the information provided and works to confirm the healthcare need and relevant details."
          />
          <ProcessTimeline steps={verificationSteps} />
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Support"
            title="Anyone who wants to make a difference can take part."
          />
          <AudienceGrid items={supportAudiences} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Support" title="Support in a way that works for you." />
          <FeatureCardGrid items={waysToSupport} columns="md:grid-cols-2 lg:grid-cols-3" />
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <SectionHeading eyebrow="Support" title="What happens after I support?" />
          <div className="mb-10">
            <FlowChips
              steps={[
                "You support",
                "Case receives support",
                "Progress is updated",
                "You can follow the case",
              ]}
            />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Your involvement should not disappear after you contribute. Where updates
            are available, supporters should be able to follow the progress of the case
            they chose to support.
          </p>
          <Button asChild size="lg">
            <Link href="/campaigns">Browse Cases →</Link>
          </Button>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Support" title="Support with confidence" />
          <FeatureCardGrid items={confidencePoints} columns="md:grid-cols-2 lg:grid-cols-4" />
          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline">
              <Link href="/campaigns">Browse verified cases →</Link>
            </Button>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
