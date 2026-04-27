import type { PaymentStatus } from "@/src/types";

export type SortKey = "date" | "amount" | "organization";
export type SortDirection = "asc" | "desc";

export type DonationRow = {
  id: string;
  amount: number;
  date: Date;
  organization: string;
  paymentMethod: string;
  status: PaymentStatus;
};

export type DonationSummary = {
  totalAmount: number;
  average: number;
  organizationsCount: number;
};
