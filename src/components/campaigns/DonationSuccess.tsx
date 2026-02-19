'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

interface DonationSuccessProps {
  campaignTitle: string
  donorName?: string
}

export function DonationSuccess({ campaignTitle, donorName = 'Jane Doe' }: DonationSuccessProps) {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-primary-foreground" />
      </div>

      <h1 className="text-2xl font-bold mb-4">Donation Successful!</h1>

      <p className="text-muted-foreground mb-8">
        Thank you for supporting {donorName}. Your kindness is making a difference.
      </p>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => router.push('/campaigns')}>
          Back to Campaigns
        </Button>
        <Button onClick={() => router.push('/wallet')}>
          View Wallet
        </Button>
      </div>
    </div>
  )
}
