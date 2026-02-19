'use client'

import { useRouter } from 'next/navigation'
import { TrackCampaign } from '@/src/components/startcampaign'
import { type TrackedCampaign } from '@/src/types/campaign-form'

// Mock data - in production this would come from API
const mockCampaign: TrackedCampaign = {
  id: '1',
  title: 'Help Jane Deliver Safely',
  status: 'approved',
  dateSubmitted: new Date('2025-10-27'),
  targetAmount: 600000,
  amountRaised: 22400,
  daysLeft: 29,
}

export default function TrackCampaignPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/startcampaigns')
  }

  const handleViewDetails = () => {
    // Navigate to campaign details page
    router.push(`/campaigns/${mockCampaign.id}`)
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <TrackCampaign
        campaign={mockCampaign}
        onBack={handleBack}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}
