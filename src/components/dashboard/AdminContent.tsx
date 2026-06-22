"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/empty-state";
import { CampaignImage } from "@/src/components/shared/CampaignImage";
import { Spinner } from "@/src/components/ui/spinner";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { campaignApi } from "@/src/lib/api/campaigns";
import { userApi } from "@/src/lib/api/users";
import type { AdminMetrics, Campaign } from "@/src/types";
import { formatMoney, getCampaignOwnerName, getDashboardCampaignLink } from "./dashboard-helpers";

const PAGE_SIZE = 20;

type AdminContentProps = {
  searchQuery: string;
};

const metricCards: Array<keyof AdminMetrics> = [
  "totalUsers",
  "totalCampaigns",
  "approvedCampaigns",
  "pendingCampaigns",
  "rejectedCampaigns",
  "expiredCampaigns",
  "totalDonations",
  "documentRequests",
  "proxyAccounts",
];

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

export default function AdminContent({ searchQuery }: AdminContentProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCampaigns = useCallback(
    async (nextPage: number, reset = false) => {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await campaignApi.getAdminCampaigns(nextPage, PAGE_SIZE, searchQuery);
        setCampaigns((previous) => (reset ? response.data : [...previous, ...response.data]));
        setPage(response.page);
        setHasMore(response.page < response.totalPages);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load admin campaigns.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery]
  );

  const loadMetrics = useCallback(async () => {
    try {
      setMetrics(await userApi.getAdminMetrics());
    } catch {
      setMetrics(null);
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadCampaigns(1, true), loadMetrics()]);
  }, [loadCampaigns, loadMetrics]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }
    void loadCampaigns(page + 1);
  }, [hasMore, isLoading, isLoadingMore, loadCampaigns, page]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadCampaigns(1, true), loadMetrics()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const sentinelRef = useInfiniteScroll({
    enabled: true,
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: loadMore,
  });

  const metricLabels: Record<keyof AdminMetrics, string> = useMemo(
    () => ({
      totalUsers: "Total Users",
      totalCampaigns: "Total Campaigns",
      approvedCampaigns: "Approved Campaigns",
      pendingCampaigns: "Pending Campaigns",
      rejectedCampaigns: "Rejected Campaigns",
      expiredCampaigns: "Expired Campaigns",
      totalDonations: "Total Donations",
      documentRequests: "Document Requests",
      proxyAccounts: "Proxy Accounts",
    }),
    []
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Admin Campaigns</CardTitle>
            <CardDescription>
              Review all campaigns with hospital, owner, proxy, and funding context. Open the detail page to moderate.
            </CardDescription>
          </div>
          <Button variant="outline" className="gap-2 self-start sm:self-auto" onClick={() => void handleRefresh()}>
            {isRefreshing ? <Spinner className="size-4" /> : <RefreshCw className="size-4" />}
            Refresh
          </Button>
        </CardHeader>
      </Card>

      {metrics ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((key) => (
            <Card key={key}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{metricLabels[key]}</p>
                <p className="mt-2 text-2xl font-semibold">{metrics[key]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Admin campaigns unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Spinner className="mr-2" />
          Loading admin campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns found"
          description="No campaigns matched the current admin search."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign, index) => {
            const ownerName = getCampaignOwnerName(campaign);
            const isProxyCampaign = campaign.proxyName || campaign.proxyEmail || campaign.proxyPhone;
            const theme = campaignThemes[index % campaignThemes.length];

            return (
              <article
                key={campaign.id}
                className={`rounded-[1.55rem] p-1 shadow-[0_26px_80px_-36px_rgba(8,28,25,0.45)] transition-transform duration-300 hover:-translate-y-1 ${theme.outer}`}
              >
                <div className={`rounded-[1.35rem] p-2 sm:rounded-[1.7rem] sm:p-3 ${theme.shell}`}>
                  <div className="overflow-hidden rounded-[1.1rem] border border-black/5 bg-white sm:rounded-[1.35rem]">
                    <Link href={getDashboardCampaignLink(campaign.id)} className="block">
                      <div className="relative aspect-[5/4] overflow-hidden">
                        <CampaignImage
                          src={campaign.imageUrl || campaign.image_url}
                          alt={campaign.title}
                          wrapperClassName="h-full w-full"
                          imageClassName="transition-transform duration-500 hover:scale-[1.03]"
                        />
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
                            {campaign.status}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#0f766e] shadow-sm">
                            {campaign.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="space-y-3 p-3 sm:space-y-5 sm:p-5">
                      <div>
                        <h2 className="line-clamp-2 text-[1.35rem] font-semibold leading-tight tracking-tight text-[#132726] sm:text-[1.8rem]">
                          {campaign.title}
                        </h2>
                        <p className="mt-1.5 text-[13px] leading-5 text-[#485f5b] sm:text-sm sm:leading-6">
                          Owner: <span className="font-medium text-[#132726]">{ownerName}</span>
                        </p>
                        <p className="text-[13px] leading-5 text-[#485f5b] sm:text-sm sm:leading-6">
                          Hospital: {campaign.hospitalName || campaign.location || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#70837f]">
                              Raised
                            </p>
                            <p className="mt-1 text-[1.35rem] font-semibold tracking-tight text-[#0f4d46] sm:text-3xl">
                              {formatMoney(campaign.amountRaised ?? 0, campaign.currency)}
                            </p>
                          </div>
                          <p className="text-xs font-medium text-[#556a66] sm:text-sm">
                            Goal {formatMoney(campaign.targetAmount ?? 0, campaign.currency)}
                          </p>
                        </div>
                      </div>

                      {isProxyCampaign ? (
                        <div className="grid gap-2 rounded-2xl border border-[#d8c8a7] bg-[#faf4e7] p-3 text-[13px] text-[#485f5b] sm:text-sm">
                          <p>Proxy Name: {campaign.proxyName || "Not provided"}</p>
                          <p>Proxy Email: {campaign.proxyEmail || "Not provided"}</p>
                          <p>Proxy Phone: {campaign.proxyPhone || "Not provided"}</p>
                          <p>Organization: {campaign.proxyOrganization || "Not provided"}</p>
                          <p>Proxy Campaign Count: {campaign.proxyCampaignCount ?? 0}</p>
                          <p>
                            Proxy Total Raised: {formatMoney(campaign.proxyTotalRaised ?? 0, campaign.currency)}
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-2 rounded-2xl border border-black/5 bg-white/80 p-3 text-[13px] text-[#485f5b] sm:text-sm">
                          <p>Status: {campaign.status}</p>
                          <p>Campaign Type: {campaign.type || "USER"}</p>
                        </div>
                      )}

                      <Link href={getDashboardCampaignLink(campaign.id)} className="block">
                        <Button variant="outline" className="h-10 w-full gap-2 text-xs sm:h-11 sm:text-sm">
                          <Eye className="size-4" />
                          View campaign detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          <div ref={sentinelRef} />
          {isLoadingMore ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <Spinner className="mr-2" />
              Loading more campaigns...
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
