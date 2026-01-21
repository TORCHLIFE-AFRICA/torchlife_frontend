import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import { useState } from "react";

interface SocialShareOption {
  name: string;
  icon: React.ReactNode;
  urlTemplate: (text: string, link: string) => string;
}

interface ShareModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  campaignTitle: string;
  campaignLink: string;
}

export function ShareModal({
  open,
  setOpen,
  campaignTitle,
  campaignLink,
}: ShareModalProps) {
  const [captions, setCaptions] = useState({
    Twitter: `Check out this campaign: ${campaignTitle}`,
    Facebook: `Support this amazing campaign: ${campaignTitle}`,
    Linkedin: `Join me in supporting this campaign: ${campaignTitle}`,
  });

  const socialOptions: SocialShareOption[] = [
    {
      name: "Twitter",
      icon: <Twitter className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: (text, link) =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: (text, link) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(text)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: (text, link) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
    },
    {
      name: "Copy Link",
      icon: <Copy className="h-6 w-6 text-primary-foreground" />,
      urlTemplate: (_, link) => link,
    },
  ];

  const handleShare = (option: SocialShareOption) => {
    if (option.name === "Copy Link") {
      navigator.clipboard.writeText(campaignLink);
      alert("Link copied to clipboard!");
      return;
    }
    const url = option.urlTemplate(
      captions[option.name as keyof typeof captions],
      campaignLink,
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
