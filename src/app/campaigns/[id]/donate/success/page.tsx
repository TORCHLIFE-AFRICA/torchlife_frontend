'use client'

import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { DonationSuccess } from "@/src/components/campaigns";
import { mockCampaigns } from "@/src/types/donation";
import { useParams } from "next/navigation";

export default function DonationSuccessPage() {
  const params = useParams();
  const campaignId = params.id as string;

  // Find campaign by id from mock data
  const campaign = mockCampaigns.find((c) => c.id === campaignId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <DonationSuccess
            campaignTitle={campaign?.title || 'Campaign'}
            donorName={campaign?.organizerName}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
