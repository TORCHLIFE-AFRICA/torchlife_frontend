import { z } from 'zod'

// Campaign types for browse/donation flow
export interface BrowseCampaign {
  id: string
  title: string
  organizerName: string
  hospitalName: string
  targetAmount: number
  amountRaised: number
  daysLeft: number
  status: 'active' | 'completed' | 'expired'
  imageUrl?: string
}

// Campaign details for detail page
export interface CampaignDetail extends BrowseCampaign {
  location: string
  reasonForCampaign: string
  expectedDeliveryDate: string
  medicalReportUrl?: string
  doctorName?: string
  createdAt: Date
}

// Donation form schema
export const donationSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']),
  paymentMethod: z.enum(['card', 'bank_transfer', 'wallet']),
})

export type DonationFormData = z.infer<typeof donationSchema>

// Payment method options
export const paymentMethodOptions = [
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'wallet', label: 'Wallet' },
] as const

// Currency options
export const currencyOptions = [
  { value: 'NGN', label: 'NGN', symbol: '₦' },
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'GBP', label: 'GBP', symbol: '£' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
] as const

// Transaction types
export type TransactionType = 'donation' | 'withdrawal' | 'deposit'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  status: TransactionStatus
  description: string
  campaignTitle?: string
  createdAt: Date
}

// Wallet types
export interface Wallet {
  balance: number
  currency: string
  transactions: Transaction[]
}

// Mock data for campaigns
export const mockCampaigns: BrowseCampaign[] = [
  {
    id: '1',
    title: 'Help Jane Deliver Safely',
    organizerName: 'Jane Doe',
    hospitalName: 'Doee Hospital',
    targetAmount: 600000,
    amountRaised: 22400,
    daysLeft: 29,
    status: 'active',
  },
  {
    id: '2',
    title: 'Help Joan Deliver Safely',
    organizerName: 'Joan Doe',
    hospitalName: 'Biene Hospital',
    targetAmount: 700000,
    amountRaised: 30400,
    daysLeft: 25,
    status: 'active',
  },
  {
    id: '3',
    title: 'Help Dola Deliver Safely',
    organizerName: 'Dola Ade',
    hospitalName: 'Rick Hospital',
    targetAmount: 500000,
    amountRaised: 20500,
    daysLeft: 21,
    status: 'active',
  },
  {
    id: '4',
    title: 'Help Dina Deliver Safely',
    organizerName: 'Dina Ola',
    hospitalName: 'Shaw Hospital',
    targetAmount: 800000,
    amountRaised: 21000,
    daysLeft: 25,
    status: 'active',
  },
]

// Mock campaign detail
export const mockCampaignDetail: CampaignDetail = {
  id: '1',
  title: 'Help Jane Deliver Safely',
  organizerName: 'Jane Doe',
  hospitalName: 'Doee Hospital',
  targetAmount: 600000,
  amountRaised: 22400,
  daysLeft: 29,
  status: 'active',
  location: 'Lagos, Nigeria',
  reasonForCampaign: 'Seeking assistance to pay for the required medical procedures and maternity expenses',
  expectedDeliveryDate: '01/02/25',
  doctorName: 'John Doe',
  medicalReportUrl: 'medical_report.pdf',
  createdAt: new Date('2025-01-01'),
}

// Mock wallet data
export const mockWallet: Wallet = {
  balance: 32000,
  currency: 'NGN',
  transactions: [
    {
      id: '1',
      type: 'donation',
      amount: 5000,
      currency: 'NGN',
      status: 'completed',
      description: 'Donated to Jane Doe\'s Campaign',
      campaignTitle: 'Help Jane Deliver Safely',
      createdAt: new Date('2025-02-21T15:23:00'),
    },
    {
      id: '2',
      type: 'deposit',
      amount: 40000,
      currency: 'NGN',
      status: 'completed',
      description: 'Receiving Funds',
      createdAt: new Date('2025-02-24T11:45:00'),
    },
    {
      id: '3',
      type: 'donation',
      amount: 3000,
      currency: 'NGN',
      status: 'completed',
      description: 'Donated to Joan Doe\'s Campaign',
      campaignTitle: 'Help Joan Deliver Safely',
      createdAt: new Date('2025-02-22T09:15:00'),
    },
  ],
}
