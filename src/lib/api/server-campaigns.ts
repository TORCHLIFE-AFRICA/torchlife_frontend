import { cache } from "react";
import type { Campaign } from "@/src/types";
import { mapCampaign, type BackendCampaign } from "./campaigns";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function unwrapCampaignPayload(payload: unknown): BackendCampaign | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate =
    "data" in payload && payload.data && typeof payload.data === "object"
      ? payload.data
      : payload;

  return candidate && typeof candidate === "object" ? (candidate as BackendCampaign) : null;
}

export const getServerCampaign = cache(async (campaignId: string): Promise<Campaign | null> => {
  try {
    const response = await fetch(`${apiBaseUrl}/campaign/public/${encodeURIComponent(campaignId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    const campaign = unwrapCampaignPayload(payload);
    return campaign ? mapCampaign(campaign) : null;
  } catch {
    return null;
  }
});
