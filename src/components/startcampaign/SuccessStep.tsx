'use client'

import { CheckCircle } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

interface SuccessStepProps {
  onBack: () => void
  onTrackCampaign: () => void
}

export function SuccessStep({ onBack, onTrackCampaign }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6">
        <CheckCircle className="w-12 h-12 text-primary-foreground" />
      </div>

      <h2 className="text-2xl font-bold mb-4">Campaign Submitted Successfully!</h2>

      <p className="text-muted-foreground max-w-md mb-8">
        Thank you for submitting your campaign. Our team will review the details and notify you once
        it&apos;s approved.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" className="w-32" onClick={onBack}>
          Back
        </Button>
        <Button className="w-40" onClick={onTrackCampaign}>
          Track Campaign
        </Button>
      </div>
    </div>
  )
}
