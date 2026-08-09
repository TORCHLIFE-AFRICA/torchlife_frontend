'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { type BrowseCampaign } from '@/src/types/donation'

interface CampaignCardProps {
  campaign: BrowseCampaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter()
  const progressPercentage = (campaign.amountRaised / campaign.targetAmount) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-4">{campaign.title}</h3>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Organizer&apos;s Name:</span>
          <span className="font-medium">{campaign.organizerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Hospital:</span>
          <span className="font-medium">{campaign.hospitalName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Target Amount:</span>
          <span className="font-medium">{formatCurrency(campaign.targetAmount)}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="font-medium">{formatCurrency(campaign.amountRaised)} raised</span>
          <span className="text-muted-foreground">{campaign.daysLeft} days left</span>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={() => router.push(`/campaigns/${campaign.id}`)}
      >
        View Campaign
      </Button>
    </div>
  )
}
