import { z } from 'zod'

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  beneficiaryName: z.string().min(2, 'Beneficiary name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Please enter a valid location'),
  reasonForCampaign: z.string().min(20, 'Please provide more details about the reason (at least 20 characters)'),
})

// Step 2: Medical Details
export const medicalDetailsSchema = z.object({
  hospitalName: z.string().min(2, 'Hospital name is required'),
  attendingDoctorName: z.string().min(2, 'Doctor\'s name is required'),
  doctorContact: z.string().min(5, 'Please enter a valid contact (phone or email)'),
  hospitalAccountDetails: z.string().min(5, 'Hospital account details are required'),
  expectedDeliveryDate: z.date({ required_error: 'Please select an expected delivery date' }),
  medicalReports: z.array(z.instanceof(File)).optional(),
})

// Step 3: Campaign Details
export const campaignDetailsSchema = z.object({
  campaignTitle: z.string().min(5, 'Campaign title must be at least 5 characters'),
  targetAmount: z.string().min(1, 'Target amount is required'),
  campaignDuration: z.string().min(1, 'Please select a campaign duration'),
})

// Combined schema for full form
export const startCampaignSchema = basicInfoSchema
  .merge(medicalDetailsSchema)
  .merge(campaignDetailsSchema)

// Types derived from schemas
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>
export type MedicalDetailsFormData = z.infer<typeof medicalDetailsSchema>
export type CampaignDetailsFormData = z.infer<typeof campaignDetailsSchema>
export type StartCampaignFormData = z.infer<typeof startCampaignSchema>

// Campaign status for tracking
export type CampaignApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface TrackedCampaign {
  id: string
  title: string
  status: CampaignApprovalStatus
  dateSubmitted: Date
  targetAmount: number
  amountRaised: number
  daysLeft: number
}

// Duration options
export const campaignDurationOptions = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
]
