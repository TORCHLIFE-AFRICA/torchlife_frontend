'use client'

import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { type CampaignDetail } from '@/src/types/donation'

interface CampaignDetailsProps {
  campaign: CampaignDetail
}

export function CampaignDetails({ campaign }: CampaignDetailsProps) {
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Campaign Details</h1>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center">{campaign.title}</h2>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Hospital Name: </span>
            <span className="font-medium">{campaign.hospitalName}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Doctor&apos;s Name: </span>
            <span className="font-medium">{campaign.doctorName || 'Not specified'}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Location: </span>
            <span className="font-medium">{campaign.location}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Reason for Campaign: </span>
            <span className="font-medium">{campaign.reasonForCampaign}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Expected Delivery Date: </span>
            <span className="font-medium">{campaign.expectedDeliveryDate}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Target Amount: </span>
            <span className="font-medium">{formatCurrency(campaign.targetAmount)}</span>
          </div>
        </div>

        {campaign.medicalReportUrl && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm">{campaign.medicalReportUrl}</span>
          </div>
        )}

        <div className="space-y-2 pt-4">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="font-medium">{formatCurrency(campaign.amountRaised)} raised</span>
            <span className="text-muted-foreground">{campaign.daysLeft} days left</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" className="w-32" onClick={() => router.back()}>
            Back
          </Button>
          <Button
            className="w-32"
            onClick={() => router.push(`/campaigns/${campaign.id}/donate`)}
          >
            Donate Now
          </Button>
        </div>
      </div>
    </div>
  )
}
