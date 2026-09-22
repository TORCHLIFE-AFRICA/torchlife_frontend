import type { Metadata } from "next";

import { GetInvolvedPageShell } from "@/src/components/landingPage/GetInvolvedPageShell";

export const metadata: Metadata = {
  title: "Create | TorchLife",
  description:
    "Create a verified maternal care campaign on TorchLife.",
  alternates: { canonical: "/get-involved/create" },
};

export default function CreatePage() {
  return (
    <GetInvolvedPageShell
      eyebrow="Get involved"
      title="Create"
      intro="Create a verified maternal care campaign on TorchLife."
    />
  );
}
