"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Spinner } from "@/src/components/ui/spinner";
import { EmptyState } from "@/src/components/ui/empty-state";
import { CampaignImage } from "@/src/components/shared/CampaignImage";
import CountdownLabel from "@/src/components/shared/CountdownLabel";
import { campaignApi } from "@/src/lib/api/campaigns";
import type { Campaign } from "@/src/types";
import {
  formatMoney,
  getCampaignPath,
  getCampaignDisplayStatus,
  getCampaignGoal,
  getCampaignProgress,
  getCampaignRaised,
} from "./dashboard-helpers";

const campaignThemes = [
  {
    outer: "bg-[linear-gradient(180deg,#7a1f17_0%,#b1362a_100%)]",
    shell: "bg-[#fbf4ef]",
    badge: "bg-[#cf4435] text-white",
    progress: "bg-[#cf4435]",
    button: "bg-[#8a6607] hover:bg-[#775807] text-white",
  },
  {
    outer: "bg-[linear-gradient(180deg,#13463f_0%,#18675c_100%)]",
    shell: "bg-[#f3f8f6]",
    badge: "bg-[#0f766e] text-white",
    progress: "bg-[#0f766e]",
    button: "bg-[#8a6607] hover:bg-[#775807] text-white",
  },
  {
    outer: "bg-[linear-gradient(180deg,#5b4a11_0%,#8f771d_100%)]",
    shell: "bg-[#f8f5e8]",
    badge: "bg-[#8f771d] text-white",
    progress: "bg-[#8f771d]",
    button: "bg-[#8a6607] hover:bg-[#775807] text-white",
  },
] as const;

type CampaignsContentProps = {
  searchQuery: string;
};

export default function CampaignsContent({ searchQuery }: CampaignsContentProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await campaignApi.getCampaigns();
      setCampaigns(response.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load campaigns right now."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCampaigns();
    window.addEventListener("torchlife:donation-verified", loadCampaigns as EventListener);

    return () => {
      window.removeEventListener("torchlife:donation-verified", loadCampaigns as EventListener);
    };
  }, [loadCampaigns]);

  const filteredCampaigns = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return campaigns;

    return campaigns.filter((campaign) => {
      return (
        campaign.title.toLowerCase().includes(normalizedSearch) ||
        getCampaignDisplayStatus(campaign).toLowerCase().includes(normalizedSearch)
      );
    });
  }, [campaigns, searchQuery]);

  return (
    <div className="space-y-6">
      <Card className="border-[#e6dcc8] bg-white/95 shadow-[0_24px_80px_-44px_rgba(8,28,25,0.24)]">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl text-[#132726]">Campaigns</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-[#556a66]">
            Support verified pregnancy care campaigns and follow the stories that need urgent help.
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Spinner className="mr-2" />
          Loading campaigns...
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load campaigns</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          title="No Campaigns"
          description="No campaigns yet. When campaigns are approved, they will appear here."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCampaigns.map((campaign, index) => {
            const theme = campaignThemes[index % campaignThemes.length];

            return (
              <article
                key={campaign.id}
                className={`h-full rounded-[1.55rem] p-1 shadow-[0_26px_80px_-36px_rgba(8,28,25,0.45)] transition-transform duration-300 hover:-translate-y-1 ${theme.outer}`}
              >
                <div className={`h-full rounded-[1.35rem] p-2 sm:rounded-[1.7rem] sm:p-3 ${theme.shell}`}>
                  <div className="flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-black/5 bg-white sm:rounded-[1.35rem]">
                    <Link
                      href={getCampaignPath(campaign.id, campaign.publicId)}
                      className="block transition-colors hover:bg-muted/20"
                    >
                      <div className="relative aspect-[5/4] min-h-[220px] overflow-hidden">
                        <CampaignImage
                          src={campaign.imageUrl || campaign.image_url}
                          alt={campaign.title}
                          wrapperClassName="h-full w-full"
                          imageClassName="transition-transform duration-500 hover:scale-[1.03]"
                        />
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
                            {getCampaignDisplayStatus(campaign)}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#0f766e] shadow-sm">
                            <CountdownLabel deadline={campaign.deadline ?? campaign.endDate} />
                          </span>
                        </div>
                      </div>

                      <div className="flex min-h-[240px] flex-1 flex-col space-y-3 p-3 sm:min-h-[270px] sm:space-y-5 sm:p-5">
                        <div className="space-y-1.5">
                          <h2 className="line-clamp-2 min-h-[3.4rem] text-[1.1rem] font-semibold leading-tight tracking-tight text-[#132726] sm:min-h-[4.75rem] sm:text-[1.55rem]">
                            {campaign.title}
                          </h2>
                          <p className="text-[12px] leading-5 text-[#485f5b] sm:text-sm sm:leading-6">
                            Category: {campaign.priority ?? "General"}
                          </p>
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#70837f]">
                                Raised
                              </p>
                              <p className="mt-1 text-[1.15rem] font-semibold tracking-tight text-[#0f4d46] sm:text-3xl">
                                {formatMoney(getCampaignRaised(campaign), campaign.currency)}
                              </p>
                            </div>
                            <p className="text-xs font-medium text-[#556a66] sm:text-sm">
                              Goal {formatMoney(getCampaignGoal(campaign), campaign.currency)}
                            </p>
                          </div>
                          <div className="mt-2.5 h-2 rounded-full bg-[#d9e5e1]">
                            <div
                              className={`h-2 rounded-full ${theme.progress}`}
                              style={{ width: `${Math.max(6, getCampaignProgress(campaign))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="grid gap-2 border-t p-3 sm:grid-cols-2 sm:p-4">
                    <Link href={getCampaignPath(campaign.id, campaign.publicId)} className="block">
                      <Button
                        variant="outline"
                        className="h-10 w-full rounded-2xl border-[#d8c8a7] bg-white px-3 text-xs text-[#183330] hover:bg-[#faf4e7] sm:h-11 sm:text-sm"
                      >
                        See full story
                      </Button>
                    </Link>
                    <Link href={`${getCampaignPath(campaign.id, campaign.publicId)}?donate=1`} className="block">
                      <Button className={`h-10 w-full rounded-2xl px-3 text-xs sm:h-11 sm:text-sm ${theme.button}`}>
                        Donate now
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
