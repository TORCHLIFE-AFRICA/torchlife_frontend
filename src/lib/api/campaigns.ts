import { apiClient } from "./client";
import {
  Campaign,
  CampaignExtensionAuditEntry,
  CampaignFormData,
  PaginatedResponse,
  SupportingDocumentRequest,
  User,
  UserRole,
} from "@/src/types";

type BackendUser = {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  philanthropic_name?: string | null;
  phone_number?: string | null;
  impact_score?: number | null;
  emergencies_supported?: number | null;
  isverified: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
};

export type BackendCampaign = {
  id: string;
  user_id?: string;
  type?: "USER" | "PROXY";
  title: string;
  story?: string | null;
  records?: string[];
  priority?: string | null;
  location?: string | null;
  hospital_name?: string | null;
  hospital_contact?: string | null;
  hospital_contact_person_name?: string | null;
  status: Campaign["status"];
  extension_status?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  requested_deadline?: string | Date | null;
  public_id?: string;
  deadline: string | Date;
  target_amount: number;
  amount_raised: number;
  image_url: string;
  certified_pdf?: string;
  currency?: string;
  proxyName?: string | null;
  proxyNote?: string | null;
  proxyPhone?: string | null;
  proxyEmail?: string | null;
  proxyOrganization?: string | null;
  proxy_campaign_count?: number | null;
  proxy_total_raised?: number | null;
  approved_at?: string | Date | null;
  approved_by_id?: string | null;
  approval_notes?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | Date | null;
  created_at?: string | Date;
  updated_at?: string | Date;
  extension_requested_at?: string | Date | null;
  extension_reviewed_at?: string | Date | null;
  user?: BackendUser;
  verified_by?: BackendUser;
  donations?: Array<{ id: string }>;
};

type CreateDashboardCampaignPayload = {
  type: "USER" | "PROXY";
  title: string;
  story: string;
  record: string;
  deadline: string;
  targetAmount: number;
  proxyName?: string;
  proxyPhone?: string;
  proxyEmail?: string;
  location?: string;
  hospitalName?: string;
  hospitalContact?: string;
  hospitalContactPersonName?: string;
  coverImage: File;
  certifiedPdf: File;
  recordFile?: File;
};

const mapUser = (user?: BackendUser | null): User | undefined => {
  if (!user) return undefined;
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.first_name,
    lastName: user.last_name,
    philanthropicName:
      typeof user.philanthropic_name === "string" && user.philanthropic_name.trim().length > 0
        ? user.philanthropic_name
        : undefined,
    phoneNumber: user.phone_number ?? undefined,
    avatarUrl: null,
    impactScore: user.impact_score ?? 0,
    emergenciesSupported: user.emergencies_supported ?? 0,
    isVerified: user.isverified,
    createdAt: user.created_at ? new Date(user.created_at) : new Date(),
    updatedAt: user.updated_at ? new Date(user.updated_at) : new Date(),
  };
};

export const mapCampaign = (campaign: BackendCampaign): Campaign => ({
  id: campaign.id,
  publicId: campaign.public_id,
  type: campaign.type,
  title: campaign.title,
  story: campaign.story ?? "",
  description: campaign.story ?? "",
  status: campaign.status,
  extensionStatus: campaign.extension_status,
  requestedDeadline: campaign.requested_deadline ? new Date(campaign.requested_deadline) : undefined,
  createdAt: campaign.created_at ? new Date(campaign.created_at) : new Date(),
  updatedAt: campaign.updated_at ? new Date(campaign.updated_at) : new Date(),
  deadline: new Date(campaign.deadline),
  endDate: new Date(campaign.deadline),
  targetAmount: campaign.target_amount,
  fundingGoal: campaign.target_amount,
  amountRaised: campaign.amount_raised,
  currentAmount: campaign.amount_raised,
  imageUrl: campaign.image_url,
  image_url: campaign.image_url,
  records: campaign.records ?? [],
  priority: campaign.priority ?? null,
  location: campaign.location ?? null,
  hospitalName: campaign.hospital_name ?? null,
  hospitalContact: campaign.hospital_contact ?? null,
  hospitalContactPersonName: campaign.hospital_contact_person_name ?? null,
  certifiedPdf: campaign.certified_pdf,
  currency: campaign.currency ?? "NGN",
  proxyName: campaign.proxyName ?? null,
  proxyNote: campaign.proxyNote ?? null,
  proxyPhone: campaign.proxyPhone ?? null,
  proxyEmail: campaign.proxyEmail ?? null,
  proxyOrganization: campaign.proxyOrganization ?? null,
  proxyCampaignCount: campaign.proxy_campaign_count ?? null,
  proxyTotalRaised: campaign.proxy_total_raised ?? null,
  approvedAt: campaign.approved_at ? new Date(campaign.approved_at) : undefined,
  approvedById: campaign.approved_by_id ?? null,
  approvalNotes: campaign.approval_notes ?? null,
  isDeleted: campaign.is_deleted ?? false,
  deletedAt: campaign.deleted_at ? new Date(campaign.deleted_at) : undefined,
  creator: mapUser(campaign.user),
  creatorId: campaign.user_id ?? campaign.user?.id,
  user: mapUser(campaign.user),
  verifiedBy: mapUser(campaign.verified_by),
  donorCount: campaign.donations?.length ?? 0,
});

export const campaignApi = {
  async getUserCampaigns(page = 1, limit = 20): Promise<PaginatedResponse<Campaign>> {
    const response = await apiClient.get<PaginatedResponse<BackendCampaign>>(
      `/campaign/user?page=${page}&limit=${limit}`
    );
    const items = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      ...response.data,
      data: items.map(mapCampaign),
    };
  },

  async getCampaigns(): Promise<PaginatedResponse<Campaign>> {
    const response = await apiClient.get<PaginatedResponse<BackendCampaign>>(
      "/campaign/status/APPROVED"
    );
    const items = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      ...response.data,
      data: items.map(mapCampaign),
    };
  },

  async getCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.get<BackendCampaign>(`/campaign/${id}`);
    return mapCampaign(response.data);
  },

  async getPublicCampaign(publicId: string): Promise<Campaign> {
    const response = await apiClient.get<BackendCampaign>(`/campaign/public/${publicId}`);
    return mapCampaign(response.data);
  },

  async createCampaign(data: CampaignFormData): Promise<Campaign> {
    const response = await apiClient.post<BackendCampaign>("/campaign/create-user", {
      type: "USER",
      title: data.title,
      story: data.description,
      record: data.shortDescription || data.description,
      certified_pdf: "",
      image_url: "",
      deadline: data.endDate.toISOString(),
      target_amount: data.fundingGoal,
    });
    return mapCampaign(response.data);
  },

  async createCampaignDashboard(
    data: CreateDashboardCampaignPayload,
    options?: { onProgress?: (progress: number) => void }
  ): Promise<Campaign> {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("title", data.title);
    formData.append("story", data.story);
    formData.append("record", data.record);
    formData.append("deadline", data.deadline);
    formData.append("target_amount", String(data.targetAmount));
    formData.append("image", data.coverImage);
    formData.append("certified_pdf", data.certifiedPdf);

    if (data.recordFile) {
      formData.append("record", data.recordFile);
    }

    if (data.proxyName) {
      formData.append("proxyName", data.proxyName);
    }

    if (data.proxyPhone) {
      formData.append("proxyPhone", data.proxyPhone);
    }

    if (data.proxyEmail) {
      formData.append("proxyEmail", data.proxyEmail);
    }

    if (data.location) {
      formData.append("location", data.location);
    }

    if (data.hospitalName) {
      formData.append("hospital_name", data.hospitalName);
    }

    if (data.hospitalContact) {
      formData.append("hospital_contact", data.hospitalContact);
    }

    if (data.hospitalContactPersonName) {
      formData.append("hospital_contact_person_name", data.hospitalContactPersonName);
    }

    const response = await apiClient.upload<BackendCampaign>("/campaign/create-user", formData, options);
    return mapCampaign(response.data);
  },

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(`/campaign/${id}`, data);
    return mapCampaign(response.data);
  },

  async updateCampaignDetails(
    id: string,
    data: Partial<{
      type: "USER" | "PROXY";
      title: string;
      story: string;
      records: string[];
      record: string | null;
      certified_pdf: string | null;
      image_url: string | null;
      deadline: string;
      target_amount: number;
      currency: "NGN" | "USD";
      status: Campaign["status"];
      priority: "LOW" | "MEDIUM" | "HIGH";
      location: string | null;
      hospital_name: string;
      hospital_contact: string;
      hospital_contact_person_name: string | null;
      proxyName: string | null;
      proxyPhone: string | null;
      proxyEmail: string | null;
      proxyNote: string | null;
      approval_notes: string | null;
    }>
  ): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(`/campaign/${id}`, data);
    return mapCampaign(response.data);
  },

  async extendCampaign(campaignId: string, deadline: string): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(`/campaign/${campaignId}/extend`, {
      deadline,
    });
    return mapCampaign(response.data);
  },

  async requestExtension(campaignId: string, requestedDeadline: string): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(
      `/campaign/${campaignId}/request-extension`,
      { requested_deadline: requestedDeadline }
    );
    return mapCampaign(response.data);
  },

  async createSupportingDocumentRequest(campaignId: string): Promise<SupportingDocumentRequest> {
    const response = await apiClient.post<{
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      requested_at: string;
      reviewed_at?: string | null;
      reviewed_by_id?: string | null;
    }>(`/campaign/${campaignId}/document-requests`);

    return {
      id: response.data.id,
      status: response.data.status,
      requestedAt: new Date(response.data.requested_at),
      reviewedAt: response.data.reviewed_at ? new Date(response.data.reviewed_at) : undefined,
      reviewedById: response.data.reviewed_by_id ?? null,
    };
  },

  async getMySupportingDocumentRequest(campaignId: string): Promise<SupportingDocumentRequest | null> {
    const response = await apiClient.get<{
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      requested_at: string;
      reviewed_at?: string | null;
      reviewed_by_id?: string | null;
    } | null>(`/campaign/${campaignId}/document-requests/me`);

    if (!response.data) {
      return null;
    }

    return {
      id: response.data.id,
      status: response.data.status,
      requestedAt: new Date(response.data.requested_at),
      reviewedAt: response.data.reviewed_at ? new Date(response.data.reviewed_at) : undefined,
      reviewedById: response.data.reviewed_by_id ?? null,
    };
  },

  async listSupportingDocumentRequests(campaignId: string): Promise<SupportingDocumentRequest[]> {
    const response = await apiClient.get<
      Array<{
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        requested_at: string;
        reviewed_at?: string | null;
        reviewed_by_id?: string | null;
        user?: {
          id: string;
          philanthropic_name?: string | null;
          email?: string | null;
        };
      }>
    >(`/campaign/${campaignId}/document-requests`);

    return response.data.map((request) => ({
      id: request.id,
      status: request.status,
      requestedAt: new Date(request.requested_at),
      reviewedAt: request.reviewed_at ? new Date(request.reviewed_at) : undefined,
      reviewedById: request.reviewed_by_id ?? null,
      user: request.user
        ? {
          id: request.user.id,
          philanthropicName: request.user.philanthropic_name ?? undefined,
          email: request.user.email ?? undefined,
        }
        : undefined,
    }));
  },

  async listAllSupportingDocumentRequests(
    page = 1,
    limit = 20,
    search = ""
  ): Promise<PaginatedResponse<SupportingDocumentRequest>> {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) {
      query.set("search", search.trim());
    }

    const response = await apiClient.get<
      PaginatedResponse<{
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        requested_at: string;
        reviewed_at?: string | null;
        reviewed_by_id?: string | null;
        user?: {
          id: string;
          philanthropic_name?: string | null;
          email?: string | null;
        };
        campaign?: {
          id: string;
          public_id?: string | null;
          title: string;
        } | null;
        reviewed_by?: {
          id: string;
          philanthropic_name?: string | null;
          email?: string | null;
        } | null;
      }>
    >(`/campaign/document-requests/admin?${query.toString()}`);

    return {
      ...response.data,
      data: response.data.data.map((request) => ({
        id: request.id,
        status: request.status,
        requestedAt: new Date(request.requested_at),
        reviewedAt: request.reviewed_at ? new Date(request.reviewed_at) : undefined,
        reviewedById: request.reviewed_by_id ?? null,
        user: request.user
          ? {
            id: request.user.id,
            philanthropicName: request.user.philanthropic_name ?? undefined,
            email: request.user.email ?? undefined,
          }
          : undefined,
        campaign: request.campaign
          ? {
            id: request.campaign.id,
            publicId: request.campaign.public_id ?? undefined,
            title: request.campaign.title,
          }
          : undefined,
        reviewedBy: request.reviewed_by
          ? {
            id: request.reviewed_by.id,
            philanthropicName: request.reviewed_by.philanthropic_name ?? undefined,
            email: request.reviewed_by.email ?? undefined,
          }
          : undefined,
      })),
    };
  },

  async reviewSupportingDocumentRequest(
    requestId: string,
    approve: boolean
  ): Promise<SupportingDocumentRequest> {
    const response = await apiClient.patch<{
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      requested_at: string;
      reviewed_at?: string | null;
      reviewed_by_id?: string | null;
    }>(`/campaign/document-requests/${requestId}`, { approve });

    return {
      id: response.data.id,
      status: response.data.status,
      requestedAt: new Date(response.data.requested_at),
      reviewedAt: response.data.reviewed_at ? new Date(response.data.reviewed_at) : undefined,
      reviewedById: response.data.reviewed_by_id ?? null,
    };
  },

  async getSupportingDocuments(
    campaignId: string
  ): Promise<{ certifiedPdf?: string | null; records: string[] }> {
    const response = await apiClient.get<{
      certified_pdf?: string | null;
      records?: string[];
    }>(`/campaign/${campaignId}/supporting-documents`);

    return {
      certifiedPdf: response.data.certified_pdf ?? null,
      records: response.data.records ?? [],
    };
  },

  async listExtensionAudits(campaignId: string): Promise<CampaignExtensionAuditEntry[]> {
    const response = await apiClient.get<
      Array<{
        id: string;
        old_deadline: string;
        new_deadline: string;
        created_at: string;
        admin?: {
          id: string;
          philanthropic_name?: string | null;
          email?: string | null;
        };
      }>
    >(`/campaign/${campaignId}/extension-audits`);

    return response.data.map((entry) => ({
      id: entry.id,
      oldDeadline: new Date(entry.old_deadline),
      newDeadline: new Date(entry.new_deadline),
      createdAt: new Date(entry.created_at),
      admin: entry.admin
        ? {
          id: entry.admin.id,
          philanthropicName: entry.admin.philanthropic_name ?? undefined,
          email: entry.admin.email ?? undefined,
        }
        : undefined,
    }));
  },

  async getPendingCampaignApprovals(page = 1, limit = 20): Promise<PaginatedResponse<Campaign>> {
    const response = await apiClient.get<PaginatedResponse<BackendCampaign>>(
      `/campaign/status/PENDING?page=${page}&limit=${limit}`
    );
    const items = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      ...response.data,
      data: items.map(mapCampaign),
    };
  },

  async getAdminCampaigns(
    page = 1,
    limit = 20,
    search = ""
  ): Promise<PaginatedResponse<Campaign>> {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) {
      query.set("search", search.trim());
    }

    const response = await apiClient.get<PaginatedResponse<BackendCampaign>>(
      `/campaign?${query.toString()}`
    );
    const items = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      ...response.data,
      data: items.map(mapCampaign),
    };
  },

  async approveCampaign(campaignId: string, notes?: string): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(`/campaign/${campaignId}/approve`, { notes });
    return mapCampaign(response.data);
  },

  async rejectCampaign(campaignId: string, notes?: string): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(`/campaign/${campaignId}/reject`, { notes });
    return mapCampaign(response.data);
  },

  async getExtensionRequests(
    status: "NONE" | "PENDING" | "APPROVED" | "REJECTED" = "PENDING",
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Campaign>> {
    const response = await apiClient.get<PaginatedResponse<BackendCampaign>>(
      `/campaign/extension-status/${status}?page=${page}&limit=${limit}`
    );
    const items = Array.isArray(response.data?.data) ? response.data.data : [];
    return {
      ...response.data,
      data: items.map(mapCampaign),
    };
  },

  async reviewExtension(campaignId: string, approve: boolean): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(`/campaign/${campaignId}/review-extension`, {
      approve,
    });
    return mapCampaign(response.data);
  },

  async deleteCampaign(id: string): Promise<void> {
    await apiClient.delete(`/campaign/${id}`);
  },

  async restoreCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.patch<BackendCampaign>(`/campaign/${id}/restore`, {});
    return mapCampaign(response.data);
  },

  async uploadCampaignFile(campaignId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.upload<{ url?: string }>(
      `/upload/campaign/${campaignId}`,
      formData
    );
    const url =
      (response.data && typeof response.data.url === "string" && response.data.url) ||
      ((response as unknown as { url?: unknown }).url as string | undefined);
    if (!url) {
      throw new Error("Upload succeeded but did not return a file URL.");
    }
    return { url };
  },
};
