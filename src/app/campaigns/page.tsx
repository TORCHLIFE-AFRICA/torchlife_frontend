"use client";

import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-14 md:pt-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Browse Campaigns</h1>
            <p className="text-lg text-primary-foreground/90 mb-8">
              <span className="text-2xl font-bold">
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
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-muted rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl font-bold mb-6">
              Campaigns are currently being verified
            </h2>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p>Only approved and verified campaigns will be published</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p>
                  The current campaigns shown are samples for demonstration
                  purposes
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-xl font-semibold mb-4">
                  Your Trust Matters
                </h3>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    TorchLife verifies all campaigns before publishing to ensure
                    transparency and accountability.
                  </p>
                  <p className="text-muted-foreground">
                    Real campaigns will be available soon as our verification
                    process completes.
                  </p>
                  <p className="text-muted-foreground">
                    We prioritize transparency and trust to protect both donors
                    and the people we serve.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 space-y-4">
              <Button
                variant="default"
                onClick={() =>
                  window.open("https://forms.gle/P1rbxd4RUw3Sx1xN8", "_blank")
                }
                className="w-full sm:w-auto"
              >
                Submit a campaign for review
              </Button>
              <p className="text-sm text-muted-foreground">
                Check back soon for our first verified campaigns!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
