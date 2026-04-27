import { Building2, Coins, HandHeart } from "lucide-react";

import type { DonationSummary } from "@/src/components/dashboard/donations/types";
import { formatAmount } from "@/src/components/dashboard/donations/utils";

type DonationsStatsProps = {
  summary: DonationSummary;
};

export default function DonationsStats({ summary }: DonationsStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-2xl border bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
          <HandHeart className="size-4" />
          <span className="text-xs uppercase tracking-wide">Total donated</span>
        </div>
        <p className="text-2xl font-bold">{formatAmount(summary.totalAmount)}</p>
      </article>
      <article className="rounded-2xl border bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
          <Coins className="size-4" />
          <span className="text-xs uppercase tracking-wide">Average donation</span>
        </div>
        <p className="text-2xl font-bold">{formatAmount(summary.average)}</p>
      </article>
      <article className="rounded-2xl border bg-card p-4 sm:col-span-2 xl:col-span-1">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
          <Building2 className="size-4" />
          <span className="text-xs uppercase tracking-wide">Organizations supported</span>
        </div>
        <p className="text-2xl font-bold">{summary.organizationsCount}</p>
      </article>
    </div>
  );
}
