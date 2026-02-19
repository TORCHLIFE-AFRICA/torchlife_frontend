'use client'

import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { DonationForm } from "@/src/components/campaigns";
import { mockCampaigns, type CampaignDetail } from "@/src/types/donation";
import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DonatePage() {
  const params = useParams();
  const campaignId = params.id as string;

  // Find campaign by id from mock data
  const baseCampaign = mockCampaigns.find((c) => c.id === campaignId);

  // Create full campaign detail
  const campaign: CampaignDetail | null = baseCampaign
    ? {
        ...baseCampaign,
        location: 'Lagos, Nigeria',
        reasonForCampaign: 'Seeking assistance to pay for the required medical procedures and maternity expenses',
        expectedDeliveryDate: '01/02/25',
        doctorName: 'John Doe',
        medicalReportUrl: 'medical_report.pdf',
        createdAt: new Date('2025-01-01'),
      }
    : null;

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The campaign you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/campaigns">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <DonationForm campaign={campaign} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
