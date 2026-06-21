"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import DonationsFilters from "@/src/components/dashboard/donations/DonationsFilters";
import DonationsStats from "@/src/components/dashboard/donations/DonationsStats";
import DonationsTable from "@/src/components/dashboard/donations/DonationsTable";
import { EmptyState } from "@/src/components/ui/empty-state";
import type {
  DonationRow,
  SortDirection,
  SortKey,
} from "@/src/components/dashboard/donations/types";
import {
  paymentApi,
  type DonationHistoryPayment,
} from "@/src/lib/api/payments";
import { useAuth } from "@/src/contexts/AuthContext";
import { PaymentStatus } from "@/src/types";

const PAGE_SIZE = 20;

type DonationsContentProps = {
  searchQuery: string;
};

export default function DonationsContent({ searchQuery }: DonationsContentProps) {
  const { user } = useAuth();
  const [rows, setRows] = useState<DonationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDonations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await paymentApi.getDonationHistory();
      setRows(
        history.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          date: payment.createdAt,
          campaignName: payment.campaign?.title || "Unknown campaign",
          status: payment.status,
          anonymous: payment.anonymous ?? false,
        }))
      );
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load your donations right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDonations();
  }, [fetchDonations]);

  useEffect(() => {
    const handleDonationRefresh = () => {
      void fetchDonations();
    };

    window.addEventListener("focus", handleDonationRefresh);
    window.addEventListener("torchlife:donation-verified", handleDonationRefresh as EventListener);

    return () => {
      window.removeEventListener("focus", handleDonationRefresh);
      window.removeEventListener("torchlife:donation-verified", handleDonationRefresh as EventListener);
    };
  }, [fetchDonations]);

  const summary = useMemo(() => {
    const totalAmount = rows.reduce((total, row) => total + row.amount, 0);
    const average = rows.length ? totalAmount / rows.length : 0;
    const campaigns = new Set(rows.map((row) => row.campaignName));

    return {
      totalAmount,
      average,
      campaignsSupported: campaigns.size,
    };
  }, [rows]);

  const filteredAndSortedRows = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      const matchesOrganization = row.campaignName
        .toLowerCase()
        .includes(organizationFilter.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : row.status === statusFilter;
      const searchTarget = [
        row.campaignName,
        row.status,
        row.amount.toString(),
        row.date.toLocaleDateString(),
        row.anonymous ? "anonymous" : "",
      ]
        .join(" ")
        .toLowerCase();
      const matchesGlobalSearch =
        normalizedSearchQuery.length === 0 ||
        searchTarget.includes(normalizedSearchQuery);
      return matchesOrganization && matchesStatus && matchesGlobalSearch;
    });

    return filtered.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortBy === "amount") return (a.amount - b.amount) * direction;
      if (sortBy === "campaignName") {
        return a.campaignName.localeCompare(b.campaignName) * direction;
      }
      return (a.date.getTime() - b.date.getTime()) * direction;
    });
  }, [organizationFilter, rows, searchQuery, sortBy, sortDirection, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedRows.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = filteredAndSortedRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const onSortChange = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(key);
    setSortDirection(key === "campaignName" ? "asc" : "desc");
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
        <p className="text-sm text-muted-foreground">
          Review all donations tied to your account, including campaign, amount, date, and status.
        </p>
      </header>

      <DonationsStats
        summary={summary}
        philanthropicName={user?.philanthropicName}
        impactScore={user?.impactScore}
        emergenciesSupported={user?.emergenciesSupported}
      />

      {!isLoading && !error && filteredAndSortedRows.length === 0 ? (
        <EmptyState
          title="No Donations"
          description="No donations yet. When you support a campaign, your donation history will appear here."
        />
      ) : (
        <>
          <DonationsFilters
            organizationFilter={organizationFilter}
            statusFilter={statusFilter}
            onOrganizationFilterChange={(value) => {
              setOrganizationFilter(value);
              setCurrentPage(1);
            }}
            onStatusFilterChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          />

          <DonationsTable
            isLoading={isLoading}
            error={error}
            rows={paginatedRows}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalRows={filteredAndSortedRows.length}
            totalPages={totalPages}
            onSortChange={onSortChange}
            onRetry={fetchDonations}
            onPreviousPage={() => setCurrentPage((previous) => previous - 1)}
            onNextPage={() => setCurrentPage((previous) => previous + 1)}
          />
        </>
      )}
    </section>
  );
}
