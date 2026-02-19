'use client'

import { format } from 'date-fns'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Label } from '@/src/components/ui/label'
import { type StartCampaignFormData } from '@/src/types/campaign-form'
import { useState } from 'react'

interface ConfirmationStepProps {
  formData: StartCampaignFormData
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
}

export function ConfirmationStep({
  formData,
  onSubmit,
  onBack,
  isSubmitting = false,
}: ConfirmationStepProps) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-muted-foreground w-44">Beneficiary&apos;s Name:</span>
            <span className="font-medium">{formData.beneficiaryName}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Phone Number:</span>
            <span className="font-medium">{formData.phoneNumber}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Location (City, Country):</span>
            <span className="font-medium">{formData.location}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Reason for Campaign:</span>
            <span className="font-medium">{formData.reasonForCampaign}</span>
          </div>
        </div>
      </section>

      {/* Medical Details Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Medical Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-muted-foreground w-44">Hospital Name:</span>
            <span className="font-medium">{formData.hospitalName}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Attending doctor&apos;s name:</span>
            <span className="font-medium">{formData.attendingDoctorName}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Doctor&apos;s contact (phone or email):</span>
            <span className="font-medium">{formData.doctorContact}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Expected Delivery Date:</span>
            <span className="font-medium">
              {formData.expectedDeliveryDate
                ? format(formData.expectedDeliveryDate, 'dd/MM/yy')
                : 'Not specified'}
            </span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Medical Reports:</span>
            <span className="font-medium">
              {formData.medicalReports && formData.medicalReports.length > 0
                ? 'Uploaded'
                : 'Not uploaded'}
            </span>
          </div>
        </div>
      </section>

      {/* Campaign Details Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-muted-foreground w-44">Campaign Title:</span>
            <span className="font-medium">{formData.campaignTitle}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Target Amount:</span>
            <span className="font-medium">{formData.targetAmount}</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-44">Campaign Duration:</span>
            <span className="font-medium">{formData.campaignDuration} days</span>
          </div>
        </div>
      </section>

      {/* Confirmation Checkbox */}
      <div className="flex items-center space-x-2 pt-4">
        <Checkbox
          id="confirm"
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked === true)}
        />
        <Label htmlFor="confirm" className="text-sm cursor-pointer">
          I confirm that all details provided are accurate
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-32"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          type="button"
          className="w-40"
          onClick={onSubmit}
          disabled={!confirmed || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Campaign'}
        </Button>
      </div>
    </div>
  )
}
