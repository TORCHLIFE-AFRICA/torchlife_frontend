import { apiClient } from "./client";

export type WalletBalanceResponse = {
  balance: number;
  currency: string;
};

export const walletApi = {
  async getBalance(): Promise<WalletBalanceResponse> {
    const response = await apiClient.get<WalletBalanceResponse>("/wallet/balance");
    return response.data;
  },
};
