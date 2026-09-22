import type { Metadata } from "next";

import { GetInvolvedPageShell } from "@/src/components/landingPage/GetInvolvedPageShell";

export const metadata: Metadata = {
  title: "Track | TorchLife",
  description:
    "Track how funds move from donation to maternal care on TorchLife.",
  alternates: { canonical: "/get-involved/track" },
};

export default function TrackPage() {
  return (
    <GetInvolvedPageShell
      eyebrow="Get involved"
      title="Track"
      intro="Track how funds move from donation to maternal care on TorchLife."
    />
  );
}
