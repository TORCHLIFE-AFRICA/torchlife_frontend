'use client'

import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { WalletView } from "@/src/components/campaigns";
import { mockWallet } from "@/src/types/donation";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <WalletView wallet={mockWallet} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
