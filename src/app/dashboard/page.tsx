"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BellRing, HandCoins, LayoutDashboard, Repeat } from "lucide-react";

import DonationsContent from "@/src/components/dashboard/donations/DonationsContent";
import Footer from "@/src/components/dashboard/Footer";
import MainContent from "@/src/components/dashboard/MainContent";
import Navbar from "@/src/components/dashboard/Navbar";
import Sidebar, { type SidebarItem } from "@/src/components/dashboard/Sidebar";
import { useAuth } from "@/src/contexts/AuthContext";
import type {
  ExpertResource,
  FooterGroup,
  FundraiserAction,
  ImpactArea,
} from "@/src/components/dashboard/types";
import { UserRole } from "@/src/types";

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "donations", label: "Donations", icon: HandCoins },
  { id: "transfers", label: "Transfers", icon: Repeat },
  { id: "updates", label: "Updates", icon: BellRing },
];

const fundraiserActions: FundraiserAction[] = [
  { id: "edit", label: "Edit" },
  { id: "copy-link", label: "Copy link" },
  { id: "transfer", label: "Set up transfers" },
];

const impactAreas: ImpactArea[] = [
  { id: "boost", title: "Boost fundraiser", progressLabel: "0 of 5" },
  { id: "share", title: "Share early and often", progressLabel: "0 of 4" },
  { id: "team", title: "Build a team", progressLabel: "0 of 3" },
];

const expertResources: ExpertResource[] = [
  {
    id: "tips",
    title: "Tips & templates for writing thank you notes",
    readTime: "5 min read",
    image: "/people-using-smartphone-social-media-charity.jpg",
    featured: true,
  },
  {
    id: "stalls",
    title: "What to do when your fundraiser stalls",
    readTime: "6 min read",
    image: "/maternal-healthcare-africa-clinic.jpg",
  },
  {
    id: "fundraising",
    title: "Ideas for online and in-person fundraising",
    readTime: "10 min read",
    image: "/pregnant-african-woman-smiling-in-modern-hospital-.jpg",
  },
];

const footerGroups: FooterGroup[] = [
  { id: "fundraise", title: "Fundraise for", links: ["Medical", "Emergency", "Education", "Nonprofit"] },
  {
    id: "learn",
    title: "Learn more",
    links: ["How TorchLife Africa works", "Success stories", "Charity fundraising", "Pricing"],
  },
  { id: "resources", title: "Resources", links: ["Help center", "Blog", "Careers", "About"] },
  { id: "apps", title: "Get the app", links: ["iOS App Store", "Android Play Store"] },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const roleAwareSidebarItems = useMemo(() => {
    const role = user?.role ?? UserRole.BACKER;
    const roleAccess: Record<string, UserRole[]> = {
      dashboard: [UserRole.BACKER, UserRole.CREATOR, UserRole.ADMIN, UserRole.MODERATOR],
      donations: [UserRole.BACKER, UserRole.CREATOR, UserRole.ADMIN],
      transfers: [UserRole.CREATOR, UserRole.ADMIN],
      updates: [UserRole.CREATOR, UserRole.ADMIN, UserRole.MODERATOR],
    };
    return sidebarItems.filter((item) => roleAccess[item.id]?.includes(role));
  }, [user?.role]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth?auth=signIn");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!user?.id) return;
    window.localStorage.setItem(
      `dashboard_sidebar_collapsed_${user.id}`,
      String(isDesktopCollapsed)
    );
  }, [isDesktopCollapsed, user?.id]);

  useEffect(() => {
    if (!roleAwareSidebarItems.find((item) => item.id === activeItem)) {
      setActiveItem("dashboard");
    }
  }, [activeItem, roleAwareSidebarItems]);

  const handleSelectItem = (itemId: string) => {
    setActiveItem(itemId);
    setIsMobileSidebarOpen(false);
  };

  const renderContent = () => {
    if (activeItem === "donations") {
      return <DonationsContent searchQuery={searchQuery} userId={user?.id ?? ""} />;
    }

    return (
      <MainContent
        userName={user?.name ?? "User"}
        fundraiserTitle="Let's save the life of a pregnant woman and her child"
        goalAmount="₦1,000,000"
        actions={fundraiserActions}
        impactAreas={impactAreas}
        resources={expertResources}
        searchQuery={searchQuery}
      />
    );
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName={user.name}
        notificationCount={2}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar
          items={roleAwareSidebarItems}
          activeItem={activeItem}
          onSelectItem={handleSelectItem}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopCollapse={() => setIsDesktopCollapsed((previous) => !previous)}
        />

        <div className="flex min-h-[calc(100vh-4rem)] min-w-0 flex-1 flex-col">
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">{renderContent()}</div>
          </div>

          <Footer groups={footerGroups} />
        </div>
      </div>
    </div>
  );
}
