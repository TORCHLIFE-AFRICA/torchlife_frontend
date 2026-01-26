"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { CloudinaryImage } from "../ui/clodinary-image";
import { CLOUDINARY_ASSETS } from "@/public/assets/staticImages";
import { CampaignDonationModals } from "../modals/CampaignDonationModals";

const navItems = [
  { label: "Browse Campaigns", href: "/campaigns" },
  { label: "About Torchlife", href: "/about" },
  { label: "FAQs", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/50 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <CloudinaryImage
              publicId={CLOUDINARY_ASSETS.logo}
              alt={"Logo"}
              options={{
                quality: "auto",
                format: "auto",
                width: 200,
                height: 100,
              }}
              className="object-cover"
              priority={true}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled
                      ? "text-foreground/80 hover:text-primary"
                      : "text-gray-400 hover:text-gray-20"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <div className="flex flex-row gap-4">
              <motion.div
                className=""
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/auth?auth=signIn">
                  <Button
                    variant={"ghost"}
                    className={`font-semibold px-6 transition-colors ${isScrolled ? " hover:bg-primary/20 text-black " : "bg-transparent hover:bg-transparent/10 text-white hover:text-gray-300"}`}
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                className="flex flex-row"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className={`font-semibold px-6 transition-colors ${isScrolled ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-white hover:bg-white/90 text-primary"}`}
                  onClick={() => setShowCampaignModal(true)}
                >
                  Start a Campaign
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="px-4 pt-2">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => {
                      setShowCampaignModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Start a Campaign
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Campaign Modal */}
      <CampaignDonationModals
        open={showCampaignModal}
        onOpenChange={setShowCampaignModal}
        type="campaign"
      />
    </motion.header>
  );
}
