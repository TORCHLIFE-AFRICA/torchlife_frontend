"use client";

import { useState } from "react";

import { PublicSiteFooter, PublicSiteHeader } from "@/src/components/landingPage/PublicSiteChrome";
import { useAuth } from "@/src/contexts/AuthContext";
import { UserRole } from "@/src/types";
import DashboardShell from "@/src/modules/dashboard/components/DashboardShell";
import type { Campaign } from "@/src/types";
import CampaignPageContent from "./CampaignPageContent";

type PublicCampaignRouteProps = {
  campaignId: string;
  initialCampaign?: Campaign | null;
};

export default function PublicCampaignRoute({
  campaignId,
  initialCampaign = null,
}: PublicCampaignRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading campaign experience...
      </div>
    );
  }

  if (isAuthenticated && user) {
    const activeItem =
      user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
        ? "admin-campaigns"
        : "campaigns";

    return (
      <DashboardShell
        activeItem={activeItem}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      >
        <CampaignPageContent campaignId={campaignId} mode="dashboard" initialCampaign={initialCampaign} />
      </DashboardShell>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2ea]">
      <PublicSiteHeader />
      <section className="px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <CampaignPageContent
            campaignId={campaignId}
            mode="public"
            initialCampaign={initialCampaign}
          />
        </div>
      </section>
      <PublicSiteFooter />
    </div>
  );
}
