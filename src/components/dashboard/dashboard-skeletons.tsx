"use client";

import { Skeleton } from "@/src/components/ui/skeleton";

type CampaignCardSkeletonProps = {
  compact?: boolean;
};

export function DashboardSectionIntroSkeleton() {
  return (
    <div className="rounded-3xl border-[#e6dcc8] bg-white/95 p-6 shadow-[0_24px_80px_-44px_rgba(8,28,25,0.24)]">
      <Skeleton className="h-4 w-24 rounded-full" />
      <Skeleton className="mt-4 h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-full max-w-xl" />
    </div>
  );
}

export function DashboardMetricSkeleton() {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-3 h-9 w-24" />
    </div>
  );
}

export function DashboardCampaignCardSkeleton({
  compact = false,
}: CampaignCardSkeletonProps) {
  return (
    <article className="h-full rounded-[1.55rem] bg-[linear-gradient(180deg,#d9d0bd_0%,#ece5d4_100%)] p-1 shadow-[0_26px_80px_-36px_rgba(8,28,25,0.22)]">
      <div className="h-full rounded-[1.35rem] bg-[#f8f3ea] p-2 sm:rounded-[1.7rem] sm:p-3">
        <div className="flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-black/5 bg-white sm:rounded-[1.35rem]">
          <div className="relative aspect-[5/4] min-h-[220px] overflow-hidden">
            <Skeleton className="h-full w-full rounded-none" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <Skeleton className="h-7 w-24 rounded-full bg-white/80" />
              <Skeleton className="h-7 w-28 rounded-full bg-white/80" />
            </div>
          </div>

          <div
            className={`flex flex-1 flex-col p-3 sm:p-5 ${
              compact ? "min-h-[240px] space-y-3 sm:min-h-[270px]" : "min-h-[255px] space-y-3 sm:min-h-[290px] sm:space-y-5"
            }`}
          >
            <div className="space-y-2">
              <Skeleton className="h-6 w-full max-w-[92%]" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-28" />
              {!compact ? <Skeleton className="h-4 w-32" /> : null}
            </div>

            <div className="mt-auto">
              <div className="flex items-end justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-28 sm:h-10 sm:w-36" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="mt-3 h-2 w-full rounded-full" />
            </div>

            {!compact ? (
              <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                <Skeleton className="h-10 w-full rounded-2xl sm:h-11" />
                <Skeleton className="h-10 w-full rounded-2xl sm:h-11" />
              </div>
            ) : null}
          </div>

          {compact ? (
            <div className="grid gap-2 border-t p-3 sm:grid-cols-2 sm:p-4">
              <Skeleton className="h-10 w-full rounded-2xl sm:h-11" />
              <Skeleton className="h-10 w-full rounded-2xl sm:h-11" />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
