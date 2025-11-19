"use client";

import React from "react";
import { Campaign } from "@/types";

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

export default function CampaignCard({ campaign, onClick }: CampaignCardProps) {

  const progressPercentage = Math.min(
    (campaign.currentAmount / campaign.fundingGoal) * 100,
    100
  );


  const calculateDaysLeft = (endDate: Date): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysLeft = calculateDaysLeft(campaign.endDate);


  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-12 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 max-w-[470px] w-full flex flex-col gap-5">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-5 leading-tight">
        {campaign.title}
      </h2>

      {/* Organizer's Name */}
      <div className=" gap-3flex mb-2">
        <span className="text- text-gray-600">Organizer's Name:</span>
        <span className="text-lg text-gray-600">{campaign.creator.name}</span>
      </div>

    
      <div className="flex  gap-3 mb-2">
        <span className="text-lg text-gray-600">Hospital:</span>
        <span className="text-lg text-gray-600">
          {campaign.shortDescription || "Doee Hospital"}
        </span>
      </div>

      
      <div className="flex  gap-3 mb-2">
        <span className="text-lg text-gray-600">Target Amount:</span>
        <span className="text-lg text-gray-600">
          {formatCurrency(campaign.fundingGoal)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-md overflow-hidden mt-4 mb-2">
        <div
          className="h-full bg-emerald-500 rounded-md transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      
      <div className="flex justify-between items-center mb-6">
        <span className="text-base font-medium text-gray-900">
          {formatCurrency(campaign.currentAmount)} raised
        </span>
        <span className="text-base text-gray-500">{daysLeft} days left</span>
      </div>

      
      <button
        onClick={onClick}
        className="bg-[#00796B] hover:bg-[#005f56] text-white text-base font-semibold py-3.5 px-8 rounded-lg border-none cursor-pointer self-center mt-4 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        View Campaign
      </button>
    </div>
  );
}
