"use client";

import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { CampaignSamplesSection } from "@/src/components/landingPage/blog-preview-section";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-14 md:pt-28 ">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Browse Campaigns</h1>
            <p className="text-lg text-primary-foreground/90 mb-8">
              <span className=" text-2xl font-bold">
                Your <span className="text-accent">Donation</span> Matters{" "}
                <span className="text-accent">Now</span>!
              </span>
              <br />
              The next minute might be too late. Every campaign here represents
              a real medical emergency.
            </p>
          </div>
        </div>
      </section>
      <CampaignSamplesSection title="Active Campaign" showBrowse={false} />
      {/* <Footer /> */}
    </div>
  );
}
