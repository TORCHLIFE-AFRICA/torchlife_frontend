"use client";

import { useState } from "react";

import { Footer } from "@/src/components/landingPage/footer";
import { Navbar } from "@/src/components/landingPage/navbar";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <CampaignPageContent
            campaignId={campaignId}
            mode="public"
            initialCampaign={initialCampaign}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
