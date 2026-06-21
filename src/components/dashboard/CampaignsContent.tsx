"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Spinner } from "@/src/components/ui/spinner";
import { EmptyState } from "@/src/components/ui/empty-state";
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

type CampaignsContentProps = {
  searchQuery: string;
};

export default function CampaignsContent({ searchQuery }: CampaignsContentProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
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
    };

    const refreshCampaigns = () => {
      void loadCampaigns();
    };

    void loadCampaigns();
    window.addEventListener("focus", refreshCampaigns);
    window.addEventListener("torchlife:donation-verified", refreshCampaigns as EventListener);

    return () => {
      window.removeEventListener("focus", refreshCampaigns);
      window.removeEventListener("torchlife:donation-verified", refreshCampaigns as EventListener);
    };
  }, []);

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
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>
            Discover approved public campaigns without leaving the dashboard.
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <article
              key={campaign.id}
              className="flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm"
            >
              <Link
                href={getCampaignPath(campaign.id, campaign.publicId)}
                className="block transition-colors hover:bg-muted/20"
              >
                <img
                  src={campaign.imageUrl || campaign.image_url || "/torchlife-logo.png"}
                  alt={campaign.title}
                  className="aspect-16/10 w-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="rounded-full">
                      {getCampaignDisplayStatus(campaign)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      <CountdownLabel deadline={campaign.deadline ?? campaign.endDate} />
                    </span>
                  </div>

                  <h2 className="line-clamp-2 min-h-14 text-xl font-semibold">
                    {campaign.title}
                  </h2>

                  <div className="space-y-2">
                    <Progress value={getCampaignProgress(campaign)} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {formatMoney(getCampaignRaised(campaign), campaign.currency)}
                      </span>
                      <span className="text-muted-foreground">
                        Goal {formatMoney(getCampaignGoal(campaign), campaign.currency)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto text-xs text-muted-foreground">
                    Category: {campaign.priority ?? "General"}
                  </div>
                </div>
              </Link>
              <div className="grid gap-2 border-t p-4 sm:grid-cols-2">
                <Link href={getCampaignPath(campaign.id, campaign.publicId)} className="block">
                  <Button variant="outline" className="w-full">
                    View details
                  </Button>
                </Link>
                <Link href={`${getCampaignPath(campaign.id, campaign.publicId)}?donate=1`} className="block">
                  <Button className="w-full">Donate now</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
