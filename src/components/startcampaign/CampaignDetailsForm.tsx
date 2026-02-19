'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import {
  campaignDetailsSchema,
  campaignDurationOptions,
  type CampaignDetailsFormData,
} from '@/src/types/campaign-form'

interface CampaignDetailsFormProps {
  defaultValues?: Partial<CampaignDetailsFormData>
  onNext: (data: CampaignDetailsFormData) => void
  onBack: () => void
}

export function CampaignDetailsForm({ defaultValues, onNext, onBack }: CampaignDetailsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CampaignDetailsFormData>({
    resolver: zodResolver(campaignDetailsSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="campaignTitle">Campaign Title</Label>
        <Input
          id="campaignTitle"
          placeholder="Enter a compelling title for your campaign"
          {...register('campaignTitle')}
          aria-invalid={!!errors.campaignTitle}
        />
        {errors.campaignTitle && (
          <p className="text-sm text-destructive">{errors.campaignTitle.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount</Label>
        <Input
          id="targetAmount"
          placeholder="e.g., NGN 600,000"
          {...register('targetAmount')}
          aria-invalid={!!errors.targetAmount}
        />
        {errors.targetAmount && (
          <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Campaign Duration</Label>
        <Controller
          name="campaignDuration"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {campaignDurationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.campaignDuration && (
          <p className="text-sm text-destructive">{errors.campaignDuration.message}</p>
        )}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button type="button" variant="outline" className="w-32" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="w-32">
          Next
        </Button>
      </div>
    </form>
  )
}
