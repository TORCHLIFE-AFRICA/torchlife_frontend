'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import { basicInfoSchema, type BasicInfoFormData } from '@/src/types/campaign-form'

interface BasicInfoFormProps {
  defaultValues?: Partial<BasicInfoFormData>
  onNext: (data: BasicInfoFormData) => void
}

export function BasicInfoForm({ defaultValues, onNext }: BasicInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="beneficiaryName">Beneficiary&apos;s Name</Label>
        <Input
          id="beneficiaryName"
          placeholder="Enter beneficiary's full name"
          {...register('beneficiaryName')}
          aria-invalid={!!errors.beneficiaryName}
        />
        {errors.beneficiaryName && (
          <p className="text-sm text-destructive">{errors.beneficiaryName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter phone number"
          {...register('phoneNumber')}
          aria-invalid={!!errors.phoneNumber}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (City, Country)</Label>
        <Input
          id="location"
          placeholder="e.g., Lagos, Nigeria"
          {...register('location')}
          aria-invalid={!!errors.location}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reasonForCampaign">Reason for campaign</Label>
        <Textarea
          id="reasonForCampaign"
          placeholder="Describe why you need this campaign..."
          className="min-h-[120px]"
          {...register('reasonForCampaign')}
          aria-invalid={!!errors.reasonForCampaign}
        />
        {errors.reasonForCampaign && (
          <p className="text-sm text-destructive">{errors.reasonForCampaign.message}</p>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <Button type="submit" className="w-40">
          Next
        </Button>
      </div>
    </form>
  )
}
