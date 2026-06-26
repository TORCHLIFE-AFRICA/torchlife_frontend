"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AdminContent from "@/src/components/dashboard/AdminContent";
import CampaignsContent from "@/src/components/dashboard/CampaignsContent";
import CreateCampaignContent from "@/src/components/dashboard/CreateCampaignContent";
import DashboardOverviewContent from "@/src/components/dashboard/DashboardOverviewContent";
import DonationsContent from "@/src/components/dashboard/donations/DonationsContent";
import DocumentRequestsContent from "@/src/components/dashboard/DocumentRequestsContent";
import ProfileContent from "@/src/components/dashboard/ProfileContent";
import UsersContent from "@/src/components/dashboard/UsersContent";
import BrandedScreenLoader from "@/src/components/shared/BrandedScreenLoader";
import { useAuth } from "@/src/contexts/AuthContext";
import { UserRole } from "@/src/types";
import DashboardShell from "@/src/modules/dashboard/components/DashboardShell";

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const activeItem = useMemo(() => {
    const tab = searchParams.get("tab") ?? "dashboard";
    const role = user?.role ?? UserRole.USER;
    const roleAccess: Record<string, UserRole[]> = {
      dashboard: [UserRole.USER, UserRole.PROXY, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      campaigns: [UserRole.USER, UserRole.PROXY, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      donations: [UserRole.USER, UserRole.PROXY, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      profile: [UserRole.USER, UserRole.PROXY, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      "create-campaign": [UserRole.USER, UserRole.PROXY, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      "admin-campaigns": [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      users: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      "document-requests": [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    };
    return roleAccess[tab]?.includes(role) ? tab : "dashboard";
  }, [searchParams, user?.role]);

  const renderContent = () => {
    if (activeItem === "campaigns") {
      return <CampaignsContent searchQuery={searchQuery} />;
    }

    if (activeItem === "donations") {
      return <DonationsContent searchQuery={searchQuery} />;
    }

    if (activeItem === "profile" && user) {
      return <ProfileContent user={user} />;
    }

    if (activeItem === "create-campaign") {
      return <CreateCampaignContent />;
    }

    if (activeItem === "admin-campaigns") {
      return <AdminContent searchQuery={searchQuery} />;
    }

    if (activeItem === "users") {
      return <UsersContent searchQuery={searchQuery} />;
    }

    if (activeItem === "document-requests") {
      return <DocumentRequestsContent searchQuery={searchQuery} />;
    }

    return user ? (
      <DashboardOverviewContent
        userName={user.philanthropicName || `${user.firstName} ${user.lastName}`.trim() || "User"}
        searchQuery={searchQuery}
        onCreateCampaign={() => router.push("/dashboard?tab=create-campaign")}
      />
    ) : null;
  };

  return (
    <DashboardShell
      activeItem={activeItem}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      {renderContent()}
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<BrandedScreenLoader message="Loading your dashboard..." fullScreen={false} />}>
      <DashboardPageContent />
    </Suspense>
  );
}
