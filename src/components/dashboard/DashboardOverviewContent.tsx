"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { CampaignImage } from "@/src/components/shared/CampaignImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/empty-state";
import CountdownLabel from "@/src/components/shared/CountdownLabel";
import {
  DashboardCampaignCardSkeleton,
  DashboardMetricSkeleton,
} from "@/src/components/dashboard/dashboard-skeletons";
import { Skeleton } from "@/src/components/ui/skeleton";
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
} from "./dashboard-helpers";

type DashboardOverviewContentProps = {
  userName: string;
  searchQuery: string;
  onCreateCampaign: () => void;
};

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@torchlife.org";
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

  const loadDashboardCampaigns = useCallback(async () => {
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
          .slice(0, 6)
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
  }, [router]);

  useEffect(() => {
    void loadDashboardCampaigns();
    window.addEventListener("torchlife:donation-verified", loadDashboardCampaigns as EventListener);

    return () => {
      window.removeEventListener("torchlife:donation-verified", loadDashboardCampaigns as EventListener);
    };
  }, [loadDashboardCampaigns]);

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
            Keep up with every fundraiser, celebrate progress, and step in quickly when a mother needs more support.
          </p>
        </div>
        <Button className="gap-2 self-start lg:self-auto" onClick={onCreateCampaign}>
          <Plus className="size-4" />
          Create Campaign
        </Button>
      </section>

      {isLoading ? (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <DashboardMetricSkeleton key={index} />
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <DashboardCampaignCardSkeleton key={index} />
            ))}
          </div>
          <div className="space-y-4 rounded-3xl border bg-card p-6">
            <Skeleton className="h-6 w-52" />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <DashboardCampaignCardSkeleton key={index} compact />
              ))}
            </div>
          </div>
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
                <CardTitle>Your campaigns</CardTitle>
                <CardDescription>
                  Follow each fundraiser, check its status, and open the full story when you need to take action.
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
                  <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-2">
                    {filteredCampaigns.map((campaign, index) => {
                      const displayStatus = getCampaignDisplayStatus(campaign);
                      const deadline = campaign.deadline ?? campaign.endDate;
                      const theme = campaignThemes[index % campaignThemes.length];
                      const primaryHref =
                        campaign.status === "APPROVED" && campaign.publicId
                          ? getCampaignPath(campaign.id, campaign.publicId)
                          : getDashboardCampaignLink(campaign.id);

                      return (
                        <article
                          key={campaign.id}
                          className={`h-full rounded-[1.55rem] p-1 shadow-[0_26px_80px_-36px_rgba(8,28,25,0.45)] transition-transform duration-300 hover:-translate-y-1 ${theme.outer}`}
                        >
                          <div className={`h-full rounded-[1.35rem] p-2 sm:rounded-[1.7rem] sm:p-3 ${theme.shell}`}>
                            <div className="flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-black/5 bg-white sm:rounded-[1.35rem]">
                              <Link href={primaryHref} className="block">
                                <div className="relative aspect-[5/4] min-h-[220px] overflow-hidden">
                                  <CampaignImage
                                    src={campaign.imageUrl || campaign.image_url}
                                    alt={campaign.title}
                                    wrapperClassName="h-full w-full"
                                    imageClassName="transition-transform duration-500 hover:scale-[1.03]"
                                  />
                                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
                                      {displayStatus}
                                    </span>
                                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#0f766e] shadow-sm sm:text-[11px]">
                                      <CountdownLabel deadline={deadline} liveLabel className="tabular-nums" />
                                    </span>
                                  </div>
                                </div>
                              </Link>

                              <div className="flex min-h-[255px] flex-1 flex-col space-y-3 p-3 sm:min-h-[290px] sm:space-y-5 sm:p-5">
                                <div className="space-y-1.5">
                                  <h2 className="line-clamp-2 min-h-[3.4rem] text-[1.1rem] font-semibold leading-tight tracking-tight text-[#132726] sm:min-h-[4.75rem] sm:text-[1.55rem]">
                                    {campaign.title}
                                  </h2>
                                  <p className="text-[12px] leading-5 text-[#485f5b] sm:text-sm sm:leading-6">
                                    Category: {campaign.priority ?? "General"}
                                  </p>
                                  <p className="text-[12px] leading-5 text-[#485f5b] sm:text-sm sm:leading-6">
                                    Status: <span className="font-medium">{displayStatus}</span>
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

                                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                                  <Link href={primaryHref}>
                                    <Button
                                      variant="outline"
                                      className="h-10 w-full rounded-2xl border-[#d8c8a7] bg-white px-3 text-xs text-[#183330] hover:bg-[#faf4e7] sm:h-11 sm:text-sm"
                                    >
                                      See full story
                                    </Button>
                                  </Link>
                                  {campaign.publicId ? (
                                    <Link href={`${getCampaignPath(campaign.id, campaign.publicId)}?donate=1`}>
                                      <Button className={`h-10 w-full rounded-2xl px-3 text-xs sm:h-11 sm:text-sm ${theme.button}`}>
                                        Donate now
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Button
                                      disabled
                                      className={`h-10 w-full rounded-2xl px-3 text-xs opacity-70 sm:h-11 sm:text-sm ${theme.button}`}
                                    >
                                      Donate now
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
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
                  A quick snapshot of what needs your attention right now.
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
                  Open any campaign to review its story, share the link, follow approval updates, or request more time.
                </div>
                <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                  Keep sharing early. The first wave of support often helps later donors give with confidence.
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card className="overflow-hidden border-[#e6dcc8] bg-white/95 shadow-[0_24px_80px_-44px_rgba(8,28,25,0.24)]">
              <CardHeader className="border-b border-[#efe4d1]">
                <CardTitle>Recommended campaigns</CardTitle>
                <CardDescription>
                  Find women and families who need urgent pregnancy care support today.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {suggestedCampaigns.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    More verified campaigns will appear here as soon as they are ready for support.
                  </p>
                ) : (
                  <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
                    {suggestedCampaigns.map((campaign, index) => {
                      const theme = campaignThemes[index % campaignThemes.length];

                      return (
                        <article
                          key={campaign.id}
                          className={`h-full min-w-[84%] snap-start rounded-[1.55rem] p-1 shadow-[0_26px_80px_-36px_rgba(8,28,25,0.45)] transition-transform duration-300 hover:-translate-y-1 sm:min-w-[420px] lg:min-w-0 ${theme.outer}`}
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
                                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#0f766e] shadow-sm sm:text-[11px]">
                                      <CountdownLabel
                                        deadline={campaign.deadline ?? campaign.endDate}
                                        liveLabel
                                        className="tabular-nums"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </Link>
                              <div className="flex min-h-[250px] flex-1 flex-col space-y-3 p-3 sm:min-h-[285px] sm:space-y-5 sm:p-5">
                                <div className="space-y-1.5">
                                  <h3 className="line-clamp-2 min-h-[3.4rem] text-[1.1rem] font-semibold leading-tight tracking-tight text-[#132726] sm:min-h-[4.4rem] sm:text-[1.45rem]">
                                    {campaign.title}
                                  </h3>
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
                                <div className="grid gap-2 border-t pt-3 sm:grid-cols-2 sm:pt-4">
                                  <Link href={getCampaignPath(campaign.id, campaign.publicId)} className="block">
                                    <Button
                                      variant="outline"
                                      className="h-10 w-full rounded-2xl border-[#d8c8a7] bg-white px-3 text-xs text-[#183330] hover:bg-[#faf4e7] sm:h-11 sm:text-sm"
                                    >
                                      Learn more
                                    </Button>
                                  </Link>
                                  <Link
                                    href={`${getCampaignPath(campaign.id, campaign.publicId)}?donate=1`}
                                    className="block"
                                  >
                                    <Button className={`h-10 w-full rounded-2xl px-3 text-xs sm:h-11 sm:text-sm ${theme.button}`}>
                                      Donate now
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="max-w-xl bg-linear-to-br from-primary/5 via-emerald-50 to-background">
              <CardHeader>
                <CardTitle>Need help?</CardTitle>
                <CardDescription>
                  Reach the TorchLife team if you need help updating or sharing a campaign.
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
      )
      }
    </div >
  );
}
