"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionWrapper } from "./section-wrapper";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import CountdownLabel from "@/src/components/shared/CountdownLabel";
import { Spinner } from "@/src/components/ui/spinner";
import { campaignApi } from "@/src/lib/api/campaigns";
import type { Campaign } from "@/src/types";

interface Props {
  title?: string;
  showBrowse?: boolean;
}

const formatMoney = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const getDaysRemaining = (deadline?: Date) => {
  if (!deadline) return 0;
  const diff = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export function CampaignSamplesSection({ title, showBrowse = true }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await campaignApi.getCampaigns();
        setCampaigns(response.data.slice(0, 3));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load campaigns right now."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCampaigns();
  }, []);

  return (
    <SectionWrapper className="bg-muted/30" id="campaigns">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Campaigns
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {title || "Active Campaigns"}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Support approved healthcare campaigns that are now live on TorchLife.
          </p>
        </div>
        {showBrowse ? (
          <Link href="/campaigns" className="hidden md:block">
            <Button variant="outline">Browse all campaigns</Button>
          </Link>
        ) : null}
      </div>

      <div className="mt-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Spinner className="mr-2" />
            Loading campaigns...
          </div>
        ) : error ? (
          <div className="rounded-3xl border bg-background p-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-3xl border bg-background p-8 text-center">
            <h3 className="text-xl font-semibold">No live campaigns yet</h3>
            <p className="mt-2 text-muted-foreground">
              Approved campaigns will appear here as soon as they are available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => {
              const goal = campaign.targetAmount ?? campaign.fundingGoal ?? 0;
              const raised = campaign.amountRaised ?? campaign.currentAmount ?? 0;
              const progress = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

              return (
                <Link
                  key={campaign.id}
                  href={`/campaign/${campaign.publicId || campaign.id}`}
                  className="block"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl border bg-background shadow-sm transition-colors hover:bg-muted/20">
                    <img
                      src={campaign.imageUrl || campaign.image_url || "/torchlife-logo.png"}
                      alt={campaign.title}
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                          {campaign.status}
                        </span>
                        <span>
                          <CountdownLabel deadline={campaign.deadline ?? campaign.endDate} />
                        </span>
                      </div>

                      <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-semibold">
                        {campaign.title}
                      </h3>

                      <div className="space-y-2">
                        <Progress value={progress} />
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{formatMoney(raised, campaign.currency)}</span>
                          <span className="text-muted-foreground">
                            Goal {formatMoney(goal, campaign.currency)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">
                          Category: {campaign.priority ?? "General"}
                        </span>
                        <Button className="pointer-events-none">View campaign</Button>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
