"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Spinner } from "@/src/components/ui/spinner";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { userApi } from "@/src/lib/api/users";
import type { AdminUserDirectoryEntry } from "@/src/types";

const PAGE_SIZE = 20;

type UsersContentProps = {
  searchQuery: string;
};

export default function UsersContent({ searchQuery }: UsersContentProps) {
  const [users, setUsers] = useState<AdminUserDirectoryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(
    async (nextPage: number, reset = false) => {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await userApi.getAdminDirectory(nextPage, PAGE_SIZE, searchQuery);
        setUsers((previous) => (reset ? response.data : [...previous, ...response.data]));
        setPage(response.page);
        setHasMore(response.page < response.totalPages);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load users.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    void loadUsers(1, true);
  }, [loadUsers]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isLoading) {
      return;
    }
    void loadUsers(page + 1);
  }, [hasMore, isLoading, isLoadingMore, loadUsers, page]);

  const sentinelRef = useInfiniteScroll({
    enabled: true,
    hasMore,
    isLoading: isLoadingMore || isLoading,
    onLoadMore: loadMore,
  });

  const content = useMemo(() => {
    if (!isLoading && !error && users.length === 0) {
      return (
        <EmptyState
          title="No users found"
          description="No users matched the current search."
        />
      );
    }

    return (
      <div className="grid gap-4">
        {users.map((user) => {
          const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.trim() || "TL";

          return (
            <Card key={user.id} className="rounded-3xl">
              <CardContent className="grid gap-4 p-5 lg:grid-cols-[auto_1fr]">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {initials.toUpperCase()}
                </div>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.phoneNumber || "No phone number"}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>Role: {user.role}</p>
                    <p>Registered: {user.createdAt.toLocaleDateString()}</p>
                    <p>Philanthropic: {user.philanthropicName || "Not set"}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>Impact score: {user.impactScore}</p>
                    <p>Donations: {user.donationCount}</p>
                    <p>Campaigns: {user.campaignCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <div ref={sentinelRef} />
        {isLoadingMore ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Spinner className="mr-2" />
            Loading more users...
          </div>
        ) : null}
      </div>
    );
  }, [error, isLoading, isLoadingMore, sentinelRef, users]);

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Review platform users with server-side pagination and infinite loading.
          </CardDescription>
        </CardHeader>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Users unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border bg-card px-6 py-16 text-sm text-muted-foreground">
          <Spinner className="mr-2" />
          Loading users...
        </div>
      ) : (
        content
      )}
    </section>
  );
}
