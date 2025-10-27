// Core entity types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CREATOR = "CREATOR",
  BACKER = "BACKER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  fundingGoal: number;
  currentAmount: number;
  status: CampaignStatus;
  category: CampaignCategory;
  creator: User;
  creatorId: string;
  images: string[];
  video?: string;
  rewards: RewardTier[];
  backers: number;
  createdAt: Date;
  updatedAt: Date;
  endDate: Date;
  tags: string[];
}

export enum CampaignStatus {
  DRAFT = "DRAFT",
  LIVE = "LIVE",
  FUNDED = "FUNDED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum CampaignCategory {
  TECHNOLOGY = "TECHNOLOGY",
  HEALTH = "HEALTH",
  ARTS = "ARTS",
  EDUCATION = "EDUCATION",
  ENVIRONMENT = "ENVIRONMENT",
  COMMUNITY = "COMMUNITY",
  BUSINESS = "BUSINESS",
}

export interface RewardTier {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  amount: number;
  estimatedDelivery: Date;
  maxBackers?: number;
  currentBackers: number;
  isActive: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  campaign: Campaign;
  campaignId: string;
  backer: User;
  backerId: string;
  rewardTier?: RewardTier;
  rewardTierId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

// Form types
export interface CampaignFormData {
  title: string;
  description: string;
  shortDescription: string;
  fundingGoal: number;
  category: CampaignCategory;
  endDate: Date;
  images: File[];
  video?: File;
  rewards: Omit<RewardTier, "id" | "campaignId" | "currentBackers">[];
  tags: string[];
}

export interface PaymentData {
  campaignId: string;
  amount: number;
  rewardTierId?: string;
  paymentMethodId: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: AuthFormData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface CampaignContextType {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  createCampaign: (data: CampaignFormData) => Promise<Campaign>;
  updateCampaign: (id: string, data: Partial<Campaign>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  backCampaign: (
    campaignId: string,
    amount: number,
    rewardId?: string
  ) => Promise<Payment>;
  getCampaign: (id: string) => Promise<Campaign>;
  getCampaigns: (filters?: CampaignFilters) => Promise<Campaign[]>;
}

export interface PaymentContextType {
  payments: Payment[];
  isLoading: boolean;
  processPayment: (data: PaymentData) => Promise<Payment>;
  refundPayment: (paymentId: string) => Promise<void>;
  getPaymentHistory: (userId: string) => Promise<Payment[]>;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
}

// API types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CampaignFilters {
  category?: CampaignCategory;
  status?: CampaignStatus;
  search?: string;
  minGoal?: number;
  maxGoal?: number;
  creatorId?: string;
  page?: number;
  limit?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  isRead: boolean;
  createdAt: Date;
}

// Component props types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface DashboardStats {
  totalCampaigns: number;
  totalFunding: number;
  totalBackers: number;
  successRate: number;
}