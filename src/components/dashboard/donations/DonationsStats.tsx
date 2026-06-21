import { Award, Coins, HandHeart } from "lucide-react";

import type { DonationSummary } from "@/src/components/dashboard/donations/types";
import { formatAmount } from "@/src/components/dashboard/donations/utils";

type DonationsStatsProps = {
  summary: DonationSummary;
  philanthropicName?: string;
  impactScore?: number;
  emergenciesSupported?: number;
};

export default function DonationsStats({
  summary,
  philanthropicName,
  impactScore = 0,
  emergenciesSupported = 0,
}: DonationsStatsProps) {
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
          <Award className="size-4" />
          <span className="text-xs uppercase tracking-wide">Campaigns supported</span>
        </div>
        <p className="text-2xl font-bold">{summary.campaignsSupported || 0}</p>
      </article>
      <article className="rounded-2xl border bg-emerald-950 p-5 text-emerald-50 sm:col-span-2 xl:col-span-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Impact score</p>
            <h3 className="mt-2 text-xl font-semibold">
              {philanthropicName || "TorchLife donor"}
            </h3>
            <p className="mt-2 text-sm text-emerald-100">
              You have directly supported {emergenciesSupported} emergencies.
            </p>
            <p className="mt-1 text-sm text-emerald-200">
              This impact score contributes toward recognition during our annual appreciation event.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-800 bg-emerald-900 px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200">Impact score</p>
            <p className="mt-2 text-3xl font-bold">{impactScore}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
