"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/empty-state";
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
        <div className="grid gap-6">
          {campaigns.map((campaign) => {
            const ownerName = getCampaignOwnerName(campaign);
            const isProxyCampaign = campaign.proxyName || campaign.proxyEmail || campaign.proxyPhone;

            return (
              <Card key={campaign.id} className="overflow-hidden rounded-3xl">
                <CardContent className="grid gap-5 p-5 lg:grid-cols-[220px_1fr]">
                  <img
                    src={campaign.imageUrl || campaign.image_url || "/torchlife-logo.png"}
                    alt={campaign.title}
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h2 className="text-xl font-semibold">{campaign.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          Owner: <span className="font-medium text-foreground">{ownerName}</span>
                        </p>
                      </div>
                      <Badge variant="outline">{campaign.status}</Badge>
                    </div>

                    <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <p>Raised: {formatMoney(campaign.amountRaised ?? 0, campaign.currency)}</p>
                      <p>Target: {formatMoney(campaign.targetAmount ?? 0, campaign.currency)}</p>
                      <p>Hospital: {campaign.hospitalName || campaign.location || "Not provided"}</p>
                      <p>Created: {campaign.createdAt.toLocaleDateString()}</p>
                    </div>

                    {isProxyCampaign ? (
                      <div className="grid gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm md:grid-cols-2 xl:grid-cols-3">
                        <p>Proxy Name: {campaign.proxyName || "Not provided"}</p>
                        <p>Proxy Email: {campaign.proxyEmail || "Not provided"}</p>
                        <p>Proxy Phone: {campaign.proxyPhone || "Not provided"}</p>
                        <p>Proxy Organization: {campaign.proxyOrganization || "Not provided"}</p>
                        <p>Total Proxy Campaign Count: {campaign.proxyCampaignCount ?? 0}</p>
                        <p>
                          Proxy Total Raised: {formatMoney(campaign.proxyTotalRaised ?? 0, campaign.currency)}
                        </p>
                      </div>
                    ) : null}

                    <Link href={getDashboardCampaignLink(campaign.id)} className="block">
                      <Button variant="outline" className="w-full gap-2">
                        <Eye className="size-4" />
                        View campaign detail
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
