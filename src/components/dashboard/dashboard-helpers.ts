import type { Campaign } from "@/src/types";

export type DashboardCampaignStatus =
  | "Active"
  | "Completed"
  | "Expired"
  | "Pending Approval"
  | "Pending Extension Approval"
  | "Rejected";

export const formatMoney = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const getDaysRemaining = (deadline?: Date) => {
  if (!deadline) return 0;
  const diff = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const getCampaignGoal = (campaign: Campaign) =>
  campaign.targetAmount ?? campaign.fundingGoal ?? 0;

export const getCampaignRaised = (campaign: Campaign) =>
  campaign.amountRaised ?? campaign.currentAmount ?? 0;

export const getCampaignProgress = (campaign: Campaign) => {
  const goal = getCampaignGoal(campaign);
  const raised = getCampaignRaised(campaign);
  return goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
};

export const getCampaignOwnerName = (campaign: Campaign) =>
  campaign.proxyName ||
  (campaign.creator
    ? `${campaign.creator.firstName} ${campaign.creator.lastName}`.trim()
    : campaign.user
      ? `${campaign.user.firstName} ${campaign.user.lastName}`.trim()
      : "TorchLife campaign");

export const getCampaignDisplayStatus = (
  campaign: Campaign
): DashboardCampaignStatus => {
  if (campaign.status === "PENDING") return "Pending Approval";
  if (campaign.status === "REJECTED") return "Rejected";
  if (campaign.extensionStatus === "PENDING") return "Pending Extension Approval";

  const deadline = campaign.deadline ?? campaign.endDate;
  if (deadline && deadline.getTime() < Date.now()) {
    return "Expired";
  }

  if (getCampaignRaised(campaign) >= getCampaignGoal(campaign) && getCampaignGoal(campaign) > 0) {
    return "Completed";
  }

  return "Active";
};

export const getCampaignLink = (campaignId: string, publicId?: string) =>
  typeof window === "undefined"
    ? `/campaign/${publicId || campaignId}`
    : `${window.location.origin}/campaign/${publicId || campaignId}`;

export const getCampaignPath = (campaignId: string, publicId?: string) =>
  `/campaign/${publicId || campaignId}`;

export const getDashboardCampaignLink = (campaignId: string) =>
  `/dashboard/campaign/${campaignId}`;
