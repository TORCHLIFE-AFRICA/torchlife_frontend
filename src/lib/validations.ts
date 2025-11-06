import { z } from 'zod';
import { CampaignCategory } from '@/types';

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = authSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  shortDescription: z.string().min(20, 'Short description must be at least 20 characters').max(200, 'Short description must be less than 200 characters'),
  fundingGoal: z.number().min(100, 'Funding goal must be at least $100').max(1000000, 'Funding goal cannot exceed $1,000,000'),
  category: z.nativeEnum(CampaignCategory),
  endDate: z.date().min(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'End date must be at least 7 days from now'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
});

export const rewardTierSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  estimatedDelivery: z.date().min(new Date(), 'Delivery date must be in the future'),
  maxBackers: z.number().optional(),
});

export const paymentSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID is required'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  rewardTierId: z.string().optional(),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment must be less than 1000 characters'),
  campaignId: z.string().min(1, 'Campaign ID is required'),
});

export const reportSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  campaignId: z.string().min(1, 'Campaign ID is required'),
});