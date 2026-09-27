import type { ComponentType } from "react";

import { CaseJourneyVisual } from "./visuals/CaseJourneyVisual";
import { CommunityNetworkVisual } from "./visuals/CommunityNetworkVisual";
import { CreateCampaignVisual } from "./visuals/CreateCampaignVisual";
import { OrganizationDashboardVisual } from "./visuals/OrganizationDashboardVisual";
import { ProviderReferralVisual } from "./visuals/ProviderReferralVisual";
import { SupportCampaignsVisual } from "./visuals/SupportCampaignsVisual";

export type ValueCard = {
  id: string;
  pill: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** Composition rendered on the card's ScaledCanvas. */
  visual: ComponentType;
};

export const VALUE_CARDS: readonly ValueCard[] = [
  {
    id: "create",
    pill: "Create",
    title: "Get the support you need for pregnancy care",
    description:
      "Create a campaign for yourself or someone you care about and connect your healthcare need with people willing to help.",
    ctaLabel: "More Ways to Create",
    ctaHref: "/get-involved/create",
    visual: CreateCampaignVisual,
  },
  {
    id: "support",
    pill: "Support",
    title: "Find pregnancy campaigns you can help",
    description:
      "Discover pregnancy healthcare campaigns and choose where your support can make a difference.",
    ctaLabel: "More Ways to Support",
    ctaHref: "/get-involved/support",
    visual: SupportCampaignsVisual,
  },
  {
    id: "organizations",
    pill: "Organizations",
    title: "Turn your CSR into visible healthcare impact",
    description:
      "Support verified pregnancy healthcare needs through your organization, CSR initiative, foundation, or funding program.",
    ctaLabel: "More Ways to Partner",
    ctaHref: "/get-involved/partner",
    visual: OrganizationDashboardVisual,
  },
  {
    id: "providers",
    pill: "Healthcare Providers / NGOs",
    title: "Connect patients to the support they need",
    description:
      "Help pregnant women facing financial barriers, verify their cases, and connect them with support for essential pregnancy care.",
    ctaLabel: "More Ways to Partner",
    ctaHref: "/get-involved/partner",
    visual: ProviderReferralVisual,
  },
  {
    id: "community",
    pill: "Community",
    title: "Help us reach the people who need us",
    description:
      "Join a growing network of people connecting mothers with healthcare providers, organizations, supporters, and opportunities.",
    ctaLabel: "More Ways to Support",
    ctaHref: "/get-involved/support",
    visual: CommunityNetworkVisual,
  },
  {
    id: "track",
    pill: "Track",
    title: "Stay connected to the story",
    description:
      "Stay connected to a case and see how your support is making a difference.",
    ctaLabel: "More Ways to Track",
    ctaHref: "/get-involved/track",
    visual: CaseJourneyVisual,
  },
] as const;
