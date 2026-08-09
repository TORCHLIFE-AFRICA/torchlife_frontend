import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { CampaignGrid } from "@/src/components/campaigns";
import { mockCampaigns } from "@/src/types/donation";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-14 md:pt-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Browse Campaigns</h1>
            <p className="text-primary-foreground/80">
              Support verified fundraisers and make a difference
            </p>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <CampaignGrid campaigns={mockCampaigns} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
