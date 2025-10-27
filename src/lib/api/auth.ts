import { apiClient } from "./client";
import { User, AuthFormData } from "@/types";

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async register(data: AuthFormData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, password });
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post("/auth/verify-email", { token });
  },

  async resendVerification(email: string): Promise<void> {
    await apiClient.post("/auth/resend-verification", { email });
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>("/auth/profile", data);
    return response.data;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete("/auth/account");
  },
};