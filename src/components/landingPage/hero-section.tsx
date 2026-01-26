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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-linear-to-br from-primary/40 via-primary/30 to-primary/20">
      <div className="container mx-auto px-4 lg:px-8 sm:py-32  lg:py-20">
        {/* Mobile-only badge (above image) */}
        <div className="lg:hidden mb-6">
          <div>
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/20 text-amber-50 rounded-full">
              Africa's first Pregnancy Crowdfunding
            </span>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="sm:relative ml-2 absolute z-10 order-2 lg:order-1">
            <div className="hidden lg:block">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/20 text-amber-50 rounded-full">
                Africa's first Pregnancy Crowdfunding
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl text-shadow-2xs text-shadow-green-950 md:text-5xl lg:text-6xl font-bold text-background leading-tight text-balance mb-6"
            >
              Every Pregnant Woman Deserves Safe Delivery
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:bg-transparent md:text-xl text-background/80 max-w-2xl mb-8 text-pretty"
            >
              <span className="bg-accent/20 font-semibold  px-1 box-decoration-clone inline">
                We raise fast funding to start treatment immediately.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-background bg-transparent text-background hover:bg-background hover:text-foreground font-semibold px-8 py-6 text-lg"
                  onClick={() => setShowCampaignModal(true)}
                >
                  Start a Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-foreground font-semibold px-8 py-6 text-lg"
                  onClick={() => router.push("/campaigns  ")}
                >
                  Donate Now
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            {/*
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-background/20"
            >
              <div className="text-background/90">
                <span className="text-2xl font-bold text-accent">500+</span>
                <p className="text-sm">Lives Saved</p>
              </div>
              <div className="w-px h-10 bg-background/30" />
              <div className="text-background/90">
                <span className="text-2xl font-bold text-accent">₦50M+</span>
                <p className="text-sm">Funds Raised</p>
              </div>
              <div className="w-px h-10 bg-background/30" />
              <div className="text-background/90">
                <span className="text-2xl font-bold text-accent">100%</span>
                <p className="text-sm">Verified Cases</p>
              </div>
            </motion.div>
            */}
          </div>

          {/* Right Image - Pregnant woman in labor */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 relative"
          >
            <div
              // animate={{
              //   y: [0, -10, 0],
              // }}
              // transition={{
              //   duration: 4,
              //   repeat: Number.POSITIVE_INFINITY,
              //   ease: "easeInOut",
              // }}
              className="relative aspect-4/5 lg:aspect-3/4 rounded-2xl overflow-hidden shadow-2xl"
            >
              <CloudinaryImage
                publicId={CLOUDINARY_ASSETS.pregnantWoman}
                alt={"Pregnant woman in pain"}
                options={{
                  quality: "auto",
                  format: "auto",
                  width: 800,
                  height: 1100,
                }}
                className="object-cover"
                priority={true}
              />
              {/* <Image
                src="/african-pregnant-woman-in-hospital-bed-experiencin.jpg"
                alt="Pregnant woman in need of medical support"
                fill
                className="object-cover"
                priority
              /> */}
              {/* Subtle overlay for visual cohesion */}
              <div className="absolute inset-0 bg-linear-to-t from-primary/30 to-transparent" />
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
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
