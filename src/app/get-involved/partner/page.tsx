import type { Metadata } from "next";

import { GetInvolvedPageShell } from "@/src/components/landingPage/GetInvolvedPageShell";

export const metadata: Metadata = {
  title: "Partner | TorchLife",
  description:
    "Partner with TorchLife to expand access to maternal healthcare.",
  alternates: { canonical: "/get-involved/partner" },
};

export default function PartnerPage() {
  return (
    <GetInvolvedPageShell
      eyebrow="Get involved"
      title="Partner"
      intro="Partner with TorchLife to expand access to maternal healthcare."
    />
  );
}
