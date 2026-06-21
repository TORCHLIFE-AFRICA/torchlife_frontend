import { apiClient } from "./client";
import type { AdminMetrics, AdminUserDirectoryEntry, PaginatedResponse, User } from "@/src/types";

type BackendUser = {
  id: string;
  email: string;
  role: User["role"];
  first_name: string;
  last_name: string;
  philanthropic_name?: string | null;
  phone_number?: string | null;
  impact_score?: number | null;
  emergencies_supported?: number | null;
  isverified: boolean;
  avatar_url?: string | null;
  created_at?: string | Date;
  updated_at?: string | Date;
};

const mapUser = (user: BackendUser): User => ({
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
  avatarUrl: user.avatar_url ?? null,
  impactScore: user.impact_score ?? 0,
  emergenciesSupported: user.emergencies_supported ?? 0,
  isVerified: user.isverified,
  createdAt: user.created_at ? new Date(user.created_at) : new Date(),
  updatedAt: user.updated_at ? new Date(user.updated_at) : new Date(),
});

export const userApi = {
  async updateMe(data: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    philanthropicName: string;
  }): Promise<User> {
    const response = await apiClient.patch<BackendUser>("/user/me", {
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
      philanthropic_name: data.philanthropicName,
    });
    return mapUser(response.data);
  },

  async getAdminDirectory(
    page = 1,
    limit = 20,
    search = ""
  ): Promise<PaginatedResponse<AdminUserDirectoryEntry>> {
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
        first_name: string;
        last_name: string;
        email: string;
        phone_number?: string | null;
        phoneNumber?: string | null;
        avatar_url?: string | null;
        avatarUrl?: string | null;
        role: User["role"];
        created_at: string;
        philanthropic_name?: string | null;
        impact_score?: number | null;
        donationCount: number;
        campaignCount: number;
      }>
    >(`/user/admin/directory?${query.toString()}`);

    return {
      ...response.data,
      data: response.data.data.map((entry) => ({
        id: entry.id,
        firstName: entry.first_name,
        lastName: entry.last_name,
        email: entry.email,
        phoneNumber: entry.phone_number ?? entry.phoneNumber ?? undefined,
        avatarUrl: entry.avatar_url ?? entry.avatarUrl ?? null,
        role: entry.role,
        createdAt: new Date(entry.created_at),
        philanthropicName: entry.philanthropic_name ?? undefined,
        impactScore: entry.impact_score ?? 0,
        donationCount: entry.donationCount,
        campaignCount: entry.campaignCount,
      })),
    };
  },

  async getAdminMetrics(): Promise<AdminMetrics> {
    const response = await apiClient.get<AdminMetrics>("/user/admin/metrics");
    return response.data;
  },
};
