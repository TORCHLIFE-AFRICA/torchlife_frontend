import type { PaymentStatus } from "@/src/types";

export type SortKey = "date" | "amount" | "campaignName";
export type SortDirection = "asc" | "desc";

export type DonationRow = {
  id: string;
  amount: number;
  date: Date;
  campaignName: string;
  status: PaymentStatus;
  anonymous: boolean;
};

export type DonationSummary = {
  totalAmount: number;
  average: number;
  campaignsSupported: number;
};
