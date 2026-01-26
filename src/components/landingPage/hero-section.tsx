"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CloudinaryImage } from "../ui/clodinary-image";
import { CLOUDINARY_ASSETS } from "@/public/assets/staticImages";
import { CampaignDonationModals } from "../modals/CampaignDonationModals";

export function HeroSection() {
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const router = useRouter();

  return (
    <section className="relative min-h-screen pt-16 sm:pt-2 flex items-center overflow-hidden bg-linear-to-br from-primary/40 via-primary/30 to-primary/20">
      <div className="container mx-auto px-4 lg:px-8 sm:py-32 lg:py-20">
        {/* Mobile-only badge (above image) */}
        <div className="lg:hidden mb-6">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/30 text-white rounded-full backdrop-blur">
            Africa's first Pregnancy Crowdfunding
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="relative z-20 order-2 lg:order-1">
            <div className="hidden lg:block mb-6">
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/30 text-white rounded-full backdrop-blur">
                Africa's first Pregnancy Crowdfunding
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
            >
              Every Pregnant Woman Deserves Safe Delivery
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg text-white/80 max-w-xl mb-8"
            >
              We raise fast, verified funding so treatment can begin
              Immediately.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white text-accent hover:bg-white hover:text-black font-semibold px-8 py-6"
                onClick={() => setShowCampaignModal(true)}
              >
                Start a Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-6"
                onClick={() => router.push("/campaigns")}
              >
                Donate Now
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            {/*
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/20"
            >
              ...
            </motion.div>
            */}
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-4/5 lg:aspect-3/4 rounded-2xl overflow-hidden shadow-2xl">
              <CloudinaryImage
                publicId={CLOUDINARY_ASSETS.pregnantWoman}
                alt="Pregnant woman receiving care"
                options={{
                  quality: "auto",
                  format: "auto",
                  width: 800,
                  height: 1100,
                }}
                className="object-cover"
                priority
              />

              {/* Stronger overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            </div>

            {/* Ambient glow */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Campaign Modal */}
      <CampaignDonationModals
        open={showCampaignModal}
        onOpenChange={setShowCampaignModal}
        type="campaign"
      />

      {/* Donation Modal */}
      <CampaignDonationModals
        open={showDonationModal}
        onOpenChange={setShowDonationModal}
        type="donation"
      />
    </section>
  );
}
