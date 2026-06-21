"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardShell from "@/src/modules/dashboard/components/DashboardShell";
import CampaignPageContent from "@/src/modules/campaign/components/CampaignPageContent";
import { useAuth } from "@/src/contexts/AuthContext";

export default function UserCampaignPage() {
  const { user, isLoading } = useAuth();
  const params = useParams<{ userId: string; campaignId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const userId = typeof params?.userId === "string" ? params.userId : "";
  const campaignId = typeof params?.campaignId === "string" ? params.campaignId : "";

  useEffect(() => {
    if (!isLoading && user && userId && campaignId && user.id !== userId) {
      window.location.replace(`/user/${encodeURIComponent(user.id)}/campaign/${encodeURIComponent(campaignId)}`);
    }
  }, [campaignId, isLoading, user, userId]);

  return (
    <DashboardShell
      activeItem="campaigns"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      <CampaignPageContent campaignId={campaignId} mode="dashboard" />
    </DashboardShell>
  );
}
