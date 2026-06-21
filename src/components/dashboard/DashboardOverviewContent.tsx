"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Spinner } from "@/src/components/ui/spinner";
import { EmptyState } from "@/src/components/ui/empty-state";
import CountdownLabel from "@/src/components/shared/CountdownLabel";
import { authApi } from "@/src/lib/api/auth";
import { campaignApi } from "@/src/lib/api/campaigns";
import { ApiClientError } from "@/src/lib/api/client";
import type { Campaign } from "@/src/types";
import {
  formatMoney,
  getCampaignPath,
  getDashboardCampaignLink,
  getCampaignDisplayStatus,
  getCampaignGoal,
  getCampaignOwnerName,
  getCampaignProgress,
  getCampaignRaised,
  type DashboardCampaignStatus,
} from "./dashboard-helpers";

type DashboardOverviewContentProps = {
  userName: string;
  searchQuery: string;
  onCreateCampaign: () => void;
};

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@torchlife.co";

const statusClassNames: Record<DashboardCampaignStatus, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Completed: "border-primary/20 bg-primary/10 text-primary",
  Expired: "border-amber-200 bg-amber-50 text-amber-700",
  "Pending Approval": "border-sky-200 bg-sky-50 text-sky-700",
  "Pending Extension Approval": "border-violet-200 bg-violet-50 text-violet-700",
  Rejected: "border-destructive/20 bg-destructive/10 text-destructive",
};

export default function DashboardOverviewContent({
  userName,
  searchQuery,
  onCreateCampaign,
}: DashboardOverviewContentProps) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [suggestedCampaigns, setSuggestedCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardCampaigns = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [userCampaignsResponse, publicCampaignsResponse] = await Promise.all([
          campaignApi.getUserCampaigns(1, 24),
          campaignApi.getCampaigns(),
        ]);

        const userCampaigns = userCampaignsResponse.data;
        const userCampaignIds = new Set(userCampaigns.map((campaign) => campaign.id));
        setCampaigns(userCampaigns);

        setSuggestedCampaigns(
          publicCampaignsResponse.data
            .filter((campaign) => !userCampaignIds.has(campaign.id))
            .slice(0, 3)
        );
      } catch (loadError) {
        if (loadError instanceof ApiClientError && loadError.status === 401) {
          try {
            await authApi.logout();
          } catch {
          }
          setError("Your session expired. Please sign in again to view your dashboard.");
          router.replace("/auth?auth=signIn");
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your dashboard campaigns right now."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const refreshDashboardCampaigns = () => {
      void loadDashboardCampaigns();
    };

    void loadDashboardCampaigns();
    window.addEventListener("focus", refreshDashboardCampaigns);
    window.addEventListener("torchlife:donation-verified", refreshDashboardCampaigns as EventListener);

    return () => {
      window.removeEventListener("focus", refreshDashboardCampaigns);
      window.removeEventListener("torchlife:donation-verified", refreshDashboardCampaigns as EventListener);
    };
  }, [router]);

  const filteredCampaigns = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return campaigns;

    return campaigns.filter((campaign) => {
      const displayStatus = getCampaignDisplayStatus(campaign).toLowerCase();
      const ownerName = getCampaignOwnerName(campaign).toLowerCase();
      return (
        campaign.title.toLowerCase().includes(normalizedSearch) ||
        (campaign.story || campaign.description || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        ownerName.includes(normalizedSearch) ||
        displayStatus.includes(normalizedSearch)
      );
    });
  }, [campaigns, searchQuery]);

  const summary = useMemo(() => {
    return campaigns.reduce(
      (accumulator, campaign) => {
        const status = getCampaignDisplayStatus(campaign);
        accumulator.total += 1;
        if (status === "Active") accumulator.active += 1;
        if (status === "Pending Approval") accumulator.pending += 1;
        if (status === "Rejected") accumulator.rejected += 1;
        if (status === "Expired") accumulator.expired += 1;
        return accumulator;
      },
      {
        total: 0,
        active: 0,
        pending: 0,
        rejected: 0,
        expired: 0,
      }
    );
  }, [campaigns]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-4 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Dashboard</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {userName}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track your active, completed, expired, pending, and rejected campaigns in one place.
          </p>
        </div>
        <Button className="gap-2 self-start lg:self-auto" onClick={onCreateCampaign}>
          <Plus className="size-4" />
          Create Campaign
        </Button>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Spinner className="mr-2" />
          Loading your fundraising overview...
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load your campaigns</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <section className="grid gap-4 lg:gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="gap-0 overflow-hidden py-0">
              <CardHeader className="border-b px-4 py-4 sm:px-6 sm:py-5">
                <CardTitle>Fundraisers List</CardTitle>
                <CardDescription>
                  Every card is preview-only. Open its dedicated campaign page for full details,
                  status, and actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredCampaigns.length === 0 ? (
                  <div className="px-4 py-8 sm:px-6 sm:py-10">
                    <EmptyState
                      title="No Campaign Yet"
                      description="Start a campaign and begin receiving support from compassionate donors."
                      actionLabel="Create Campaign"
                      onAction={onCreateCampaign}
                    />
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredCampaigns.map((campaign) => {
                      const displayStatus = getCampaignDisplayStatus(campaign);
                      const deadline = campaign.deadline ?? campaign.endDate;

                      return (
                        <Link
                          key={campaign.id}
                          href={
                            campaign.status === "APPROVED" && campaign.publicId
                              ? getCampaignPath(campaign.id, campaign.publicId)
                              : getDashboardCampaignLink(campaign.id)
                          }
                          className="block transition-colors hover:bg-muted/40"
                        >
                          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5">
                            <img
                              src={campaign.imageUrl || campaign.image_url || "/torchlife-logo.png"}
                              alt={campaign.title}
                              className="h-24 w-full rounded-2xl object-cover"
                            />
                            <div className="min-w-0 flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`rounded-full ${statusClassNames[displayStatus]}`}
                                >
                                  {displayStatus}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  <CountdownLabel deadline={deadline} />
                                </span>
                              </div>
                              <div className="space-y-2">
                                <h2 className="line-clamp-2 text-base font-semibold sm:text-lg">
                                  {campaign.title}
                                </h2>
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
                              <div className="text-xs text-muted-foreground">
                                Category: {campaign.priority ?? "General"}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="py-0 xl:sticky xl:top-24">
              <CardHeader className="border-b px-4 py-4 sm:px-6 sm:py-5">
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  The dedicated campaign page is the source of truth for campaign information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6">
                <div className="grid gap-3 rounded-2xl bg-muted/30 p-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Total campaigns</p>
                    <p className="mt-1 text-2xl font-semibold">{summary.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active</p>
                    <p className="mt-1 text-2xl font-semibold">{summary.active}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending approval</p>
                    <p className="mt-1 text-2xl font-semibold">{summary.pending}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expired</p>
                    <p className="mt-1 text-2xl font-semibold">{summary.expired}</p>
                  </div>
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                  Open any fundraiser to view its story, beneficiary details, approval state, sharing
                  actions, and extension workflow.
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                  Card previews stay minimal here so the full campaign detail page remains the only
                  source of truth.
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Other Campaigns You May Support</CardTitle>
                <CardDescription>
                  A short discovery row inside your dashboard, using the same live campaign data.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {suggestedCampaigns.length === 0 ? (
                  <p className="md:col-span-3 text-sm text-muted-foreground">
                    More campaigns will appear here as approved campaigns become available.
                  </p>
                ) : (
                  suggestedCampaigns.map((campaign) => (
                    <article
                      key={campaign.id}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border bg-background"
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
                        <div className="flex flex-1 flex-col gap-3 p-4">
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span>{getCampaignDisplayStatus(campaign)}</span>
                            <span>
                              <CountdownLabel deadline={campaign.deadline ?? campaign.endDate} />
                            </span>
                          </div>
                          <h3 className="line-clamp-2 min-h-12 font-semibold">{campaign.title}</h3>
                          <div className="space-y-2">
                            <Progress value={getCampaignProgress(campaign)} />
                            <div className="flex items-center justify-between text-xs">
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
                        <Link
                          href={`${getCampaignPath(campaign.id, campaign.publicId)}?donate=1`}
                          className="block"
                        >
                          <Button className="w-full">Donate now</Button>
                        </Link>
                      </div>
                    </article>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-primary/5 via-emerald-50 to-background">
              <CardHeader>
                <CardTitle>Need help?</CardTitle>
                <CardDescription>
                  Reach the TorchLife team directly if you need support with your campaigns.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Support email</p>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="mt-1 inline-block text-base font-semibold text-primary"
                  >
                    {supportEmail}
                  </a>
                </div>
                <div className="rounded-2xl border bg-background/80 p-4 text-sm text-muted-foreground">
                  Keep sharing your campaign early. Early support often increases trust for later donors.
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  Your expired campaigns remain visible so extension requests can be added next without losing campaign history.
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
