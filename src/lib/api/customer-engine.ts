// src/lib/api/customer-engine.ts

import { apiClient, ApiError } from "../api-client";
import {
  CustomerEngineProfile,
  CustomerEngineProfileUpdatePayload,
  AccountActivationPayload,
  ProfileImageUploadResponse,
} from "@/types/customer-engine";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const customerEngineApi = {
  getProfile: (customerId: string, token: string) =>
    apiClient<CustomerEngineProfile>(
      `/api/v1/customer-engine/customers/${customerId}`,
      { token }
    ),

  updateProfile: (
    customerId: string,
    data: CustomerEngineProfileUpdatePayload,
    token: string
  ) =>
    apiClient<CustomerEngineProfile>(
      `/api/v1/customer-engine/customers/${customerId}`,
      { method: "PUT", body: JSON.stringify(data), token }
    ),

  activate: (customerId: string, data: AccountActivationPayload, token: string) =>
    apiClient<CustomerEngineProfile>(
      `/api/v1/customer-engine/customers/${customerId}/activate`,
      { method: "POST", body: JSON.stringify(data), token }
    ),

  // Multipart file upload — bypasses apiClient since it needs FormData, not JSON
  uploadProfileImage: async (
    customerId: string,
    file: File,
    token: string
  ): Promise<ProfileImageUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${BASE_URL}/api/v1/customer-engine/customers/${customerId}/media`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail.map((d: { msg: string }) => d.msg).join(", ")
          : `Upload failed: ${res.status}`;
      throw new ApiError(message, res.status, data);
    }

    return data as ProfileImageUploadResponse;
  },
};