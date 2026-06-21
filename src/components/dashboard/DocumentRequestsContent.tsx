"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Spinner } from "@/src/components/ui/spinner";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { campaignApi } from "@/src/lib/api/campaigns";
import { notifyError, notifySuccess } from "@/src/lib/notify";
import type { SupportingDocumentRequest } from "@/src/types";

const PAGE_SIZE = 20;

type DocumentRequestsContentProps = {
  searchQuery: string;
};

type RequestFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function DocumentRequestsContent({ searchQuery }: DocumentRequestsContentProps) {
  const [requests, setRequests] = useState<SupportingDocumentRequest[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<RequestFilter>("ALL");

  const loadRequests = useCallback(
    async (nextPage: number, reset = false) => {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await campaignApi.listAllSupportingDocumentRequests(
          nextPage,
          PAGE_SIZE,
          searchQuery
        );
        setRequests((previous) => (reset ? response.data : [...previous, ...response.data]));
        setPage(response.page);
        setHasMore(response.page < response.totalPages);
        setError(null);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load document requests.";
        setError(message);
        notifyError("Document requests unavailable", message);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    void loadRequests(1, true);
  }, [loadRequests]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }
    void loadRequests(page + 1);
  }, [hasMore, isLoading, isLoadingMore, loadRequests, page]);

  const sentinelRef = useInfiniteScroll({
    enabled: true,
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: loadMore,
  });

  const handleReview = async (requestId: string, approve: boolean) => {
    try {
      await campaignApi.reviewSupportingDocumentRequest(requestId, approve);
      setRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? {
              ...request,
              status: approve ? "APPROVED" : "REJECTED",
              reviewedAt: new Date(),
            }
            : request
        )
      );
      notifySuccess(
        approve ? "Document request approved" : "Document request rejected",
        "The request status has been updated."
      );
    } catch (reviewError) {
      notifyError(
        "Review failed",
        reviewError instanceof Error ? reviewError.message : "Unable to update the request."
      );
    }
  };

  const content = useMemo(() => {
    const filteredRequests =
      activeFilter === "ALL"
        ? requests
        : requests.filter((request) => request.status === activeFilter);

    if (!isLoading && !error && filteredRequests.length === 0) {
      return (
        <EmptyState
          title="No document requests"
          description={
            activeFilter === "ALL"
              ? "No supporting-document requests matched the current search."
              : `No ${activeFilter.toLowerCase()} document requests matched the current search.`
          }
        />
      );
    }

    return (
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="rounded-3xl">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold">Request ID: {request.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Campaign: {request.campaign?.title || "Unknown campaign"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Requester: {request.user?.philanthropicName || request.user?.email || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {request.user?.email || "Not available"}
                  </p>
                </div>
                <Badge variant="outline">{request.status}</Badge>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                <p>Requested: {request.requestedAt.toLocaleString()}</p>
                <p>Approved At: {request.reviewedAt ? request.reviewedAt.toLocaleString() : "Pending"}</p>
                <p>Approved By: {request.reviewedBy?.philanthropicName || request.reviewedBy?.email || "Pending"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => void handleReview(request.id, true)}>
                  Approve
                </Button>
                <Button variant="outline" onClick={() => void handleReview(request.id, false)}>
                  Reject
                </Button>
                {request.campaign?.id ? (
                  <Link href={`/dashboard/campaign/${request.campaign.id}`}>
                    <Button variant="outline">View Campaign</Button>
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
        <div ref={sentinelRef} />
        {isLoadingMore ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Spinner className="mr-2" />
            Loading more requests...
          </div>
        ) : null}
      </div>
    );
  }, [activeFilter, error, isLoading, isLoadingMore, requests, sentinelRef]);

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Requests</CardTitle>
          <CardDescription>
            Review supporting-document requests, approve or reject them, and open the linked campaign.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <Button
              key={status}
              type="button"
              variant={activeFilter === status ? "default" : "outline"}
              onClick={() => setActiveFilter(status)}
            >
              {status === "ALL" ? "All" : status}
            </Button>
          ))}
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Document requests unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Spinner className="mr-2" />
          Loading document requests...
        </div>
      ) : (
        content
      )}
    </section>
  );
}
