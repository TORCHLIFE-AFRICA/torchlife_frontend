import { apiClient } from "./client";
import { PaymentData, PaymentStatus } from "@/src/types";
import { getPublicUrl } from "@/src/lib/site-url";

export interface PaystackInitializeResponse {
  donationId: string;
  paymentId: string;
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  amount: number;
  netDonationAmount?: number;
  platformFee?: number;
  tipAmount?: number;
  totalCharged?: number;
  currency: string;
  channels: string[];
  metadata: Record<string, unknown>;
  anonymous?: boolean;
  donorEmail?: string;
}

export interface PaystackVerifyResponse {
  reference: string;
  success: boolean;
  paymentStatus: string;
  amount: number;
  donationAmount?: number;
  netDonationAmount?: number;
  platformFee?: number;
  tipAmount?: number;
  totalCharged?: number;
  currency: string;
  channel?: string | null;
  campaignId?: string | null;
  campaignPublicId?: string | null;
  campaignTitle?: string | null;
  amountRaised?: number | null;
  donorCount?: number;
  alreadyProcessed: boolean;
  impactScore?: number;
  emergenciesSupported?: number;
}

export interface DonationTickerItem {
  id: string;
  amount: number;
  currency: string;
  createdAt: Date;
  donorLabel: string;
  anonymous: boolean;
  campaign?: {
    id: string;
    publicId?: string | null;
    title: string;
  } | null;
}

type BackendDonationHistoryItem = {
  id: string;
  amount: number;
  status: string;
  currency: string;
  reference: string;
  createdAt: string;
  paymentMethod?: string | null;
  donationStatus?: string | null;
  anonymous?: boolean;
  campaign?: {
    id: string;
    title: string;
    creator?: {
      id: string;
      first_name?: string | null;
      last_name?: string | null;
    } | null;
  } | null;
};

export type DonationHistoryPayment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  currency: string;
  reference: string;
  createdAt: Date;
  paymentMethod?: string;
  donationStatus?: string | null;
  anonymous?: boolean;
  campaign?: {
    id: string;
    title: string;
    creator?: {
      id: string;
      firstName: string;
      lastName: string;
    } | null;
  } | null;
};

function mapPaymentStatus(status: string): PaymentStatus {
  if (status === "SUCCESS" || status === "COMPLETED") {
    return PaymentStatus.COMPLETED;
  }

  if (status in PaymentStatus) {
    return status as PaymentStatus;
  }

  return PaymentStatus.FAILED;
}

function mapDonationHistoryItem(
  item: BackendDonationHistoryItem
): DonationHistoryPayment {
  return {
    id: item.id,
    amount: item.amount,
    status: mapPaymentStatus(item.status),
    currency: item.currency,
    reference: item.reference,
    createdAt: new Date(item.createdAt),
    campaign: item.campaign
      ? {
        id: item.campaign.id,
        title: item.campaign.title,
        creator: item.campaign.creator
          ? {
            id: item.campaign.creator.id,
            firstName: item.campaign.creator.first_name ?? "",
            lastName: item.campaign.creator.last_name ?? "",
          }
          : null,
      }
      : null,
    paymentMethod: item.paymentMethod ?? undefined,
    donationStatus: item.donationStatus ?? null,
    anonymous: item.anonymous ?? false,
  };
}

export const paymentApi = {
  async initializeDonation(
    data: PaymentData & {
      currency?: "NGN" | "USD";
      anonymous?: boolean;
      tipAmount?: number;
      callbackUrl?: string;
      donorEmail?: string;
      confirmDonorEmail?: string;
    }
  ): Promise<PaystackInitializeResponse> {
    const callbackUrl =
      data.callbackUrl ||
      (typeof window !== "undefined" ? getPublicUrl("/payments/callback") : undefined);
    const response = await apiClient.post<PaystackInitializeResponse>(
      "/payments/paystack/initialize",
      {
        ...data,
        callbackUrl,
      }
    );
    return response.data;
  },

  async verifyDonation(reference: string): Promise<PaystackVerifyResponse> {
    const response = await apiClient.get<PaystackVerifyResponse>(
      `/payments/paystack/verify/${reference}`
    );
    return response.data;
  },

  async getDonationHistory(): Promise<DonationHistoryPayment[]> {
    const response = await apiClient.get<BackendDonationHistoryItem[]>(
      "/payments/paystack/history"
    );
    return response.data.map(mapDonationHistoryItem);
  },

  async getDonationTicker(): Promise<DonationTickerItem[]> {
    const response = await apiClient.get<
      Array<{
        id: string;
        amount: number;
        currency: string;
        createdAt: string;
        donorLabel: string;
        anonymous: boolean;
        campaign?: {
          id: string;
          publicId?: string | null;
          title: string;
        } | null;
      }>
    >("/payments/paystack/ticker");

    return response.data.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  },
};
