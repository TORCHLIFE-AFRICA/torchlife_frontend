"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import { Progress } from "@/src/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import CountdownLabel from "@/src/components/shared/CountdownLabel";
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

  useEffect(() => {
    if (isAuthLoading || isAuthenticated) {
      return;
    }

    const loadCampaigns = async () => {
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
    };

    const refreshCampaigns = () => {
      void loadCampaigns();
    };

    void loadCampaigns();
    window.addEventListener("focus", refreshCampaigns);
    window.addEventListener("torchlife:donation-verified", refreshCampaigns as EventListener);

    return () => {
      window.removeEventListener("focus", refreshCampaigns);
      window.removeEventListener("torchlife:donation-verified", refreshCampaigns as EventListener);
    };
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-24">
          <div className="container mx-auto flex items-center justify-center px-4 text-muted-foreground">
            <Spinner className="mr-2" />
            Redirecting to your campaigns dashboard...
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-14 md:pt-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Browse Campaigns</h1>
            <p className="text-lg text-primary-foreground/90 mb-8">
              <span className="text-2xl font-bold">
                Your <span className="text-accent">Donation</span> Matters{" "}
                <span className="text-accent">Now</span>!
              </span>
              <br />
              The next minute might be too late. Every campaign here represents
              a real medical emergency.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20 text-muted-foreground">
              <Spinner className="mr-2" />
              Loading campaigns...
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-3xl mx-auto">
              <AlertTitle>Unable to load campaigns</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : campaigns.length === 0 ? (
            <div className="max-w-3xl mx-auto rounded-2xl border bg-muted/40 p-8 text-center">
              <h2 className="text-2xl font-bold">No approved campaigns yet</h2>
              <p className="mt-3 text-muted-foreground">
                Campaigns will appear here as soon as they are reviewed and approved.
              </p>
              <Link href="/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign">
                <Button variant="default" className="mt-6">
                  Sign in to create a campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {campaigns.map((campaign) => {
                return (
                  <article
                    key={campaign.id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm"
                  >
                    <Link
                      href={getCampaignPath(campaign.id, campaign.publicId)}
                      className="block transition-colors hover:bg-muted/20"
                    >
                      <img
                        src={campaign.imageUrl || campaign.image_url || "/torchlife-logo.png"}
                        alt={campaign.title}
                        className="aspect-16/10 w-full object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-4 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {getCampaignDisplayStatus(campaign)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            <CountdownLabel deadline={campaign.deadline ?? campaign.endDate} />
                          </span>
                        </div>

                        <h2 className="line-clamp-2 min-h-14 text-xl font-semibold">
                          {campaign.title}
                        </h2>

                        <div className="space-y-2">
                          <Progress value={getCampaignProgress(campaign)} />
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {formatMoney(getCampaignRaised(campaign), campaign.currency)}
                            </span>
                            <span className="text-muted-foreground">
                              Goal {formatMoney(getCampaignGoal(campaign), campaign.currency)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto text-xs text-muted-foreground">
                          Category: {campaign.priority ?? "General"}
                        </div>
                      </div>
                    </Link>
                    <div className="grid gap-2 border-t p-4 sm:grid-cols-2">
                      <Link href={getCampaignPath(campaign.id, campaign.publicId)} className="block">
                        <Button variant="outline" className="w-full">
                          View details
                        </Button>
                      </Link>
                      <Link
                        href={`${getCampaignPath(campaign.id, campaign.publicId)}?donate=1`}
                        className="block"
                      >
                        <Button className="w-full">Donate now</Button>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
