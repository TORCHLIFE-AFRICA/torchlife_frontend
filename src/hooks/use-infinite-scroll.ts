"use client";

import { useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  enabled: boolean;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
};

export function useInfiniteScroll({
  enabled,
  hasMore,
  isLoading,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !hasMore || isLoading || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [enabled, hasMore, isLoading, onLoadMore]);

  return sentinelRef;
}
