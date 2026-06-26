"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CirclePlay,
  HeartHandshake,
  ShieldCheck,
  ShieldPlus,
  Wallet,
} from "lucide-react";

import { PublicSiteFooter, PublicSiteHeader } from "@/src/components/landingPage/PublicSiteChrome";
import { DashboardCampaignCardSkeleton } from "@/src/components/dashboard/dashboard-skeletons";
import { CampaignImage } from "@/src/components/shared/CampaignImage";
import { Button } from "@/src/components/ui/button";
import { campaignApi } from "@/src/lib/api/campaigns";
import { paymentApi, type DonationTickerItem } from "@/src/lib/api/payments";
import type { Campaign } from "@/src/types";
import {
  formatMoney,
  getCampaignGoal,
  getCampaignPath,
  getCampaignProgress,
  getCampaignRaised,
} from "@/src/components/dashboard/dashboard-helpers";

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

const youtubeChannelUrl = process.env.NEXT_PUBLIC_TORCHLIFE_YOUTUBE_URL?.trim();
const youtubeEmbedUrl = process.env.NEXT_PUBLIC_TORCHLIFE_YOUTUBE_EMBED_URL?.trim();
const baseRecentlyRaisedAmount = 570000 + 107300;

const fallbackDonations: DonationTickerItem[] = [
  {
    id: "fallback-bukola",
    amount: 5000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:00:00.000Z"),
    donorLabel: "Bukola",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-udofia",
    amount: 1000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:05:00.000Z"),
    donorLabel: "UDOFIA",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-daniel",
    amount: 1500,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:10:00.000Z"),
    donorLabel: "Daniel E.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-anonymous",
    amount: 315000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:15:00.000Z"),
    donorLabel: "Anonymous",
    anonymous: true,
    campaign: null,
  },
  {
    id: "fallback-jeremiah",
    amount: 100000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:20:00.000Z"),
    donorLabel: "JEREMIAH",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-stephen",
    amount: 10000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:25:00.000Z"),
    donorLabel: "Stephen M.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-ajibade",
    amount: 10000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:30:00.000Z"),
    donorLabel: "Nofiu A.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-abisola",
    amount: 1000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:35:00.000Z"),
    donorLabel: "Abisola C.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-oluwatobi",
    amount: 10000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:40:00.000Z"),
    donorLabel: "Oluwatobi J.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-tijani",
    amount: 1000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:45:00.000Z"),
    donorLabel: "Kehinde T.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-joshua",
    amount: 5000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:50:00.000Z"),
    donorLabel: "Joshua E.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-enoch",
    amount: 1000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T08:55:00.000Z"),
    donorLabel: "Enoch O.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-feranmi",
    amount: 2600,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:00:00.000Z"),
    donorLabel: "Oluwaferanmi A.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-lawson",
    amount: 15000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:05:00.000Z"),
    donorLabel: "Kehinde L.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-daodu",
    amount: 2000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:10:00.000Z"),
    donorLabel: "Isaiah D.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-charles",
    amount: 5000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:15:00.000Z"),
    donorLabel: "Ezeuchenne C.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-jinadu",
    amount: 10000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:20:00.000Z"),
    donorLabel: "Maryam J.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-michael",
    amount: 50000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:25:00.000Z"),
    donorLabel: "Michael A.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-olayode",
    amount: 5000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:30:00.000Z"),
    donorLabel: "Olayode B.T",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-deji",
    amount: 5000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:35:00.000Z"),
    donorLabel: "Deji A.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-samuel",
    amount: 5000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:40:00.000Z"),
    donorLabel: "Samuel O.",
    anonymous: false,
    campaign: null,
  },
  {
    id: "fallback-bukola-ob",
    amount: 5000,
    currency: "NGN",
    createdAt: new Date("2026-01-01T09:45:00.000Z"),
    donorLabel: "Mary Bukola",
    anonymous: false,
    campaign: null,
  },
];

const involvementSteps = [
  {
    title: "View a campaign",
    description: "Open a verified fundraiser for urgent maternal care when treatment cannot wait.",
    icon: ShieldPlus,
  },
  {
    title: "Share the story",
    description: "Push trusted campaign links to family, communities, and your wider network quickly.",
    icon: ArrowRight,
  },
  {
    title: "Donate securely",
    description: "Support approved cases through the public donation flow without unnecessary friction.",
    icon: Wallet,
  },
  {
    title: "Track impact",
    description: "See progress clearly and help funds move toward the hospital facility that needs it.",
    icon: HeartHandshake,
  },
];

const partnerCompanies = ["Polaris Bank", "Paystack", "Breeze"];
const chipAccentClasses = [
  "ring-[#f59e0b]/30",
  "ring-[#14b8a6]/30",
  "ring-[#ec4899]/30",
  "ring-[#8b5cf6]/30",
] as const;
const donorChipPositions = [
  "left-2 top-2 sm:left-5 sm:top-5 lg:left-7 lg:top-7",
  "right-2 top-2 sm:right-5 sm:top-5 lg:right-7 lg:top-7",
  "left-2 bottom-2 sm:left-5 sm:bottom-5 lg:left-7 lg:bottom-7",
  "right-2 bottom-2 sm:right-5 sm:bottom-5 lg:right-7 lg:bottom-7",
] as const;

function resolveYoutubeEmbedUrl() {
  const source = youtubeEmbedUrl || youtubeChannelUrl || "";

  if (!source) return "";

  if (source.includes("/embed/")) {
    return source;
  }

  try {
    const url = new URL(source);
    const videoId = url.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    if (url.hostname === "youtu.be") {
      const shortId = url.pathname.replace("/", "").trim();
      if (shortId) {
        return `https://www.youtube-nocookie.com/embed/${shortId}`;
      }
    }
  } catch {
    return "";
  }

  return "";
}

function buildHeroDonations(items: DonationTickerItem[]) {
  const deduped = new Map<string, DonationTickerItem>();

  [...items, ...fallbackDonations].forEach((item) => {
    const key = `${item.donorLabel.toLowerCase()}-${item.amount}-${item.currency}`;
    if (!deduped.has(key)) {
      deduped.set(key, item);
    }
  });

  return Array.from(deduped.values()).slice(0, 5);
}

function getCornerDonations(items: DonationTickerItem[], startIndex: number) {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length: Math.min(4, items.length) }, (_, index) => {
    return items[(startIndex + index) % items.length];
  });
}

function getPriorityLabel(campaign: Campaign, index: number) {
  if (campaign.priority === "HIGH") return "Critical";
  if (campaign.priority === "MEDIUM") return "Urgent";
  if (campaign.priority === "LOW") return "Rising";
  return index === 0 ? "Critical" : index === 1 ? "Urgent" : "Featured";
}

function getProgressWidth(campaign: Campaign) {
  return `${Math.max(6, getCampaignProgress(campaign))}%`;
}

function getCampaignSummary(campaign: Campaign) {
  return (
    campaign.story?.trim() ||
    campaign.description?.trim() ||
    "Verified maternal care fundraising support currently live on TorchLife."
  );
}

function sortFeaturedCampaigns(campaigns: Campaign[]) {
  const priorityWeight: Record<string, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return [...campaigns].sort((left, right) => {
    const priorityDelta =
      (priorityWeight[right.priority ?? ""] ?? 0) - (priorityWeight[left.priority ?? ""] ?? 0);

    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });
}

export function LandingPageExperience() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<DonationTickerItem[]>([]);
  const [isCampaignLoading, setIsCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [mobileDonationIndex, setMobileDonationIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadCampaigns = async () => {
      setIsCampaignLoading(true);
      setCampaignError(null);

      try {
        const response = await campaignApi.getCampaigns();
        if (!mounted) return;
        setCampaigns(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (!mounted) return;
        setCampaignError(
          error instanceof Error ? error.message : "Unable to load featured campaigns right now."
        );
      } finally {
        if (mounted) {
          setIsCampaignLoading(false);
        }
      }
    };

    const loadDonations = async () => {
      try {
        const items = await paymentApi.getDonationTicker();
        if (!mounted) return;
        setDonations(items);
      } catch {
        if (!mounted) return;
        setDonations([]);
      }
    };

    void Promise.all([loadCampaigns(), loadDonations()]);

    const refreshTicker = window.setInterval(() => {
      void loadDonations();
    }, 60000);

    return () => {
      mounted = false;
      window.clearInterval(refreshTicker);
    };
  }, []);

  const featuredCampaigns = useMemo(() => sortFeaturedCampaigns(campaigns).slice(0, 3), [campaigns]);

  const heroDonations = useMemo(() => buildHeroDonations(donations), [donations]);
  const floatingDonations = useMemo(
    () => getCornerDonations(heroDonations, mobileDonationIndex),
    [heroDonations, mobileDonationIndex]
  );
  const resolvedYoutubeEmbedUrl = useMemo(() => resolveYoutubeEmbedUrl(), []);

  const totalRaisedAcrossFeatured = useMemo(
    () =>
      featuredCampaigns.reduce((sum, campaign) => {
        return sum + getCampaignRaised(campaign);
      }, 0),
    [featuredCampaigns]
  );

  const recentRaisedTotal = baseRecentlyRaisedAmount + totalRaisedAcrossFeatured;

  const totalDonorsAcrossFeatured = useMemo(
    () =>
      featuredCampaigns.reduce((sum, campaign) => {
        return sum + (campaign.donorCount ?? 0);
      }, 0),
    [featuredCampaigns]
  );

  useEffect(() => {
    if (heroDonations.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setMobileDonationIndex((current) => (current + 1) % heroDonations.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [heroDonations]);

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#10211f]">
      <PublicSiteHeader />

      <section className="relative overflow-hidden px-4 pb-10 pt-5 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.14),transparent_54%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e] shadow-sm ring-1 ring-black/5">
              Africa's first Pregnancy Crowdfund
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-[#132726] sm:text-5xl lg:text-6xl">
              The{" "}
              <span className="relative inline-block pr-1">
                Trusted
                <span className="pointer-events-none absolute -bottom-2 left-0 right-0 h-4 w-full text-[#c89a2b]/90">
                  <svg viewBox="0 0 160 18" aria-hidden="true" className="h-full w-full">
                    <path
                      d="M4 12c27-8 53-11 78-9 19 2 41 5 74 1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>{" "}
              Way To Solve Pregnancy Crisis
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#556a66] sm:text-lg">
              Fast, transparent fundraising for pregnancy care. TorchLife helps donors
              support verified campaigns without friction, while every case stays easy to track.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/campaigns">
                <Button className="rounded-full bg-[#0f766e] px-6 text-white hover:bg-[#0b5a54]">
                  Start giving now
                </Button>
              </Link>
              <Link href="/auth?auth=signIn&returnUrl=%2Fdashboard%3Ftab%3Dcreate-campaign">
                <Button
                  variant="outline"
                  className="rounded-full border-[#d8c8a7] bg-white/80 px-6 text-[#183330]"
                >
                  Create a campaign
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-[#415854]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 ring-1 ring-black/5">
                <ShieldCheck className="size-4 text-[#0f766e]" />
                Verified cases only
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 ring-1 ring-black/5">
                <HeartHandshake className="size-4 text-[#c89a2b]" />
                Donation flow stays public-friendly
              </span>
            </div>
          </div>

          <div className="relative mx-auto mt-12 max-w-6xl sm:mt-16">
            {floatingDonations.map((donation, index) => {
              return (
                <div
                  key={`${donation.id}-${index}`}
                  className={`landing-chip-float absolute z-20 w-[7.2rem] rounded-2xl border border-white/85 bg-white/94 p-2 text-left shadow-[0_18px_50px_-22px_rgba(15,118,110,0.35)] backdrop-blur sm:w-40 sm:p-2.5 ${donorChipPositions[index] ?? donorChipPositions[0]}`}
                  style={{ animationDelay: `${index * 1.1}s` }}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/placeholder-user.jpg"
                      alt={`${donation.donorLabel} profile placeholder`}
                      width={36}
                      height={36}
                      className={`size-8 rounded-full object-cover ring-2 sm:size-9 ${chipAccentClasses[index % chipAccentClasses.length]}`}
                    />
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0f766e]/70 sm:text-[10px]">
                        Recent
                      </p>
                      <p className="line-clamp-1 text-[11px] font-semibold text-[#132726] sm:text-xs">
                        {donation.donorLabel}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[10px] font-medium text-[#5b706c] sm:text-[11px]">
                    donated {formatMoney(donation.amount, donation.currency)}
                  </p>
                </div>
              );
            })}

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 p-3 shadow-[0_40px_120px_-48px_rgba(10,30,28,0.38)]">
              <div className="absolute inset-3 scale-[1.06] overflow-hidden rounded-[1.8rem] opacity-45 blur-2xl">
                <Image
                  src="/andrae-ricketts-Q9_zv0LN4jU-unsplash.jpg"
                  alt="TorchLife hero background"
                  width={1200}
                  height={760}
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-[1.7rem] border border-white/60">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,118,110,0.22)_0%,rgba(15,118,110,0.4)_100%)]" />
                <Image
                  src="/andrae-ricketts-Q9_zv0LN4jU-unsplash.jpg"
                  alt="Mother holding a newborn baby"
                  width={1400}
                  height={920}
                  priority
                  sizes="(max-width: 1024px) 100vw, 1400px"
                  className="h-[24rem] w-full object-cover grayscale sm:h-[32rem] xl:h-[40rem]"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6">
                  <div className="grid gap-2 sm:gap-3 rounded-[1rem] sm:rounded-[1.25rem] border border-white/15 bg-[#10211f]/72 p-3 sm:p-4 text-white backdrop-blur lg:grid-cols-3">
                    <div>
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/60">
                        Available now
                      </p>
                      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">{featuredCampaigns.length}</p>
                      <p className="text-xs sm:text-sm text-white/72">live campaigns featured on the homepage</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/60">
                        Recently raised
                      </p>
                      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">
                        {formatMoney(recentRaisedTotal || 0, "NGN")}
                      </p>
                      <p className="text-xs sm:text-sm text-white/72">We have a target that is beyond money.</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/60">
                        Supporters counted
                      </p>
                      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">{totalDonorsAcrossFeatured}</p>
                      <p className="text-xs sm:text-sm text-white/72">We have philanthropists who care.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="campaigns" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e]">
              Active campaigns
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#132726] sm:text-4xl">
              Many ways to protect mothers.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#556a66]">
              Real approved campaigns stay visible, premium, and easy to act on. Each card keeps the
              story, progress, verification, and donation path together in one lightweight layout.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-[#dfd9cf] px-5 py-2 text-sm font-medium text-[#243b37]">
              All cases
            </span>
            <span className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#5a6b67] ring-1 ring-black/5">
              Urgent
            </span>
            <span className="rounded-full bg-[#0f4d46] px-5 py-2 text-sm font-medium text-white">
              Critical
            </span>
          </div>

          <div className="mt-10">
            {isCampaignLoading ? (
              <div className="grid gap-5 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <DashboardCampaignCardSkeleton key={`featured-skeleton-${index}`} />
                ))}
              </div>
            ) : campaignError ? (
              <div className="rounded-[2rem] border border-[#e7d4cc] bg-[#fff8f5] px-6 py-8 text-center text-sm text-[#9f4334]">
                {campaignError}
              </div>
            ) : featuredCampaigns.length === 0 ? (
              <div className="rounded-[2rem] border border-black/5 bg-white px-6 py-12 text-center">
                <h3 className="text-xl font-semibold text-[#132726]">No featured campaigns yet</h3>
                <p className="mt-3 text-sm text-[#556a66]">
                  Approved campaigns will appear here automatically as soon as they are available.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-3">
                {featuredCampaigns.map((campaign, index) => {
                  const theme = campaignThemes[index % campaignThemes.length];
                  const goal = getCampaignGoal(campaign);
                  const raised = getCampaignRaised(campaign);

                  return (
                    <article
                      key={campaign.id}
                      className={`rounded-[1.55rem] p-1 shadow-[0_26px_80px_-36px_rgba(8,28,25,0.6)] transition-transform duration-300 hover:-translate-y-1 sm:rounded-[2rem] sm:p-2 ${theme.outer}`}
                    >
                      <div className={`rounded-[1.35rem] p-2 sm:rounded-[1.7rem] sm:p-3 ${theme.shell}`}>
                        <div className="overflow-hidden rounded-[1.1rem] border border-black/5 bg-white sm:rounded-[1.35rem]">
                          <div className="relative aspect-[5/4] overflow-hidden">
                            <CampaignImage
                              src={campaign.imageUrl || campaign.image_url}
                              alt={campaign.title}
                              wrapperClassName="h-full w-full"
                              imageClassName="transition-transform duration-500 hover:scale-[1.03]"
                              loading="lazy"
                            />
                            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
                                {getPriorityLabel(campaign, index)}
                              </span>
                              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#0f766e] shadow-sm">
                                VERIFIED
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3 p-3 sm:space-y-5 sm:p-5">
                            <div>
                              <h3 className="line-clamp-2 text-[1.35rem] font-semibold leading-tight tracking-tight text-[#132726] sm:text-[1.9rem] sm:leading-[1.02]">
                                {campaign.title}
                              </h3>
                              <p className="mt-1.5 line-clamp-3 text-[13px] leading-5 text-[#485f5b] sm:mt-3 sm:text-base sm:leading-6">
                                {getCampaignSummary(campaign)}
                              </p>
                            </div>

                            <div className="grid gap-2 text-sm text-[#485f5b] sm:grid-cols-2 sm:gap-3">
                              <div className="rounded-2xl bg-white/80 p-2.5 ring-1 ring-black/5 sm:p-3">
                                <p className="text-[11px] uppercase tracking-[0.22em] text-[#70837f]">
                                  Hospital
                                </p>
                                <p className="mt-1 text-[13px] font-medium text-[#183330] sm:text-sm">
                                  {campaign.hospitalName || "TorchLife verified provider"}
                                </p>
                              </div>
                              <div className="rounded-2xl bg-white/80 p-2.5 ring-1 ring-black/5 sm:p-3">
                                <p className="text-[11px] uppercase tracking-[0.22em] text-[#70837f]">
                                  Location
                                </p>
                                <p className="mt-1 text-[13px] font-medium text-[#183330] sm:text-sm">
                                  {campaign.location || "Nigeria"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-end justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#70837f]">
                                    Raised
                                  </p>
                                  <p className="mt-1 text-[1.35rem] font-semibold tracking-tight text-[#0f4d46] sm:text-3xl">
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
                                  style={{ width: getProgressWidth(campaign) }}
                                />
                              </div>
                            </div>

                            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                              <Link href={getCampaignPath(campaign.id, campaign.publicId)}>
                                <Button
                                  variant="outline"
                                  className="h-10 w-full rounded-2xl border-[#d8c8a7] bg-white px-3 text-xs text-[#183330] hover:bg-[#faf4e7] sm:h-11 sm:text-sm"
                                >
                                  View details
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
        </div>
      </section>

      <section id="youtube" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#071c1a] p-6 text-white shadow-[0_30px_100px_-44px_rgba(7,28,26,0.9)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d9c483]">
                <CirclePlay className="size-4" />
                Some of our real stories
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Watch real campaign stories and updates.
              </h2>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-[0_28px_90px_-40px_rgba(7,28,26,0.95)]">
              <div className="aspect-video w-full">
                {resolvedYoutubeEmbedUrl ? (
                  <iframe
                    src={resolvedYoutubeEmbedUrl}
                    title="Some of our real stories"
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#091816] px-6 text-center text-sm text-white/70">
                    Add `NEXT_PUBLIC_TORCHLIFE_YOUTUBE_EMBED_URL` or a YouTube watch URL to show the playable video canvas here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="get-involved" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white/90 p-6 shadow-[0_24px_80px_-44px_rgba(8,28,25,0.45)] ring-1 ring-black/5 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e]">
              Get involved
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#132726] sm:text-4xl">
              How you can help
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {involvementSteps.map((item) => (
              <div key={item.title} className="rounded-[1.6rem] border border-[#e8decb] bg-[#fbf6ee] p-5">
                <div className="inline-flex rounded-2xl bg-[#0f766e]/10 p-3 text-[#0f766e]">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#132726]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#556a66]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e]">
              Partner companies
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#132726] sm:text-4xl">
              Polaris Bank, Paystack, Breeze
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {partnerCompanies.map((partner) => (
              <div
                key={partner}
                className="rounded-[1.75rem] border border-[#dfd5c3] bg-[#f3ece1] px-6 py-8 text-center shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6f817d]">Partner</p>
                <p className="mt-3 text-2xl font-semibold text-[#132726]">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicSiteFooter />
    </main>
  );
}
