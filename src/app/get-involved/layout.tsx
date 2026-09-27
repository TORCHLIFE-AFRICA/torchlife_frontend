import type { ReactNode } from "react";

import {
  PublicSiteFooter,
  PublicSiteHeader,
} from "@/src/components/landingPage/PublicSiteChrome";

export default function GetInvolvedLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f2ea]">
      <PublicSiteHeader />
      {children}
      <PublicSiteFooter />
    </main>
  );
}
