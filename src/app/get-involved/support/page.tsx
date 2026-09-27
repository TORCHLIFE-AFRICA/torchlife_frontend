import type { Metadata } from "next";

import { GetInvolvedPageShell } from "@/src/components/landingPage/GetInvolvedPageShell";

export const metadata: Metadata = {
  title: "Support | TorchLife",
  description:
    "Support verified maternal care campaigns on TorchLife.",
  alternates: { canonical: "/get-involved/support" },
};

export default function SupportPage() {
  return (
    <GetInvolvedPageShell
      eyebrow="Get involved"
      title="Support"
      intro="Support verified maternal care campaigns on TorchLife."
    />
  );
}
