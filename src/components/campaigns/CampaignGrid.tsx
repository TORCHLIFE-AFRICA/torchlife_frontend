'use client'

import { CampaignCard } from './CampaignCard'
import { type BrowseCampaign } from '@/src/types/donation'

interface CampaignGridProps {
  campaigns: BrowseCampaign[]
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No campaigns found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  )
}
