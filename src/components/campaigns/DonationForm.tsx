'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import {
  donationSchema,
  currencyOptions,
  paymentMethodOptions,
  type DonationFormData,
  type CampaignDetail,
} from '@/src/types/donation'

interface DonationFormProps {
  campaign: CampaignDetail
}

export function DonationForm({ campaign }: DonationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      currency: 'NGN',
      paymentMethod: 'card',
    },
  })

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Process payment via API
      console.log('Processing donation:', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to success page
      router.push(`/campaigns/${campaign.id}/donate/success`)
    } catch (error) {
      console.error('Donation failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Make a Donation</h1>
        <p className="text-muted-foreground">Your support means everything</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-6">{campaign.title}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              {...register('amount')}
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-3">
            <Label>Payment method</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-2"
                >
                  {paymentMethodOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type="submit" className="w-32" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Donate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
