import type { Metadata } from "next";
import PublicCampaignRoute from "@/src/modules/campaign/components/PublicCampaignRoute";
import { getServerCampaign } from "@/src/lib/api/server-campaigns";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://torchlife.vercel.app";

function getCampaignDescription(story?: string) {
  const normalizedStory = story?.replace(/\s+/g, " ").trim();

  if (!normalizedStory) {
    return "Support this verified TorchLife healthcare campaign and help fund urgent medical care.";
  }

  return normalizedStory.length > 160
    ? `${normalizedStory.slice(0, 157).trimEnd()}...`
    : normalizedStory;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}): Promise<Metadata> {
  const { campaignId } = await params;
  const campaign = await getServerCampaign(campaignId);

  if (!campaign || campaign.status !== "APPROVED") {
    return {
      title: "Campaign unavailable | TorchLife",
      description: "This TorchLife campaign is not publicly available.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalId = campaign.publicId || campaignId;
  const canonicalUrl = `${siteUrl}/campaign/${canonicalId}`;
  const title = `${campaign.title} | TorchLife`;
  const description = getCampaignDescription(campaign.story || campaign.description);
  const imageUrl = new URL(
    campaign.imageUrl || campaign.image_url || "/torchlife-logo.png",
    siteUrl
  ).toString();

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "TorchLife",
      type: "article",
      images: [
        {
          url: imageUrl,
          alt: campaign.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const initialCampaign = await getServerCampaign(campaignId);

  return <PublicCampaignRoute campaignId={campaignId} initialCampaign={initialCampaign} />;
}
