// Core entity types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  philanthropicName?: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
  impactScore?: number;
  emergenciesSupported?: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
  PROXY = "PROXY",
}

export interface Campaign {
  id: string;
  publicId?: string;
  type?: "USER" | "PROXY";
  title: string;
  story?: string;
  description?: string;
  shortDescription?: string;
  fundingGoal?: number;
  currentAmount?: number;
  status: CampaignStatus;
  extensionStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  requestedDeadline?: Date;
  category?: CampaignCategory;
  creator?: User;
  creatorId?: string;
  user?: User;
  verifiedBy?: User;
  images?: string[];
  imageUrl?: string;
  image_url?: string;
  video?: string;
  rewards?: RewardTier[];
  backers?: number;
  donorCount?: number;
  createdAt: Date;
  updatedAt: Date;
  endDate?: Date;
  deadline?: Date;
  tags?: string[];
  targetAmount?: number;
  amountRaised?: number;
  currency?: string;
  proxyName?: string | null;
  proxyNote?: string | null;
  proxyPhone?: string | null;
  proxyEmail?: string | null;
  proxyOrganization?: string | null;
  proxyCampaignCount?: number | null;
  proxyTotalRaised?: number | null;
  location?: string | null;
  hospitalName?: string | null;
  hospitalContact?: string | null;
  hospitalContactPersonName?: string | null;
  priority?: string | null;
  records?: string[];
  certifiedPdf?: string;
  approvedAt?: Date;
  approvalNotes?: string | null;
  approvedById?: string | null;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface SupportingDocumentRequest {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedById?: string | null;
  campaign?: {
    id: string;
    publicId?: string;
    title: string;
  };
  user?: {
    id: string;
    philanthropicName?: string;
    email?: string;
  };
  reviewedBy?: {
    id: string;
    philanthropicName?: string;
    email?: string;
  };
}

export interface CampaignExtensionAuditEntry {
  id: string;
  oldDeadline: Date;
  newDeadline: Date;
  createdAt: Date;
  admin?: {
    id: string;
    philanthropicName?: string;
    email?: string;
  };
}

export interface AdminUserDirectoryEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt: Date;
  philanthropicName?: string;
  impactScore: number;
  donationCount: number;
  campaignCount: number;
}

export interface AdminMetrics {
  totalUsers: number;
  totalCampaigns: number;
  approvedCampaigns: number;
  pendingCampaigns: number;
  rejectedCampaigns: number;
  expiredCampaigns: number;
  totalDonations: number;
  documentRequests: number;
  proxyAccounts: number;
}

export enum CampaignStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
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
  status: PaymentStatus | string;
  campaign?: Campaign;
  campaignId?: string;
  backer?: User;
  backerId?: string;
  rewardTier?: RewardTier;
  rewardTierId?: string;
  stripePaymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  reference?: string;
  authorizationUrl?: string;
  currency?: string;
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
  donorEmail?: string;
  confirmDonorEmail?: string;
  rewardTierId?: string;
  paymentMethodId?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  philanthropicName: string;
  phoneNumber: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (credential: string) => Promise<User>;
  register: (data: AuthFormData) => Promise<User>;
  refreshMe: () => Promise<User>;
  logout: () => Promise<void>;
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
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
