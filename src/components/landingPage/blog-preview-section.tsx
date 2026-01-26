"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Reusable ShareModal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Twitter, Facebook, Linkedin, Copy } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  raised: number;
  description?: string;
  goal: number;
  daysLeft: number;
  category: string;
  sample: boolean;
}

export const campaigns = [
  {
    id: "amina-medcare-1849TM20012026DT",
    title: "Support Amina's Safe Delivery",
    excerpt:
      "Help Amina, a 28-year-old mother from Kaduna, access life-saving prenatal care and safe delivery services.",
    description: `
Amina is a 28-year-old expectant mother facing life-threatening complications.
She urgently needs prenatal care, hospital support, and a safe delivery.
Your support will cover medical bills, medication, and post-delivery care.
    `,
    image: "/african-pregnant-woman-in-hospital-bed-experiencin.jpg",
    raised: 45000,
    goal: 100000,
    daysLeft: 3,
    category: "Emergency Care",
    sample: true,
  },
  {
    id: "diana-Enugu-clinicc-1849TM20012026DT",
    title: "Diana Emergency Delivery",
    excerpt:
      "Support the upgrade of a rural clinic in Enugu to provide better maternity services.",
    description: `
This campaign focuses on improving emergency delivery services in Enugu.
Funds will be used to upgrade medical equipment and train healthcare workers.
    `,
    image: "/maternal-healthcare-africa-clinic.jpg",
    raised: 120000,
    goal: 200000,
    daysLeft: 5,
    category: "Clinic Support",
    sample: true,
  },
  {
    id: "sarah-ogun-state-1849TM20012026DT",
    title: "Sarah's Prenatal Care Support",
    excerpt:
      "Help Sarah, a first-time mother from Ogun State, afford essential prenatal vitamins and check-ups.",
    description: `
Sarah is a 25-year-old first-time mother who can't afford prenatal vitamins and regular check-ups.
Your support will ensure she has a healthy pregnancy and safe delivery.
    `,
    image: "/pregnant-woman-african-prenatal-care.jpg",
    raised: 80000,
    goal: 150000,
    daysLeft: 7,
    category: "Prenatal Care",
    sample: true,
  },
];

interface Props {
  title?: string;
  showBrowse?: boolean;
}

// ShareModal component
interface ShareModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  campaignTitle: string;
  campaignLink: string;
}

function ShareModal({
  open,
  setOpen,
  campaignTitle,
  campaignLink,
}: ShareModalProps) {
  const [captions, setCaptions] = useState({
    WhatsApp: `Urgent Donation! Next minute might be too late: ${campaignTitle}`,
    Twitter: `Urgent Donation! Next minute might be too late: ${campaignTitle}`,
    Facebook: `Urgent Donation! Next minute might be too late: ${campaignTitle}`,
    Linkedin: `Urgent Donation! Next minute might be too late: ${campaignTitle}`,
  });

  const socialOptions = [
    {
      name: "WhatsApp",
      icon: <Share2 className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: (text: string) =>
        `https://wa.me/?text=${encodeURIComponent(text + " " + campaignLink)}`,
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: (text: string) =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(campaignLink)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: (text: string) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignLink)}&quote=${encodeURIComponent(text)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: () =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignLink)}`,
    },
    {
      name: "Copy Link",
      icon: <Copy className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: () => campaignLink,
    },
  ];

  const handleShare = (option: (typeof socialOptions)[number]) => {
    if (option.name === "Copy Link") {
      navigator.clipboard.writeText(campaignLink);
      alert("Link copied to clipboard!");
      return;
    }
    const url = option.urlTemplate(
      captions[option.name as keyof typeof captions],
    );
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Share This Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {socialOptions.map((option) => (
            <div
              key={option.name}
              className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{option.name}</h3>
                {option.name !== "Copy Link" && (
                  <input
                    type="text"
                    className="w-full border border-border rounded px-2 py-1 mt-1 text-sm"
                    value={captions[option.name as keyof typeof captions]}
                    onChange={(e) =>
                      setCaptions((prev) => ({
                        ...prev,
                        [option.name]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleShare(option)}
              >
                Share
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// CountdownTimer component
interface CountdownTimerProps {
  daysLeft: number;
}

function CountdownTimer({ daysLeft }: CountdownTimerProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Calculate total seconds from days left
    const totalSeconds = daysLeft * 24 * 60 * 60;
    let remainingSeconds = totalSeconds;

    // Set initial values
    const initialHours = Math.floor(remainingSeconds / 3600);
    const initialMinutes = Math.floor((remainingSeconds % 3600) / 60);
    const initialSeconds = remainingSeconds % 60;

    setHours(initialHours);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);

    // Update timer every second
    const timerInterval = setInterval(() => {
      remainingSeconds -= 1;

      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const h = Math.floor(remainingSeconds / 3600);
      const m = Math.floor((remainingSeconds % 3600) / 60);
      const s = remainingSeconds % 60;

      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [daysLeft]);

  // Format time with leading zeros
  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <span className="text-xs font-bold">
      {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)} left
    </span>
  );
}

export function CampaignSamplesSection({ title, showBrowse }: Props) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<{
    title: string;
    link: string;
  } | null>(null);

  const openShareModal = (campaign: Campaign) => {
    setSelectedCampaign({
      title: campaign.title,
      link: `/campaigns/${campaign.id.toLowerCase().replace(/ /g, "-")}`,
    });
    setShareModalOpen(true);
  };

  return (
    <SectionWrapper className="bg-background" id="campaigns">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full"
            >
              {title || "Active Campaign"}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-foreground text-balance"
            >
              Stories that need your support
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            {showBrowse && (
              <Link href="/campaigns">
                <Button variant="outline" className="group bg-transparent">
                  Browse all campaigns
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>

        {campaigns.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {campaigns.map((campaign, index) => {
              const progress = Math.round(
                (campaign.raised / campaign.goal) * 100,
              );
              return (
                <motion.article
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <Link
                    href={`/campaigns/${campaign.id.toLowerCase().replace(/ /g, "-")}`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={campaign.image || "/placeholder.svg"}
                        alt={campaign.title}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        <CountdownTimer daysLeft={campaign.daysLeft} />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {campaign.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {campaign.excerpt || campaign.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            ₦{campaign.raised.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of ₦{campaign.goal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="bg-primary h-2 rounded-full"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {progress}% funded
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 w-full"
                      onClick={() => openShareModal(campaign)}
                    >
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16 bg-muted rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">
              No campaigns available yet
            </h3>
            <p className="text-muted-foreground mb-8">
              We're getting ready to launch our first set of campaigns. Every
              case on TorchLife goes through careful verification to protect
              donors and the people we serve.
            </p>
            <Button
              variant="default"
              onClick={() =>
                window.open("https://forms.gle/P1rbxd4RUw3Sx1xN8", "_blank")
              }
            >
              Start a Campaign
            </Button>
          </motion.div>
        )}
      </div>

      {selectedCampaign && (
        <ShareModal
          open={shareModalOpen}
          setOpen={setShareModalOpen}
          campaignTitle={selectedCampaign.title}
          campaignLink={selectedCampaign.link}
        />
      )}
    </SectionWrapper>
  );
}
