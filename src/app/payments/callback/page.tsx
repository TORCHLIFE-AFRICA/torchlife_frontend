"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { CheckCircle2, Copy, Download, Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { Navbar } from "@/src/components/landingPage/navbar";
import { Footer } from "@/src/components/landingPage/footer";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Spinner } from "@/src/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { paymentApi, type PaystackVerifyResponse } from "@/src/lib/api/payments";
import { notifyError, notifySuccess } from "@/src/lib/notify";
import { getPublicUrl } from "@/src/lib/site-url";
import { useAuth } from "@/src/contexts/AuthContext";

const formatMoney = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const SOCIAL_MESSAGE =
  "Together we are helping save vulnerable pregnant women facing emergencies.";

const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  const visibleLines = lines.slice(0, maxLines);
  visibleLines.forEach((line, index) => {
    const isLastVisibleLine = index === visibleLines.length - 1;
    const hasMoreLines = lines.length > maxLines && isLastVisibleLine;
    const textValue = hasMoreLines ? `${line.replace(/[.,;:!?-]?\s*$/, "")}...` : line;
    context.fillText(textValue, x, y + index * lineHeight);
  });

  return visibleLines.length;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to generate share card image."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });

function ImpactCardModal({
  open,
  onOpenChange,
  imageUrl,
  campaignUrl,
  campaignTitle,
  philanthropicName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  campaignUrl: string;
  campaignTitle: string;
  philanthropicName: string;
}) {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const socialLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`I just supported "${campaignTitle}" on TorchLife. ${campaignUrl}`)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`,
      icon: Facebook,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just supported "${campaignTitle}" on TorchLife.`)}&url=${encodeURIComponent(campaignUrl)}`,
      icon: Twitter,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`,
      icon: Linkedin,
    },
  ];

  const handleDownload = async () => {
    if (!imageUrl) {
      notifyError("Image unavailable", "The impact card is still generating.");
      return;
    }

    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `torchlife-impact-card-${campaignTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      notifySuccess("Image downloaded", "Your TorchLife impact card has been downloaded.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!imageUrl) {
      notifyError("Image unavailable", "The impact card is still generating.");
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "torchlife-impact-card.png", { type: "image/png" });

      if (
        navigator.share &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "TorchLife impact card",
          text: `I just supported "${campaignTitle}" on TorchLife.`,
          url: campaignUrl,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "TorchLife impact card",
          text: `I just supported "${campaignTitle}" on TorchLife.`,
          url: campaignUrl,
        });
      } else {
        await navigator.clipboard.writeText(campaignUrl);
        notifySuccess("Link copied", "Sharing is not supported here, so the campaign link was copied.");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        notifyError("Share failed", "Unable to share the impact card right now.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(campaignUrl);
    notifySuccess("Link copied", "Campaign link copied to clipboard.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Share Your Impact</DialogTitle>
          <DialogDescription>
            Download or share your TorchLife impact card and invite more people to support{" "}
            {campaignTitle || "this campaign"}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border bg-muted/20 p-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Impact card for ${campaignTitle}`}
                className="w-full rounded-2xl border bg-background object-contain shadow-sm"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border bg-background text-sm text-muted-foreground">
                <Spinner className="mr-2" />
                Generating your impact card...
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border bg-card p-5">
              <p className="text-sm text-muted-foreground">Supporter</p>
              <p className="mt-1 text-lg font-semibold">{philanthropicName}</p>
              <p className="mt-4 text-sm text-muted-foreground">Campaign link</p>
              <p className="mt-1 break-all text-sm font-medium">{campaignUrl}</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={() => void handleDownload()} disabled={!imageUrl || isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download image"}
              </Button>
              <Button variant="outline" onClick={() => void handleShare()} disabled={!imageUrl || isSharing}>
                <Share2 className="mr-2 h-4 w-4" />
                {isSharing ? "Sharing..." : "Share image"}
              </Button>
              <Button variant="outline" onClick={() => void handleCopy()}>
                <Copy className="mr-2 h-4 w-4" />
                Copy campaign link
              </Button>
              <Link href={campaignUrl} className="block">
                <Button variant="outline" className="w-full">
                  Support this campaign today
                </Button>
              </Link>
            </div>

            <div className="rounded-3xl border bg-card p-5">
              <p className="text-sm font-semibold">Post to social platforms</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon ?? Share2;
                  return (
                    <Button
                      key={item.label}
                      type="button"
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open(item.href, "_blank", "noopener,noreferrer")}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { user } = useAuth();
  const [result, setResult] = useState<PaystackVerifyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [impactModalOpen, setImpactModalOpen] = useState(false);
  const [impactCardUrl, setImpactCardUrl] = useState<string | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  const campaignPath = useMemo(() => {
    const campaignIdentifier = result?.campaignPublicId || result?.campaignId;
    return campaignIdentifier ? `/campaign/${campaignIdentifier}` : "";
  }, [result?.campaignId, result?.campaignPublicId]);

  const campaignUrl = useMemo(() => {
    if (!campaignPath) {
      return "";
    }
    return getPublicUrl(campaignPath);
  }, [campaignPath]);

  const philanthropicName = useMemo(() => {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    return user?.philanthropicName || fullName || "TorchLife Supporter";
  }, [user?.firstName, user?.lastName, user?.philanthropicName]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setError("Missing payment reference.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await paymentApi.verifyDonation(reference);
        setResult(response);
        if (response.success) {
          if (typeof window !== "undefined") {
            const donationEventDetail = {
              reference: response.reference,
              campaignId: response.campaignId ?? null,
              campaignPublicId: response.campaignPublicId ?? null,
              donationAmount: response.donationAmount ?? response.amount,
              amountRaised: response.amountRaised ?? null,
              donorCount: response.donorCount ?? 0,
              verifiedAt: new Date().toISOString(),
            };

            window.localStorage.setItem(
              "torchlife:last-donation-update",
              JSON.stringify(donationEventDetail)
            );
            window.dispatchEvent(
              new CustomEvent("torchlife:donation-verified", {
                detail: donationEventDetail,
              })
            );
          }
          notifySuccess("Donation verified", "Your donation has been verified successfully.");
          setImpactModalOpen(true);
        } else {
          notifyError("Payment failed", "Your donation could not be completed.");
        }
      } catch (verifyError) {
        notifyError(
          "Verification failed",
          verifyError instanceof Error ? verifyError.message : "Unable to verify payment right now."
        );
        setError(
          verifyError instanceof Error
            ? verifyError.message
            : "Unable to verify payment right now."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void verifyPayment();
  }, [reference]);

  useEffect(() => {
    let cancelled = false;
    let previousObjectUrl: string | null = null;

    const generateImpactCard = async () => {
      if (!result?.success || !campaignUrl) {
        return;
      }

      setIsGeneratingCard(true);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1350;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to initialize card generator.");
        }

        const [logo, qrCode] = await Promise.all([
          loadImage(getPublicUrl("/torchlife-logo.png")),
          QRCode.toDataURL(campaignUrl, {
            width: 220,
            margin: 1,
            color: {
              dark: "#111827",
              light: "#FFFFFF",
            },
          }).then(loadImage),
        ]);

        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#fff7ed");
        gradient.addColorStop(0.35, "#ecfeff");
        gradient.addColorStop(1, "#f5f3ff");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#ffffff";
        context.beginPath();
        context.roundRect(60, 60, 960, 1230, 42);
        context.fill();

        context.fillStyle = "#f97316";
        context.beginPath();
        context.roundRect(110, 110, 200, 68, 24);
        context.fill();

        context.fillStyle = "#ffffff";
        context.font = "600 32px Arial";
        context.fillText("TorchLife", 156, 154);
        context.drawImage(logo, 122, 124, 28, 40);

        context.fillStyle = "#ecfdf5";
        context.beginPath();
        context.roundRect(730, 110, 240, 72, 30);
        context.fill();

        context.fillStyle = "#047857";
        context.beginPath();
        context.arc(774, 146, 18, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#ffffff";
        context.font = "700 20px Arial";
        context.fillText("✓", 767, 153);
        context.fillStyle = "#047857";
        context.font = "700 26px Arial";
        context.fillText("Donation verified", 804, 154);

        context.fillStyle = "#111827";
        context.font = "700 64px Arial";
        wrapText(context, "I Just Supported A Pregnant Woman", 110, 280, 780, 76, 3);

        context.fillStyle = "#6b7280";
        context.font = "600 28px Arial";
        context.fillText("I donated to:", 110, 470);

        context.fillStyle = "#7c3aed";
        context.font = "700 44px Arial";
        wrapText(
          context,
          result.campaignTitle || "A TorchLife campaign",
          110,
          530,
          760,
          54,
          3
        );

        context.fillStyle = "#111827";
        context.font = "600 28px Arial";
        context.fillText("through TorchLife.", 110, 705);

        context.fillStyle = "#f9fafb";
        context.beginPath();
        context.roundRect(110, 750, 860, 160, 28);
        context.fill();

        context.fillStyle = "#6b7280";
        context.font = "600 24px Arial";
        context.fillText("Supporter", 150, 810);
        context.fillStyle = "#111827";
        context.font = "700 34px Arial";
        wrapText(context, philanthropicName, 150, 860, 780, 42, 2);

        context.fillStyle = "#111827";
        context.font = "500 30px Arial";
        wrapText(context, SOCIAL_MESSAGE, 110, 980, 630, 44, 4);

        context.fillStyle = "#fff7ed";
        context.beginPath();
        context.roundRect(780, 910, 190, 190, 28);
        context.fill();
        context.drawImage(qrCode, 805, 935, 140, 140);

        context.fillStyle = "#6b7280";
        context.font = "600 22px Arial";
        context.fillText("Scan to support", 797, 1128);

        context.fillStyle = "#7c3aed";
        context.beginPath();
        context.roundRect(110, 1140, 860, 90, 28);
        context.fill();
        context.fillStyle = "#ffffff";
        context.font = "700 34px Arial";
        context.fillText("Support this campaign today", 175, 1197);

        context.fillStyle = "#6b7280";
        context.font = "500 20px Arial";
        wrapText(context, campaignUrl, 110, 1265, 860, 28, 2);

        const blob = await canvasToBlob(canvas);
        previousObjectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setImpactCardUrl((current) => {
            if (current) {
              URL.revokeObjectURL(current);
            }
            return previousObjectUrl;
          });
        }
      } catch (cardError) {
        if (!cancelled) {
          notifyError(
            "Image generation failed",
            cardError instanceof Error
              ? cardError.message
              : "Unable to generate your impact card right now."
          );
        }
      } finally {
        if (!cancelled) {
          setIsGeneratingCard(false);
        }
      }
    };

    void generateImpactCard();

    return () => {
      cancelled = true;
      if (previousObjectUrl) {
        URL.revokeObjectURL(previousObjectUrl);
      }
    };
  }, [campaignUrl, philanthropicName, result?.campaignTitle, result?.success]);

  useEffect(() => {
    return () => {
      setImpactCardUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-24">
        <div className="container mx-auto max-w-3xl px-4">
          {isLoading ? (
            <div className="flex items-center justify-center text-muted-foreground">
              <Spinner className="mr-2" />
              Verifying your payment...
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Verification failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : result ? (
            <div className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm">
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertTitle className="flex items-center gap-2">
                  {result.success ? <CheckCircle2 className="h-5 w-5" /> : null}
                  {result.success ? "Donation Successful" : "Payment Failed"}
                </AlertTitle>
                <AlertDescription>
                  {result.success
                    ? "Your donation has been verified and applied to the campaign."
                    : "The payment could not be completed. You can retry using the same campaign."}
                </AlertDescription>
              </Alert>

              <div className="grid gap-3 rounded-2xl bg-muted/30 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Amount donated</p>
                  <p className="mt-1 font-semibold">
                    {formatMoney(result.donationAmount ?? result.amount, result.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Campaign</p>
                  <p className="mt-1 font-semibold">
                    {result.campaignTitle || "TorchLife campaign"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reference</p>
                  <p className="mt-1 font-medium">{result.reference}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment status</p>
                  <p className="mt-1 font-medium">{result.paymentStatus}</p>
                </div>
              </div>

              {result.success ? (
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setImpactModalOpen(true)}
                    disabled={isGeneratingCard}
                  >
                    {isGeneratingCard ? "Generating impact card..." : "Open share card"}
                  </Button>
                  {campaignPath ? (
                    <Link href={campaignPath}>
                      <Button>Return to Campaign</Button>
                    </Link>
                  ) : null}
                  <Link href="/dashboard">
                    <Button variant="outline">Return to Dashboard</Button>
                  </Link>
                  <Link href="/dashboard?tab=donations">
                    <Button variant="outline">View Donation History</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {campaignPath ? (
                    <Link href={`${campaignPath}?retryDonation=1&amount=${result.amount}`}>
                      <Button>Retry Donation</Button>
                    </Link>
                  ) : null}
                  <Link href="/campaigns">
                    <Button variant="outline">Return To TorchLife</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <ImpactCardModal
        open={impactModalOpen && !!result?.success}
        onOpenChange={setImpactModalOpen}
        imageUrl={impactCardUrl}
        campaignUrl={campaignUrl}
        campaignTitle={result?.campaignTitle || "TorchLife campaign"}
        philanthropicName={philanthropicName}
      />

      <Footer />
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Navbar />
          <section className="py-24">
            <div className="container mx-auto max-w-3xl px-4">
              <div className="flex items-center justify-center text-muted-foreground">
                <Spinner className="mr-2" />
                Preparing payment confirmation...
              </div>
            </div>
          </section>
          <Footer />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
