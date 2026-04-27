import { PaymentStatus } from "@/src/types";

import type { DonationRow } from "@/src/components/dashboard/donations/types";

export const mockDonations: DonationRow[] = [
  {
    id: "don_001",
    amount: 12000,
    date: new Date("2026-04-24T10:12:00.000Z"),
    organization: "Mothers First Initiative",
    paymentMethod: "Card •••• 2042",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_002",
    amount: 5000,
    date: new Date("2026-04-21T08:32:00.000Z"),
    organization: "Save A Child Foundation",
    paymentMethod: "Bank transfer",
    status: PaymentStatus.PENDING,
  },
  {
    id: "don_003",
    amount: 25000,
    date: new Date("2026-04-19T13:04:00.000Z"),
    organization: "Hope for Families",
    paymentMethod: "Card •••• 9931",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_004",
    amount: 8000,
    date: new Date("2026-04-16T11:20:00.000Z"),
    organization: "Wellness Outreach Africa",
    paymentMethod: "USSD",
    status: PaymentStatus.FAILED,
  },
  {
    id: "don_005",
    amount: 15000,
    date: new Date("2026-04-14T09:08:00.000Z"),
    organization: "Mothers First Initiative",
    paymentMethod: "Card •••• 2042",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_006",
    amount: 3000,
    date: new Date("2026-04-11T15:45:00.000Z"),
    organization: "Feed The Streets",
    paymentMethod: "Wallet",
    status: PaymentStatus.CANCELLED,
  },
  {
    id: "don_007",
    amount: 9500,
    date: new Date("2026-04-09T06:50:00.000Z"),
    organization: "Safe Births Collective",
    paymentMethod: "Card •••• 8080",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_008",
    amount: 7000,
    date: new Date("2026-04-05T18:22:00.000Z"),
    organization: "Save A Child Foundation",
    paymentMethod: "Bank transfer",
    status: PaymentStatus.REFUNDED,
  },
  {
    id: "don_009",
    amount: 4000,
    date: new Date("2026-04-03T14:15:00.000Z"),
    organization: "Hope for Families",
    paymentMethod: "Card •••• 4472",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_010",
    amount: 21000,
    date: new Date("2026-03-30T07:02:00.000Z"),
    organization: "Neonatal Support Hub",
    paymentMethod: "Card •••• 5561",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_011",
    amount: 4500,
    date: new Date("2026-03-27T21:19:00.000Z"),
    organization: "Mothers First Initiative",
    paymentMethod: "USSD",
    status: PaymentStatus.PENDING,
  },
  {
    id: "don_012",
    amount: 10000,
    date: new Date("2026-03-24T11:09:00.000Z"),
    organization: "Wellness Outreach Africa",
    paymentMethod: "Card •••• 1240",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_013",
    amount: 6000,
    date: new Date("2026-03-21T12:33:00.000Z"),
    organization: "Safe Births Collective",
    paymentMethod: "Wallet",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_014",
    amount: 3500,
    date: new Date("2026-03-19T16:05:00.000Z"),
    organization: "Feed The Streets",
    paymentMethod: "Bank transfer",
    status: PaymentStatus.FAILED,
  },
  {
    id: "don_015",
    amount: 14500,
    date: new Date("2026-03-16T10:47:00.000Z"),
    organization: "Neonatal Support Hub",
    paymentMethod: "Card •••• 9032",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_016",
    amount: 50000,
    date: new Date("2026-03-12T09:27:00.000Z"),
    organization: "Hope for Families",
    paymentMethod: "Card •••• 1188",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_017",
    amount: 2500,
    date: new Date("2026-03-09T17:18:00.000Z"),
    organization: "Save A Child Foundation",
    paymentMethod: "USSD",
    status: PaymentStatus.CANCELLED,
  },
  {
    id: "don_018",
    amount: 12000,
    date: new Date("2026-03-06T08:56:00.000Z"),
    organization: "Mothers First Initiative",
    paymentMethod: "Card •••• 2345",
    status: PaymentStatus.REFUNDED,
  },
  {
    id: "don_019",
    amount: 18000,
    date: new Date("2026-03-03T13:42:00.000Z"),
    organization: "Wellness Outreach Africa",
    paymentMethod: "Bank transfer",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_020",
    amount: 9000,
    date: new Date("2026-02-28T11:01:00.000Z"),
    organization: "Safe Births Collective",
    paymentMethod: "Card •••• 7700",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_021",
    amount: 4100,
    date: new Date("2026-02-24T19:10:00.000Z"),
    organization: "Feed The Streets",
    paymentMethod: "Wallet",
    status: PaymentStatus.PENDING,
  },
  {
    id: "don_022",
    amount: 7300,
    date: new Date("2026-02-20T15:15:00.000Z"),
    organization: "Hope for Families",
    paymentMethod: "Card •••• 9011",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_023",
    amount: 2900,
    date: new Date("2026-02-16T12:05:00.000Z"),
    organization: "Mothers First Initiative",
    paymentMethod: "USSD",
    status: PaymentStatus.COMPLETED,
  },
  {
    id: "don_024",
    amount: 31000,
    date: new Date("2026-02-11T07:25:00.000Z"),
    organization: "Neonatal Support Hub",
    paymentMethod: "Card •••• 6677",
    status: PaymentStatus.COMPLETED,
  },
];

export function getMockDonationsForUser(userId: string): DonationRow[] {
  if (!userId) return mockDonations;
  const hash = userId
    .split("")
    .reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
  const bucketCount = 3;
  const bucket = hash % bucketCount;

  const scopedRows = mockDonations.filter(
    (_row, index) => index % bucketCount === bucket
  );

  return scopedRows.length > 0 ? scopedRows : mockDonations.slice(0, 12);
}
