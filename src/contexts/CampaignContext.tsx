"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Campaign,
  CampaignContextType,
  CampaignFormData,
  Payment,
  CampaignFilters,
} from "@/src/types";
import { campaignApi } from "@/src/lib/api/campaigns";
import { paymentApi } from "@/src/lib/api/payments";

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({
  children,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
    setIsLoading(true);
    try {
      const newCampaign = await campaignApi.createCampaign(data);
      setCampaigns((prev) => [newCampaign, ...prev]);
      return newCampaign;
    } catch (error) {
      console.error("Failed to create campaign:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaign = async (
    id: string,
    data: Partial<Campaign>
  ): Promise<Campaign> => {
    setIsLoading(true);
    try {
      const updatedCampaign = await campaignApi.updateCampaign(id, data);

      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === id ? updatedCampaign : campaign
        )
      );

      if (currentCampaign?.id === id) {
        setCurrentCampaign(updatedCampaign);
      }

      return updatedCampaign;
    } catch (error) {
      console.error("Failed to update campaign:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await campaignApi.deleteCampaign(id);
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));

      if (currentCampaign?.id === id) {
        setCurrentCampaign(null);
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const backCampaign = async (
    campaignId: string,
    amount: number,
    rewardId?: string
  ): Promise<Payment> => {
    setIsLoading(true);
    try {
      const paymentIntent = await paymentApi.createPaymentIntent({
        campaignId,
        amount,
        rewardTierId: rewardId,
        paymentMethodId: "", // This will be set by Stripe
      });

      // In a real implementation, you would handle Stripe payment confirmation here
      const payment = await paymentApi.confirmPayment(
        paymentIntent.paymentIntentId
      );

      // Update campaign current amount
      const updatedCampaign = await campaignApi.getCampaign(campaignId);
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId ? updatedCampaign : campaign
        )
      );

      if (currentCampaign?.id === campaignId) {
        setCurrentCampaign(updatedCampaign);
      }

      return payment;
    } catch (error) {
      console.error("Failed to back campaign:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaign = async (id: string): Promise<Campaign> => {
    setIsLoading(true);
    try {
      const campaign = await campaignApi.getCampaign(id);
      setCurrentCampaign(campaign);
      return campaign;
    } catch (error) {
      console.error("Failed to get campaign:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaigns = async (
    filters?: CampaignFilters
  ): Promise<Campaign[]> => {
    setIsLoading(true);
    try {
      const response = await campaignApi.getCampaigns(filters);
      setCampaigns(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to get campaigns:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CampaignContextType = {
    campaigns,
    currentCampaign,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    backCampaign,
    getCampaign,
    getCampaigns,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};