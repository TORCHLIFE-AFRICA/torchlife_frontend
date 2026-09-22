import { HandCoins, ShieldCheck, Target, Users, type LucideIcon } from "lucide-react";

/**
 * The figures published on the public site.
 *
 * Every value here is an internally verified TorchLife record. Nothing in this
 * file may be estimated, rounded up, or written to look better than the record
 * it came from. A figure that is a floor is written as a floor — "₦1M+" — so
 * what a visitor reads is always something TorchLife can evidence.
 *
 * Last confirmed against TorchLife records: 11 September 2026. Please update
 * that date in the same edit as any value below, so the next person can tell
 * how old these figures are.
 *
 * MOVING TO THE API: when the backend exposes a stats endpoint, fetch it and
 * pass the result into `MetricsSection` in place of `SITE_METRICS`. The section
 * renders whatever matches `SiteMetric`, so nothing else needs to change.
 */

export type SiteMetric = {
  id: string;
  /** The figure exactly as it should read. A floor keeps its "+". */
  value: string;
  /** Short caption under the figure. */
  label: string;
  icon: LucideIcon;
};

export const SITE_METRICS: readonly SiteMetric[] = [
  {
    // Total value of financial support requested across verified TorchLife cases.
    id: "support-requested",
    value: "₦1M+",
    label: "Healthcare support requested",
    icon: HandCoins,
  },
  {
    // Percentage of verified cases that have reached their full funding requirement.
    id: "fully-supported",
    value: "75%",
    label: "Cases fully supported",
    icon: Target,
  },
  {
    // Unique individuals or organizations that have supported, expressed interest
    // in, or been reached through TorchLife campaigns.
    id: "supporters",
    value: "200+",
    label: "Supporters reached",
    icon: Users,
  },
  {
    // Percentage of published cases that completed the required verification process.
    id: "verified",
    value: "100%",
    label: "Cases verified",
    icon: ShieldCheck,
  },
] as const;
