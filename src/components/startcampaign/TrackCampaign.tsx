'use client'

import { format } from 'date-fns'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { type TrackedCampaign } from '@/src/types/campaign-form'

interface TrackCampaignProps {
  campaign: TrackedCampaign
  onBack: () => void
  onViewDetails: () => void
}

export function TrackCampaign({ campaign, onBack, onViewDetails }: TrackCampaignProps) {
  const progressPercentage = (campaign.amountRaised / campaign.targetAmount) * 100

  const getStatusBadge = (status: TrackedCampaign['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-primary">
            Approved <CheckCircle className="w-4 h-4" />
          </span>
        )
      case 'pending':
        return <span className="text-yellow-600">Pending Review</span>
      case 'rejected':
        return <span className="text-destructive">Rejected</span>
      default:
        return null
    }
  }

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
        <h1 className="text-2xl font-bold mb-2">Track Your Campaign</h1>
        <p className="text-muted-foreground">
          Monitor your campaign&apos;s progress and approval status
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center">{campaign.title}</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Campaign status:</span>
            {getStatusBadge(campaign.status)}
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Date Submitted:</span>
            <span className="font-medium">{format(campaign.dateSubmitted, 'do MMMM, yyyy')}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Target Amount:</span>
            <span className="font-medium">{formatCurrency(campaign.targetAmount)}</span>
          </div>
        </div>

        {campaign.status === 'approved' && (
          <div className="space-y-2 pt-4">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="font-medium">{formatCurrency(campaign.amountRaised)} raised</span>
              <span className="text-muted-foreground">{campaign.daysLeft} days left</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" className="w-32" onClick={onBack}>
          Back
        </Button>
        <Button className="w-40" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  )
}
