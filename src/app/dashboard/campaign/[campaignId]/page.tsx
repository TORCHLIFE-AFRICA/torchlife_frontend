"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import CampaignPageContent from "@/src/modules/campaign/components/CampaignPageContent";
import { useAuth } from "@/src/contexts/AuthContext";
import { UserRole } from "@/src/types";
import DashboardShell from "@/src/modules/dashboard/components/DashboardShell";

export default function DashboardCampaignPage() {
  const { user } = useAuth();
  const params = useParams<{ campaignId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const activeItem =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN
      ? "admin-campaigns"
      : "campaigns";
  const campaignId = typeof params?.campaignId === "string" ? params.campaignId : "";

  return (
    <DashboardShell
      activeItem={activeItem}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      {campaignId ? <CampaignPageContent campaignId={campaignId} mode="dashboard" /> : null}
    </DashboardShell>
  );
}
