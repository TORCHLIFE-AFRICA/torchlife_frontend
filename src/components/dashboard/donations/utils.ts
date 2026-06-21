import type { Payment } from "@/src/types";

export function getOrganization(payment: Payment) {
  return (
    (payment.campaign?.creator
      ? `${payment.campaign.creator.firstName} ${payment.campaign.creator.lastName}`.trim()
      : "") ||
    payment.campaign?.title ||
    "Unknown organization"
  );
}

export function getPaymentMethod(payment: Payment) {
  const raw = payment as Payment & {
    paymentMethod?: string;
    paymentMethodType?: string;
    cardLast4?: string;
  };

  if (raw.paymentMethod) return raw.paymentMethod;
  if (raw.cardLast4) return `Card •••• ${raw.cardLast4}`;
  if (raw.paymentMethodType) return raw.paymentMethodType;
  if (payment.stripePaymentIntentId) return "Card";
  return "Not specified";
}

export function formatAmount(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
