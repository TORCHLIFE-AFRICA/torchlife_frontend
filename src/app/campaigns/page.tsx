"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicSiteFooter, PublicSiteHeader } from "@/src/components/landingPage/PublicSiteChrome";
import { DashboardCampaignCardSkeleton } from "@/src/components/dashboard/dashboard-skeletons";
import { CampaignImage } from "@/src/components/shared/CampaignImage";
import CountdownLabel from "@/src/components/shared/CountdownLabel";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { campaignApi } from "@/src/lib/api/campaigns";
import type { Campaign } from "@/src/types";
import {
  formatMoney,
  getCampaignDisplayStatus,
  getCampaignGoal,
  getCampaignPath,
  getCampaignProgress,
  getCampaignRaised,
} from "@/src/components/dashboard/dashboard-helpers";
import { useAuth } from "@/src/contexts/AuthContext";

const campaignThemes = [
  {
    outer: "bg-[linear-gradient(180deg,#7a1f17_0%,#b1362a_100%)]",
    shell: "bg-[#fbf4ef]",
    badge: "bg-[#cf4435] text-white",
    progress: "bg-[#cf4435]",
    button: "bg-[#8a6607] hover:bg-[#775807] text-white",
  },
  {
    outer: "bg-[linear-gradient(180deg,#13463f_0%,#18675c_100%)]",
    shell: "bg-[#f3f8f6]",
    badge: "bg-[#0f766e] text-white",
    progress: "bg-[#0f766e]",
    button: "bg-[#8a6607] hover:bg-[#775807] text-white",
  },
  {
    outer: "bg-[linear-gradient(180deg,#5b4a11_0%,#8f771d_100%)]",
    shell: "bg-[#f8f5e8]",
    badge: "bg-[#8f771d] text-white",
    progress: "bg-[#8f771d]",
    button: "bg-[#8a6607] hover:bg-[#775807] text-white",
  },
] as const;

export default function CampaignsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/dashboard?tab=campaigns");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await campaignApi.getCampaigns();
      setCampaigns(response.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load campaigns right now."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading || isAuthenticated) {
      return;
    }

    void loadCampaigns();
    window.addEventListener("torchlife:donation-verified", loadCampaigns as EventListener);

    return () => {
      window.removeEventListener("torchlife:donation-verified", loadCampaigns as EventListener);
    };
  }, [isAuthLoading, isAuthenticated, loadCampaigns]);

  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f2ea]">
        <PublicSiteHeader />
        <section className="py-24">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 text-[#556a66] sm:px-6 lg:px-8">
            <Spinner className="mr-2" />
            Redirecting to your campaigns dashboard...
          </div>
        </section>
        <PublicSiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2ea]">
      <PublicSiteHeader />
      <section className="px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.25rem] bg-[linear-gradient(135deg,rgba(15,118,110,0.96),rgba(19,39,38,0.96))] px-6 py-10 text-white shadow-[0_30px_100px_-50px_rgba(7,28,26,0.95)] sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9c483]">
              Browse campaigns
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Verified pregnancy care campaigns ready for support.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Every campaign is reviewed before publication, so your donation reaches a real mother facing a genuine pregnancy or childbirth emergency.
            </p>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <DashboardCampaignCardSkeleton key={index} compact />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mx-auto max-w-3xl">
              <AlertTitle>Unable to load campaigns</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : campaigns.length === 0 ? (
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/5 bg-white p-8 text-center">
              <h2 className="text-2xl font-bold text-[#132726]">No approved campaigns yet</h2>
              <p className="mt-3 text-[#556a66]">
                Campaigns will appear here as soon as they are reviewed and approved.
              </p>
              <Link href="/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign">
                <Button variant="default" className="mt-6 rounded-full bg-[#0f766e] hover:bg-[#0b5a54]">
                  Sign in to create a campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {campaigns.map((campaign, index) => {
                const theme = campaignThemes[index % campaignThemes.length];
                const goal = getCampaignGoal(campaign);
                const raised = getCampaignRaised(campaign);
                const progress = Math.max(6, getCampaignProgress(campaign));

                return (
                  <article
                    key={campaign.id}
                    className={`h-full rounded-[1.55rem] p-1 shadow-[0_26px_80px_-36px_rgba(8,28,25,0.6)] transition-transform duration-300 hover:-translate-y-1 sm:p-2 ${theme.outer}`}
                  >
                    <div className={`h-full rounded-[1.35rem] p-2 sm:rounded-[1.7rem] sm:p-3 ${theme.shell}`}>
                      <div className="flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-black/5 bg-white sm:rounded-[1.35rem]">
                        <Link href={getCampaignPath(campaign.id, campaign.publicId)} className="block">
                          <div className="relative aspect-[5/4] min-h-[220px] overflow-hidden">
                            <CampaignImage
                              src={campaign.imageUrl || campaign.image_url}
                              alt={campaign.title}
                              wrapperClassName="h-full w-full"
                              imageClassName="transition-transform duration-500 hover:scale-[1.03]"
                              loading="lazy"
                            />
                            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
                                {getCampaignDisplayStatus(campaign)}
                              </span>
                              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#0f766e] shadow-sm sm:text-[11px]">
                                <CountdownLabel
                                  deadline={campaign.deadline ?? campaign.endDate}
                                  liveLabel
                                  className="tabular-nums"
                                />
                              </span>
                            </div>
                          </div>
                        </Link>

                        <div className="flex min-h-[250px] flex-1 flex-col space-y-3 p-3 sm:min-h-[285px] sm:space-y-5 sm:p-5">
                          <div className="space-y-1.5">
                            <h2 className="line-clamp-2 min-h-[3.4rem] text-[1.1rem] font-semibold leading-tight tracking-tight text-[#132726] sm:min-h-[4.75rem] sm:text-[1.55rem]">
                              {campaign.title}
                            </h2>
                            <p className="text-[12px] leading-5 text-[#485f5b] sm:text-sm sm:leading-6">
                              Hospital: {campaign.hospitalName || "TorchLife verified provider"}
                            </p>
                            <p className="text-[12px] leading-5 text-[#485f5b] sm:text-sm sm:leading-6">
                              Location: {campaign.location || "Nigeria"}
                            </p>
                          </div>

                          <div className="mt-auto">
                            <div className="flex items-end justify-between gap-3">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#70837f]">
                                  Raised
                                </p>
                                <p className="mt-1 text-[1.15rem] font-semibold tracking-tight text-[#0f4d46] sm:text-3xl">
                                  {formatMoney(raised, campaign.currency)}
                                </p>
                              </div>
                              <p className="text-xs font-medium text-[#556a66] sm:text-sm">
                                of {formatMoney(goal, campaign.currency)}
                              </p>
                            </div>
                            <div className="mt-2.5 h-2 rounded-full bg-[#d9e5e1]">
                              <div
                                className={`h-2 rounded-full ${theme.progress}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                            <Link href={getCampaignPath(campaign.id, campaign.publicId)}>
                              <Button
                                variant="outline"
                                className="h-10 w-full rounded-2xl border-[#d8c8a7] bg-white px-3 text-xs text-[#183330] hover:bg-[#faf4e7] sm:h-11 sm:text-sm"
                              >
                                See full story
                              </Button>
                            </Link>
                            <Link href={`${getCampaignPath(campaign.id, campaign.publicId)}?donate=1`}>
                              <Button className={`h-10 w-full rounded-2xl px-3 text-xs sm:h-11 sm:text-sm ${theme.button}`}>
                                Donate now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <PublicSiteFooter />
    </div>
  );
}
