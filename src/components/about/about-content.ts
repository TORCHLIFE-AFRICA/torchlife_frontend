import {
  Building2,
  Eye,
  Fingerprint,
  HandHeart,
  House,
  Network,
  Scale,
  ScanSearch,
  Stethoscope,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { COMMUNITY_WHATSAPP_URL, PARTNER_MAILTO } from "../landingPage/contact-links";

/**
 * Copy and structure for the About page.
 *
 * The page separates what TorchLife does today from what it is building
 * toward. Every stage that describes the future carries a horizon other than
 * "today", and the UI labels it as direction, never as an existing product.
 * Keep that rule when editing: a stage only moves to "today" once it is live.
 */

/**
 * One vocabulary for time, shared by the system diagram and the roadmap so
 * the two can never describe the same stage differently.
 */
export type Horizon = "today" | "next" | "future" | "long-term";

export const HORIZON_LABELS: Record<Horizon, string> = {
  today: "Today",
  next: "Next",
  future: "Future",
  "long-term": "Long term",
};

// 3. Where we started ---------------------------------------------------------

export const ORIGIN_STAGES = [
  { label: "The problem", detail: "Care is needed now, before the money is available." },
  { label: "The first case", detail: "One real need, taken seriously from the start." },
  { label: "Verification", detail: "Confirming the need is genuine before anyone is asked to help." },
  { label: "Support", detail: "Connecting the need with people and organizations willing to give." },
  { label: "Learning", detail: "Each case shows us more about trust, access, and financial pressure." },
  { label: "Building", detail: "Turning what we learn into better systems around pregnancy." },
] as const;

// 4. What we are building ----------------------------------------------------

export type SystemStage = { label: string; detail: string; horizon: Horizon };

export const SYSTEM_STAGES: readonly SystemStage[] = [
  {
    label: "Verified healthcare need",
    detail: "A real need, checked before it is shared.",
    horizon: "today",
  },
  {
    label: "Financial support",
    detail: "People and organizations help fund the care.",
    horizon: "today",
  },
  {
    label: "Financial preparation",
    detail: "Helping families get ready before costs arrive.",
    horizon: "next",
  },
  {
    label: "Protection",
    detail: "Guarding families against costs they could not plan for.",
    horizon: "future",
  },
  {
    label: "Better information",
    detail: "Trusted healthcare information when it matters.",
    horizon: "future",
  },
  {
    label: "Better maternal healthcare",
    detail: "The outcome every other stage exists to serve.",
    horizon: "long-term",
  },
];

// 5. What makes TorchLife different ------------------------------------------

export type ValueItem = { title: string; line: string; icon: LucideIcon };

export const VALUES: readonly ValueItem[] = [
  {
    title: "Verification",
    line: "We take the time to understand the case before support begins.",
    icon: ScanSearch,
  },
  {
    title: "Transparency",
    line: "We want supporters to understand what they are supporting and follow available progress.",
    icon: Eye,
  },
  {
    title: "Dignity",
    line: "People are not fundraising props. Their stories belong to them.",
    icon: Fingerprint,
  },
  {
    title: "Community",
    line: "Better healthcare support requires more than one organization.",
    icon: Network,
  },
  {
    title: "Responsibility",
    line: "We want to grow without compromising trust.",
    icon: Scale,
  },
];

// 7. The wider community -----------------------------------------------------

export type EcosystemNode = { label: string; line: string; icon: LucideIcon };

/** Ordered clockwise from the top of the diagram. */
export const ECOSYSTEM_NODES: readonly EcosystemNode[] = [
  { label: "Families", line: "The reason any of this exists.", icon: House },
  { label: "Healthcare providers", line: "Where the care itself happens.", icon: Stethoscope },
  { label: "Supporters", line: "Give, share, and follow each case.", icon: HandHeart },
  { label: "Organizations", line: "Bring reach, resources, and expertise.", icon: Building2 },
  { label: "Community", line: "Carries the work further than one team can.", icon: UsersRound },
];

// 8. What we believe ---------------------------------------------------------

export const PRINCIPLES = [
  "Pregnancy deserves better support.",
  "Healthcare needs should be treated with dignity.",
  "Trust must be built into the process.",
  "People should know what they are supporting.",
  "Technology should make meaningful help easier, not simply make things look impressive.",
  "The people affected by the problem should remain at the centre of what we build.",
] as const;

// 10. Where we are going -----------------------------------------------------

export const PILLARS = [
  {
    title: "Urgency",
    line: "So support can reach someone before a healthcare need becomes a crisis.",
  },
  {
    title: "Data integrity",
    line: "So every case is checked against the facts before it is presented, not just a story.",
  },
  {
    title: "Trust",
    line: "So supporters and partners always know their contribution goes where it says it goes.",
  },
  {
    title: "Financial inclusion",
    line: "So pregnancy healthcare stops depending on how much money a family happens to have on hand that week.",
  },
] as const;

export const ROADMAP: readonly { horizon: Horizon; label: string }[] = [
  { horizon: "today", label: "Verified pregnancy healthcare support" },
  { horizon: "next", label: "Stronger financial preparation" },
  { horizon: "future", label: "Broader protection and trusted healthcare information" },
  { horizon: "long-term", label: "Trusted maternal healthcare infrastructure" },
];

// 11. Join what we are building ----------------------------------------------

export type Pathway = {
  title: string;
  line: string;
  cta: string;
  href: string;
  isExternal: boolean;
  icon: LucideIcon;
};

export const PATHWAYS: readonly Pathway[] = [
  {
    title: "Support",
    line: "Help a woman access the care she needs.",
    cta: "Support a case",
    href: "/campaigns",
    isExternal: false,
    icon: HandHeart,
  },
  {
    title: "Partner",
    line: "Bring your organization, expertise, or network to the work.",
    cta: "Partner with us",
    href: PARTNER_MAILTO,
    isExternal: false,
    icon: Building2,
  },
  {
    title: "Join the community",
    line: "Meet people who want to help build a stronger support system around pregnancy.",
    cta: "Join the community",
    href: COMMUNITY_WHATSAPP_URL,
    isExternal: true,
    icon: UsersRound,
  },
];
