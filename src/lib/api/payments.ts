import { apiClient } from "./client";
import { Payment, PaymentData } from "@/src/types";

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export const paymentApi = {
  async createPaymentIntent(data: PaymentData): Promise<PaymentIntent> {
    const response = await apiClient.post<PaymentIntent>(
      "/payments/create-intent",
      data
    );
    return response.data;
  },

  async confirmPayment(paymentIntentId: string): Promise<Payment> {
    const response = await apiClient.post<Payment>("/payments/confirm", {
      paymentIntentId,
    });
    return response.data;
  },

  async getPayment(id: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  async getPaymentHistory(userId?: string): Promise<Payment[]> {
    const endpoint = userId
      ? `/payments/history/${userId}`
      : "/payments/history";
    const response = await apiClient.get<Payment[]>(endpoint);
    return response.data;
  },

  async refundPayment(paymentId: string, reason?: string): Promise<Payment> {
    const response = await apiClient.post<Payment>(
      `/payments/${paymentId}/refund`,
      {
        reason,
      }
    );
    return response.data;
  },

  async getCampaignPayments(campaignId: string): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>(
      `/payments/campaign/${campaignId}`
    );
    return response.data;
  },

  async getPaymentStats(campaignId?: string): Promise<{
    totalAmount: number;
    totalPayments: number;
    successfulPayments: number;
    refundedAmount: number;
  }> {
    const endpoint = campaignId
      ? `/payments/stats/${campaignId}`
      : "/payments/stats";
    const response = await apiClient.get<any>(endpoint);
    return response.data;
  },

  async processRefund(paymentId: string): Promise<void> {
    await apiClient.post(`/payments/${paymentId}/process-refund`);
  },

  async getStripePublishableKey(): Promise<string> {
    const response = await apiClient.get<{ publishableKey: string }>(
      "/payments/stripe/config"
    );
    return response.data.publishableKey;
  },
};