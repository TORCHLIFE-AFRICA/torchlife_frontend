"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/src/components/landingPage/section-wrapper";
import { Card } from "@/src/components/ui/card";

type CardSize = "hero" | "standard";

interface WhyChooseCard {
  title: string;
  description: string;
  illustration: ReactNode;
  size: CardSize;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function EmergencyHeartIllustration() {
  // TODO: replace with final illustration asset.
  return (
    <svg
      viewBox="0 0 260 180"
      className="h-28 w-40 md:h-36 md:w-52"
      role="img"
      aria-label="Emergency support illustration"
    >
      <defs>
        <linearGradient id="em-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--secondary)" />
          <stop offset="100%" stopColor="var(--muted)" />
        </linearGradient>
      </defs>
      <ellipse cx="130" cy="158" rx="88" ry="14" fill="var(--muted)" />
      <rect x="48" y="48" width="164" height="90" rx="22" fill="url(#em-bg)" stroke="var(--border)" />
      <path
        d="M130 70c10-18 40-14 40 10 0 21-22 33-40 49-18-16-40-28-40-49 0-24 30-28 40-10Z"
        fill="var(--primary)"
      />
      <rect x="124" y="84" width="12" height="34" rx="4" fill="var(--primary-foreground)" />
      <rect x="113" y="95" width="34" height="12" rx="4" fill="var(--primary-foreground)" />
    </svg>
  );
}

function ShieldIllustration() {
  // TODO: replace with final illustration asset.
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-24 w-32 md:h-28 md:w-36"
      role="img"
      aria-label="Verified campaigns illustration"
    >
      <ellipse cx="110" cy="136" rx="64" ry="10" fill="var(--muted)" />
      <rect x="64" y="26" width="92" height="90" rx="20" fill="var(--secondary)" stroke="var(--border)" />
      <path
        d="M110 36 76 50v22c0 20 14 38 34 44 20-6 34-24 34-44V50l-34-14Z"
        fill="var(--primary)"
      />
      <path d="m96 74 10 10 18-18" stroke="var(--primary-foreground)" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function DonationsIllustration() {
  // TODO: replace with final illustration asset.
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-24 w-32 md:h-28 md:w-36"
      role="img"
      aria-label="Small donations illustration"
    >
      <ellipse cx="110" cy="136" rx="64" ry="10" fill="var(--muted)" />
      <circle cx="86" cy="74" r="24" fill="var(--accent)" stroke="var(--border)" />
      <circle cx="136" cy="60" r="20" fill="var(--secondary)" stroke="var(--border)" />
      <path d="M70 104c10-10 24-10 34 0" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" />
      <path d="M116 100c8-8 20-8 28 0" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" />
      <text x="79" y="80" fill="var(--accent-foreground)" fontSize="20" fontWeight="700">
        ₦
      </text>
    </svg>
  );
}

function CommunityIllustration() {
  // TODO: replace with final illustration asset.
  return (
    <svg
      viewBox="0 0 220 150"
      className="h-24 w-32 md:h-28 md:w-36"
      role="img"
      aria-label="Community illustration"
    >
      <ellipse cx="110" cy="136" rx="64" ry="10" fill="var(--muted)" />
      <circle cx="80" cy="62" r="16" fill="var(--primary)" />
      <circle cx="110" cy="54" r="18" fill="var(--accent)" />
      <circle cx="142" cy="64" r="15" fill="var(--primary)" />
      <rect x="66" y="84" width="86" height="34" rx="16" fill="var(--secondary)" stroke="var(--border)" />
      <path d="M82 101h56" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

const cards: WhyChooseCard[] = [
  {
    title: "Emergency Support When It Matters Most",
    description:
      "Raise funds for urgent pregnancy care, surgeries, hospital bills, and critical medical needs without waiting for traditional financial help.",
    illustration: <EmergencyHeartIllustration />,
    size: "hero",
  },
  {
    title: "Verified Campaigns, Trusted Giving",
    description:
      "Every public campaign is reviewed before approval, helping donors support genuine cases with confidence.",
    illustration: <ShieldIllustration />,
    size: "standard",
  },
  {
    title: "Small Donations, Life-Changing Impact",
    description:
      "Whether you give ₦1,000 or ₦100,000, your contribution helps provide care, treatment, and hope to vulnerable pregnant women.",
    illustration: <DonationsIllustration />,
    size: "standard",
  },
  {
    title: "A Community Built on Compassion",
    description:
      "TorchLife connects families, donors, and supporters who believe no woman should face a pregnancy crisis alone.",
    illustration: <CommunityIllustration />,
    size: "standard",
  },
];

interface BentoCardProps {
  title: string;
  description: string;
  illustration: ReactNode;
  size: CardSize;
}

function BentoCard({ title, description, illustration, size }: BentoCardProps) {
  const isHero = size === "hero";

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileInView="visible"
      initial="hidden"
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card
        className="h-full overflow-hidden border-border bg-card/70 p-0 shadow-sm transition-shadow hover:shadow-lg"
      >
        <div
          className={[
            "grid h-full",
            isHero
              ? "grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:p-10"
              : "grid-cols-1 gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center",
          ].join(" ")}
        >
          <div className="flex flex-col justify-center gap-3">
            <h3
              className={[
                "text-foreground font-semibold text-balance",
                isHero ? "text-xl md:text-2xl" : "text-lg md:text-xl",
              ].join(" ")}
            >
              {title}
            </h3>
            <p
              className={[
                "text-muted-foreground leading-relaxed",
                isHero ? "text-base md:text-lg" : "text-sm md:text-base",
              ].join(" ")}
            >
              {description}
            </p>
          </div>

          <div
            className={[
              "flex",
              isHero
                ? "justify-start md:justify-end"
                : "justify-start md:justify-end",
            ].join(" ")}
          >
            {illustration}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function WhyFamiliesChoose() {
  const [heroCard, ...standardCards] = cards;

  return (
    <SectionWrapper className="bg-background" id="why-families-choose">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground text-balance lg:text-4xl">
            Why Families Choose TorchLife
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            TorchLife gives pregnant women and families a faster way to find
            support during medical emergencies.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <BentoCard {...heroCard} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {standardCards.map((card) => (
              <BentoCard key={card.title} {...card} />
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}