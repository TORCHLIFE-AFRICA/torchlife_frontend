import { ApiResponse } from "@/src/types";
import { notifyError } from "@/src/lib/notify";

export class ApiClientError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    data: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseURL: string;

  private shouldHandleUnauthorized(endpoint: string) {
    return ![
      "/auth/signin",
      "/auth/signup",
      "/auth/google",
      "/auth/me",
      "/auth/refresh",
      "/auth/logout",
      "/auth/request-password-change",
      "/auth/reset-password",
      "/auth/forget-password",
      "/auth/resend-email-otp",
      "/auth/verify-email-otp",
      "/campaign/public/",
      "/payments/paystack/initialize",
      "/payments/paystack/verify/",
      "/payments/paystack/ticker",
    ].some((publicEndpoint) => endpoint.startsWith(publicEndpoint));
  }

  private handleUnauthorized(endpoint: string) {
    if (typeof window === "undefined" || !this.shouldHandleUnauthorized(endpoint)) {
      return;
    }

    const now = Date.now();
    const lastShownAt = Number(window.sessionStorage.getItem("torchlife:session-expired-at") || "0");

    if (now - lastShownAt > 3000) {
      window.sessionStorage.setItem("torchlife:session-expired-at", String(now));
      notifyError("Session expired", "Your session has expired. Please sign in again.");
    }

    window.dispatchEvent(new Event("torchlife:session-expired"));

    const returnUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const redirectUrl = `/auth?auth=signIn&returnUrl=${encodeURIComponent(returnUrl)}`;

    void fetch(`${this.baseURL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);

    window.setTimeout(() => {
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.assign(redirectUrl);
      }
    }, 0);
  }

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001/api"
  ) {
    this.baseURL = baseURL;
  }

  private normalizeResponse<T>(payload: unknown): ApiResponse<T> {
    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;

      if (typeof obj.success === "boolean" && "data" in obj) {
        return {
          data: obj.data as T,
          success: obj.success,
          message: typeof obj.message === "string" ? obj.message : "",
        };
      }

      const isPaginatedShape =
        Array.isArray(obj.data) &&
        typeof obj.page === "number" &&
        typeof obj.limit === "number" &&
        typeof obj.total === "number" &&
        typeof obj.totalPages === "number";

      if (isPaginatedShape) {
        return { data: payload as T, success: true, message: "" };
      }

      const keys = Object.keys(obj);
      const isSimpleDataWrapper =
        "data" in obj &&
        (keys.length === 1 ||
          (keys.length === 2 && (keys.includes("message") || keys.includes("msg"))));

      if (isSimpleDataWrapper) {
        const message =
          (typeof obj.message === "string" && obj.message) ||
          (typeof obj.msg === "string" && obj.msg) ||
          "";
        return { data: obj.data as T, success: true, message };
      }
    }

    return { data: payload as T, success: true, message: "" };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({} as Record<string, unknown>));
        if (response.status === 401) {
          this.handleUnauthorized(endpoint);
        }
        throw new ApiClientError(
          typeof errorData.message === "string"
            ? errorData.message
            : `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      const payload = await response.json();
      return this.normalizeResponse<T>(payload);
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: {
      onProgress?: (progress: number) => void;
    }
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    if (options?.onProgress) {
      return new Promise<ApiResponse<T>>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.withCredentials = true;

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) {
            return;
          }

          options.onProgress?.(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onload = () => {
          const payload =
            xhr.responseText && xhr.responseText.length > 0
              ? JSON.parse(xhr.responseText)
              : ({} as Record<string, unknown>);

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(this.normalizeResponse<T>(payload));
            return;
          }

          if (xhr.status === 401) {
            this.handleUnauthorized(endpoint);
          }

          reject(
            new ApiClientError(
              typeof payload.message === "string"
                ? payload.message
                : `HTTP error! status: ${xhr.status}`,
              xhr.status,
              payload
            )
          );
        };

        xhr.onerror = () => {
          reject(new Error("Upload request failed."));
        };

        xhr.send(formData);
      });
    }

    const config: RequestInit = {
      method: "POST",
      credentials: "include",
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({} as Record<string, unknown>));
        if (response.status === 401) {
          this.handleUnauthorized(endpoint);
        }
        throw new ApiClientError(
          typeof errorData.message === "string"
            ? errorData.message
            : `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      const payload = await response.json();
      return this.normalizeResponse<T>(payload);
    } catch (error) {
      console.error("Upload request failed:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
