import type { ComponentType } from "react";

import {
  CampaignProgressPreview,
  CaseInformationPreview,
  FinancialBreakdownPreview,
  OutcomeUpdatesPreview,
  SupportHistoryPreview,
  VerificationPreview,
} from "./previews";

export type TrustMechanism = {
  id: string;
  title: string;
  description: string;
  preview: ComponentType;
};

/**
 * Ordered as a supporter meets them: before giving (case, verification,
 * breakdown), while the campaign runs (progress), and after (outcomes,
 * history). Each index matches the numbered region on the campaign card.
 */
export const TRUST_MECHANISMS: readonly TrustMechanism[] = [
  {
    id: "case-information",
    title: "Case information",
    description:
      "Understand the healthcare need behind each campaign, including what care is required and why support is needed.",
    preview: CaseInformationPreview,
  },
  {
    id: "verification",
    title: "Verification",
    description:
      "Cases are verified with relevant information and documentation to help establish that the healthcare need is genuine.",
    preview: VerificationPreview,
  },
  {
    id: "financial-breakdown",
    title: "Financial breakdown",
    description:
      "See how the requested funds are intended to support the healthcare need and where your contribution goes.",
    preview: FinancialBreakdownPreview,
  },
  {
    id: "campaign-progress",
    title: "Campaign progress",
    description:
      "See how much has been raised, how much remains, and how the campaign is progressing.",
    preview: CampaignProgressPreview,
  },
  {
    id: "outcome-updates",
    title: "Outcome updates",
    description:
      "Stay connected after support is received and see updates on the care provided and the difference your support has made.",
    preview: OutcomeUpdatesPreview,
  },
  {
    id: "support-history",
    title: "Support history",
    description:
      "Keep a record of the cases you have supported and stay connected to their updates over time.",
    preview: SupportHistoryPreview,
  },
] as const;
