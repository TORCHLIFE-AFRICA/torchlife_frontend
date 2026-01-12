import { apiClient } from "./client";
import {
  Campaign,
  CampaignFormData,
  CampaignFilters,
  PaginatedResponse,
} from "@/src/types";

export const campaignApi = {
  async getCampaigns(
    filters?: CampaignFilters
  ): Promise<PaginatedResponse<Campaign>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/campaigns?${queryString}` : "/campaigns";

    const response = await apiClient.get<PaginatedResponse<Campaign>>(endpoint);
    return response.data;
  },

  async getCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  },

  async createCampaign(data: CampaignFormData): Promise<Campaign> {
    const response = await apiClient.post<Campaign>("/campaigns", data);
    return response.data;
  },

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.patch<Campaign>(`/campaigns/${id}`, data);
    return response.data;
  },

  async deleteCampaign(id: string): Promise<void> {
    await apiClient.delete(`/campaigns/${id}`);
  },

  async publishCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(`/campaigns/${id}/publish`);
    return response.data;
  },

  async pauseCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(`/campaigns/${id}/pause`);
    return response.data;
  },

  async cancelCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(`/campaigns/${id}/cancel`);
    return response.data;
  },

  async uploadCampaignImages(
    campaignId: string,
    images: File[]
  ): Promise<string[]> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append(`images`, image);
    });

    const response = await apiClient.upload<string[]>(
      `/campaigns/${campaignId}/images`,
      formData
    );
    return response.data;
  },

  async uploadCampaignVideo(campaignId: string, video: File): Promise<string> {
    const formData = new FormData();
    formData.append("video", video);

    const response = await apiClient.upload<string>(
      `/campaigns/${campaignId}/video`,
      formData
    );
    return response.data;
  },

  async getFeaturedCampaigns(): Promise<Campaign[]> {
    const response = await apiClient.get<Campaign[]>("/campaigns/featured");
    return response.data;
  },

  async getTrendingCampaigns(): Promise<Campaign[]> {
    const response = await apiClient.get<Campaign[]>("/campaigns/trending");
    return response.data;
  },

  async getCreatorCampaigns(creatorId: string): Promise<Campaign[]> {
    const response = await apiClient.get<Campaign[]>(
      `/campaigns/creator/${creatorId}`
    );
    return response.data;
  },

  async searchCampaigns(query: string): Promise<Campaign[]> {
    const response = await apiClient.get<Campaign[]>(
      `/campaigns/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};