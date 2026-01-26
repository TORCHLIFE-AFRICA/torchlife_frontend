"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Copy, ExternalLink } from "lucide-react";

// Modal types
export type ModalType = "campaign" | "donation";

interface CampaignDonationModalsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ModalType;
  campaignId?: string;
}

export function CampaignDonationModals({
  open,
  onOpenChange,
  type,
  campaignId = "CAM123456",
}: CampaignDonationModalsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sample account details (these would be dynamic in a real app)
  const accountDetails = {
    bankName: "TorchLife Africa",
    accountNumber: "1234567890",
    accountName: "TorchLife Maternity Fund",
    whatsappNumber: "+234 7069014391",
    campaignId: campaignId,
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderCampaignModal = () => (
    <div className="max-w-md w-full min-h-[400px]">
      <DialogHeader className="text-center">
        <DialogTitle className="text-2xl font-bold">
          Start a Campaign
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          We're currently working on improving our app to better serve you.
          Please use the external link below to fill out a campaign form, and a
          campaign manager will follow up with you shortly.
        </p>
        <Button
          className="mt-4"
          variant="default"
          onClick={() =>
            window.open("https://forms.gle/P1rbxd4RUw3Sx1xN8", "_blank")
          }
        >
          Fill Campaign Form <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <DialogFooter className="justify-center">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );

  const renderDonationModal = () => (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="text-2xl font-bold">
          Donation Instructions
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          We're currently working on improving our app to better serve you.
          Please follow the instructions below to make your donation, and a
          campaign manager will follow up with you shortly.
        </p>

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Bank Name</div>
              <div className="font-medium">{accountDetails.bankName}</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">
                Account Number
              </div>
              <div className="font-medium">{accountDetails.accountNumber}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleCopy(accountDetails.accountNumber, "account")
              }
            >
              {copiedField === "account" ? (
                "Copied!"
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Account Name</div>
              <div className="font-medium">{accountDetails.accountName}</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">
                Campaign ID (Reference)
              </div>
              <div className="font-medium">{accountDetails.campaignId}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleCopy(accountDetails.campaignId, "campaignId")
              }
            >
              {copiedField === "campaignId" ? (
                "Copied!"
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">
            Important Instructions:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Copy the hospital account number above</li>
            <li>Make sure to add the Campaign ID as transfer reference</li>
            <li>Send and share receipt to our WhatsApp number</li>
          </ol>
        </div>

        <Button
          className="mt-4 w-full"
          variant="default"
          onClick={() =>
            window.open(
              `https://wa.me/${accountDetails.whatsappNumber.replace(/\s/g, "")}?text=Hi%2C%20I%20just%20made%20a%20donation%20with%20reference%20${accountDetails.campaignId}%20-%20please%20confirm`,
              "_blank",
            )
          }
        >
          Send Receipt on WhatsApp
        </Button>
      </div>
      <DialogFooter className="justify-center">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {type === "campaign" ? renderCampaignModal() : renderDonationModal()}
      </DialogContent>
    </Dialog>
  );
}
