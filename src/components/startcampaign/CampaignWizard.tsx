'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BasicInfoForm } from './BasicInfoForm'
import { MedicalDetailsForm } from './MedicalDetailsForm'
import { CampaignDetailsForm } from './CampaignDetailsForm'
import { ConfirmationStep } from './ConfirmationStep'
import { SuccessStep } from './SuccessStep'
import {
  type BasicInfoFormData,
  type MedicalDetailsFormData,
  type CampaignDetailsFormData,
  type StartCampaignFormData,
} from '@/src/types/campaign-form'

const STEPS = [
  { number: 1, title: 'Basic Information' },
  { number: 2, title: 'Medical Details' },
  { number: 3, title: 'Campaign Details' },
  { number: 4, title: 'Confirmation' },
] as const

type WizardStep = 1 | 2 | 3 | 4 | 'success'

export function CampaignWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data state
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData | null>(null)
  const [medicalDetails, setMedicalDetails] = useState<MedicalDetailsFormData | null>(null)
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetailsFormData | null>(null)

  // Step handlers
  const handleBasicInfoNext = useCallback((data: BasicInfoFormData) => {
    setBasicInfo(data)
    setCurrentStep(2)
  }, [])

  const handleMedicalDetailsNext = useCallback((data: MedicalDetailsFormData) => {
    setMedicalDetails(data)
    setCurrentStep(3)
  }, [])

  const handleCampaignDetailsNext = useCallback((data: CampaignDetailsFormData) => {
    setCampaignDetails(data)
    setCurrentStep(4)
  }, [])

  const handleBack = useCallback(() => {
    if (currentStep === 'success') {
      router.push('/')
      return
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev as number - 1) as WizardStep)
    }
  }, [currentStep, router])

  const handleSubmit = useCallback(async () => {
    if (!basicInfo || !medicalDetails || !campaignDetails) return

    setIsSubmitting(true)

    try {
      // Combine all form data
      const fullFormData: StartCampaignFormData = {
        ...basicInfo,
        ...medicalDetails,
        ...campaignDetails,
      }

      // TODO: Submit to API
      console.log('Submitting campaign:', fullFormData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setCurrentStep('success')
    } catch (error) {
      console.error('Failed to submit campaign:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }, [basicInfo, medicalDetails, campaignDetails])

  const handleTrackCampaign = useCallback(() => {
    // Navigate to track campaign page with the campaign ID
    router.push('/startcampaigns/track')
  }, [router])

  // Get combined form data for confirmation step
  const getFullFormData = (): StartCampaignFormData | null => {
    if (!basicInfo || !medicalDetails || !campaignDetails) return null
    return {
      ...basicInfo,
      ...medicalDetails,
      ...campaignDetails,
    }
  }

  const renderStepIndicator = () => {
    if (currentStep === 'success') return null

    const stepInfo = STEPS.find((s) => s.number === currentStep)

    return (
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Start a Campaign</h1>
        <p className="text-muted-foreground">
          Step {currentStep} of 4: {stepInfo?.title}
        </p>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm
            defaultValues={basicInfo || undefined}
            onNext={handleBasicInfoNext}
          />
        )
      case 2:
        return (
          <MedicalDetailsForm
            defaultValues={medicalDetails || undefined}
            onNext={handleMedicalDetailsNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <CampaignDetailsForm
            defaultValues={campaignDetails || undefined}
            onNext={handleCampaignDetailsNext}
            onBack={handleBack}
          />
        )
      case 4: {
        const fullData = getFullFormData()
        if (!fullData) return null
        return (
          <ConfirmationStep
            formData={fullData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )
      }
      case 'success':
        return (
          <SuccessStep
            onBack={handleBack}
            onTrackCampaign={handleTrackCampaign}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        {renderStepIndicator()}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  )
}
