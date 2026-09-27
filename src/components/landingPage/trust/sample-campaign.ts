import { SITE_PHOTOS } from "../site-photos";

/**
 * The single illustrative campaign the Trust section is built around. The main
 * card and all six previews read from it, so every figure agrees everywhere.
 * The photo shows no face: this is a named case with a condition and amounts.
 */
export const SAMPLE_CAMPAIGN = {
  patient: { initials: "AO", name: "Amaka O.", age: 28, city: "Lagos" },
  need: "Emergency caesarean section",
  careRequired: "Caesarean delivery and three days of post-operative care",
  whySupport: "Surgery can't wait, and the family can't cover the theatre bill",
  hospital: "Lagoon Maternity",
  photo: SITE_PHOTOS.caseCaesarean,
  goal: 850_000,
  raised: 612_000,
  supporters: 214,
  daysLeft: 8,
  breakdown: [
    { label: "Surgery & theatre", amount: 520_000, tone: "bg-[#0f766e]" },
    { label: "Medication", amount: 180_000, tone: "bg-[#5aa99c]" },
    { label: "Hospital stay", amount: 150_000, tone: "bg-[#c89a2b]" },
  ],
  verification: {
    reviewedWith: "Lagoon Maternity",
    date: "12 Mar",
    checks: ["Hospital records", "Cost estimate", "Patient identity"],
  },
  updates: [
    {
      date: "21 Mar",
      title: "Surgery completed",
      detail: "Mother and baby are stable and recovering",
    },
    {
      date: "19 Mar",
      title: "Admitted to Lagoon Maternity",
      detail: "Surgery scheduled for the next morning",
    },
  ],
  yourSupport: { amount: 10_000, date: "20 Mar" },
} as const;

export const SAMPLE_REMAINING = SAMPLE_CAMPAIGN.goal - SAMPLE_CAMPAIGN.raised;
export const SAMPLE_PROGRESS = Math.round(
  (SAMPLE_CAMPAIGN.raised / SAMPLE_CAMPAIGN.goal) * 100,
);

/** Other cases in the sample supporter's history, newest first. */
export const SAMPLE_HISTORY = [
  {
    need: SAMPLE_CAMPAIGN.need,
    photo: SAMPLE_CAMPAIGN.photo,
    amount: SAMPLE_CAMPAIGN.yourSupport.amount,
    date: SAMPLE_CAMPAIGN.yourSupport.date,
    status: "In care",
    latest: SAMPLE_CAMPAIGN.updates[0].title,
  },
  {
    need: "Neonatal intensive care",
    photo: SITE_PHOTOS.caseNeonatal,
    amount: 5_000,
    date: "2 Feb",
    status: "Outcome",
    latest: "Baby discharged home",
  },
  {
    need: "Pre-eclampsia treatment",
    photo: SITE_PHOTOS.casePreEclampsia,
    amount: 2_500,
    date: "14 Jan",
    status: "Funded",
    latest: "Treatment underway",
  },
] as const;
