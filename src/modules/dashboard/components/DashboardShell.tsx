"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CircleUserRound,
  FileBadge2,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Megaphone,
  PlusSquare,
  Shield,
  Users,
} from "lucide-react";

import Footer from "@/src/components/dashboard/Footer";
import Navbar from "@/src/components/dashboard/Navbar";
import Sidebar, { type SidebarItem } from "@/src/components/dashboard/Sidebar";
import { useAuth } from "@/src/contexts/AuthContext";
import { UserRole } from "@/src/types";

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "donations", label: "Donations", icon: HandCoins },
  { id: "profile", label: "Profile", icon: CircleUserRound },
  { id: "create-campaign", label: "Create Campaign", icon: PlusSquare },
  { id: "admin-campaigns", label: "Admin Campaigns", icon: Shield },
  { id: "users", label: "Users", icon: Users },
  { id: "document-requests", label: "Document Requests", icon: FileBadge2 },
  { id: "logout", label: "Logout", icon: LogOut },
];

const footerGroups: FooterGroup[] = [
  {
    id: "learn",
    title: "Learn more",
    links: ["How TorchLife Africa works", "Success stories", "Charity fundraising", "Pricing"],
  },
];

type FooterGroup = {
  id: string;
  title: string;
  links: string[];
};

type DashboardShellProps = {
  activeItem: string;
  children: ReactNode;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function DashboardShell({
  activeItem,
  children,
  searchQuery,
  onSearchQueryChange,
}: DashboardShellProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const roleAwareSidebarItems = useMemo(() => {
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
      logout: [UserRole.USER, UserRole.PROXY, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    };
    return sidebarItems.filter((item) => roleAccess[item.id]?.includes(role));
  }, [user?.role]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth?auth=signIn");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !user.isVerified) {
      router.replace(
        `/auth/verify-email?userId=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email)}`
      );
    }
  }, [isAuthenticated, isLoading, router, user]);

  const routeByItemId: Record<string, string> = {
    dashboard: "/dashboard",
    campaigns: "/dashboard?tab=campaigns",
    donations: "/dashboard?tab=donations",
    profile: "/dashboard?tab=profile",
    "create-campaign": "/dashboard?tab=create-campaign",
    "admin-campaigns": "/dashboard?tab=admin-campaigns",
    users: "/dashboard?tab=users",
    "document-requests": "/dashboard?tab=document-requests",
  };

  const handleSelectItem = (itemId: string) => {
    if (itemId === "logout") {
      void logout().finally(() => {
        router.replace("/auth?auth=signIn");
      });
      return;
    }

    setIsMobileSidebarOpen(false);
    router.push(routeByItemId[itemId] ?? "/dashboard");
  };

  const searchPlaceholder = useMemo(() => {
    if (activeItem === "campaigns") return "Search campaigns";
    if (activeItem === "donations") return "Search donation history";
    if (activeItem === "profile") return "Search profile details";
    if (activeItem === "create-campaign") return "Search title suggestions";
    if (activeItem === "admin-campaigns") return "Search admin campaigns";
    if (activeItem === "users") return "Search platform users";
    if (activeItem === "document-requests") return "Search document requests";
    return "Search your campaigns";
  }, [activeItem]);

  if (isLoading || !isAuthenticated || !user || !user.isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName={user.philanthropicName || `${user.firstName} ${user.lastName}`.trim() || "User"}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        searchPlaceholder={searchPlaceholder}
        onProfileClick={() => handleSelectItem("profile")}
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
            <div className="mx-auto max-w-6xl">{children}</div>
          </div>

          <Footer groups={footerGroups} />
        </div>
      </div>
    </div>
  );
}
