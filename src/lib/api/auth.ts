import { apiClient } from "./client";
import { User, AuthFormData } from "@/src/types";

export type AuthTokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
};

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
  impactScore: user.impact_score ?? 0,
  emergenciesSupported: user.emergencies_supported ?? 0,
  isVerified: user.isverified,
  createdAt: user.created_at ? new Date(user.created_at) : new Date(),
  updatedAt: user.updated_at ? new Date(user.updated_at) : new Date(),
});

export const authApi = {
  async signIn(identifier: string, password: string): Promise<AuthTokenResponse> {
    const response = await apiClient.post<AuthTokenResponse>("/auth/signin", {
      identifier,
      password,
    });
    return response.data;
  },

  async signUp(data: AuthFormData): Promise<User> {
    const response = await apiClient.post<BackendUser>("/auth/signup", {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      philanthropic_name: data.philanthropicName,
      phone_number: data.phoneNumber,
    });
    return mapUser(response.data);
  },

  async signInWithGoogle(credential: string): Promise<AuthTokenResponse> {
    const response = await apiClient.post<AuthTokenResponse>("/auth/google", {
      credential,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async refresh(): Promise<AuthTokenResponse> {
    const response = await apiClient.post<AuthTokenResponse>("/auth/refresh");
    return response.data;
  },

  async requestPasswordChange(identifier: string): Promise<void> {
    await apiClient.post("/auth/request-password-change", { identifier });
  },

  async resetPassword(
    identifier: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post("/auth/reset-password", {
      identifier,
      oldPassword,
      newPassword,
    });
  },

  async forgetPassword(identifier: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/forget-password", { identifier, newPassword });
  },

  async resendEmailOtp(email: string): Promise<void> {
    await apiClient.post("/auth/resend-email-otp", { email });
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<BackendUser>("/auth/me");
    return mapUser(response.data);
  },

  async verifyEmailOtp(userId: string, otp: number): Promise<void> {
    await apiClient.post("/auth/verify-email-otp", { userId, otp });
  },
};
