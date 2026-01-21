"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { Button } from "@/src/components/ui/button";
import {
  Heart,
  MessageSquare,
  Share2,
  ArrowLeft,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// Import components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Twitter, Facebook, Linkedin, Copy } from "lucide-react";

// Define Campaign interface and sample data
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
}

const campaigns: Campaign[] = [
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
  },
];

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

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  // Find campaign by id (normalize to match the URL format)
  const campaign = campaigns.find(
    (c) => c.id.toLowerCase().replace(/ /g, "-") === campaignId,
  );

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("10000");

  // Countdown timer state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Calculate progress percentage
  const progress = campaign
    ? Math.round((campaign.raised / campaign.goal) * 100)
    : 0;

  // Initialize and update countdown timer
  useEffect(() => {
    if (!campaign) return;

    // Calculate total seconds from days left
    const totalSeconds = campaign.daysLeft * 24 * 60 * 60;
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
  }, [campaign]);

  // Format time with leading zeros
  const formatTime = (time: number) => time.toString().padStart(2, "0");

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The campaign you're looking for doesn't exist or has been removed.
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

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleDonation = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the donation
    alert(`Donation of ₦${donationAmount} submitted!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Campaign Page */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/campaigns">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all campaigns
              </Button>
            </Link>
          </motion.div>

          {/* Campaign Header */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
                {campaign.category}
              </span>
              <span className="inline-block ml-2 px-4 py-1.5 text-sm font-medium bg-warning/10 text-warning rounded-full">
                {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}{" "}
                left
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance"
            >
              {campaign.title}
            </motion.h1>

            {/* Campaign Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <div className="ml-auto flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${liked ? "text-primary" : ""}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-primary" : ""}`} />
                  <span className="sr-only">Like</span>
                </Button>
                <span className="text-sm">{likeCount}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${bookmarked ? "text-primary" : ""}`}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className={`h-4 w-4 ${bookmarked ? "fill-primary" : ""}`}
                  />
                  <span className="sr-only">Bookmark</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative h-80 md:h-96 overflow-hidden rounded-xl mb-10"
            >
              <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Funding Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-card rounded-xl p-6 border border-border mb-10"
            >
              <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    ₦{campaign.raised.toLocaleString()}
                  </h2>
                  <p className="text-muted-foreground">
                    raised of ₦{campaign.goal.toLocaleString()} goal
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">{progress}%</h2>
                  <p className="text-muted-foreground">funded</p>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-4 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="bg-primary h-4 rounded-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Donors</p>
                  <p className="font-medium">
                    {Math.floor(campaign.raised / 10000)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Left</p>
                  <p className="font-medium">
                    {formatTime(hours)}:{formatTime(minutes)}:
                    {formatTime(seconds)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Campaign Created
                  </p>
                  <p className="font-medium">2 weeks ago</p>
                </div>
              </div>
            </motion.div>

            {/* Donation Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-card rounded-xl p-6 border border-border mb-10"
            >
              <h2 className="text-xl font-bold mb-4">Make a Donation</h2>

              <form onSubmit={handleDonation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Donation Amount (₦)
                  </label>
                  <div className="flex gap-4">
                    {["10000", "25000", "50000", "100000"].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDonationAmount(amount)}
                        className={`px-6 py-3 rounded-lg border ${donationAmount === amount ? "border-primary bg-primary/10" : "border-border hover:border-primary"} transition-colors`}
                      >
                        ₦{amount}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <input
                      type="number"
                      min="1000"
                      placeholder="Custom amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">
                      I'd like to cover the transaction fees
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">
                      Make this donation anonymous
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">
                      Sign me up for updates about this campaign
                    </span>
                  </label>
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full py-6 text-lg">
                    Donate Now
                  </Button>
                  <Button variant="outline" className="w-full py-6 text-lg">
                    Fundraise for this campaign
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Your donation is secured with end-to-end encryption. TorchLife
                  is a registered non-profit organization.
                </p>
              </form>
            </motion.div>

            {/* Campaign Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="prose prose-lg max-w-none mb-10"
            >
              <h2 className="text-2xl font-bold">Campaign Story</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: campaign.description?.replace(/\n/g, "<br>") || "",
                }}
              />
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Comments (0)</h3>
              </div>

              <div className="space-y-6">
                {/* Add Comment */}
                <div className="flex gap-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                    <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      You
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full rounded-lg border border-border p-4 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button>Post Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        open={shareModalOpen}
        setOpen={setShareModalOpen}
        campaignTitle={campaign.title}
        campaignLink={`/campaigns/${campaignId}`}
      />

      <Footer />
    </div>
  );
}
