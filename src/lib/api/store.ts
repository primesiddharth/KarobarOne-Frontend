// src/lib/api/store.ts

import { apiClient } from "../api-client";
import {
  Store,
  StoreCreatePayload,
  StoreUpdatePayload,
  StoreStatus,
} from "@/types/store";

export const storeApi = {
  create: (data: StoreCreatePayload, token: string) =>
    apiClient<Store>("/api/v1/stores/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (tenantId: string | undefined, token: string) => {
    const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
    return apiClient<Store[]>(`/api/v1/stores/${query}`, { token });
  },

  getById: (storeId: string, token: string) =>
    apiClient<Store>(`/api/v1/stores/${storeId}`, { token }),

  getBySlug: (storeSlug: string, token: string) =>
    apiClient<Store>(`/api/v1/stores/slug/${storeSlug}`, { token }),

  update: (storeId: string, data: StoreUpdatePayload, token: string) =>
    apiClient<Store>(`/api/v1/stores/${storeId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (storeId: string, token: string) =>
    apiClient<void>(`/api/v1/stores/${storeId}`, {
      method: "DELETE",
      token,
    }),

  connectDomain: (storeId: string, domain: string, token: string) =>
    apiClient<Store>(
      `/api/v1/stores/${storeId}/connect-domain?domain=${encodeURIComponent(domain)}`,
      { method: "POST", token }
    ),

  generateAi: (storeId: string, token: string) =>
    apiClient<Store>(`/api/v1/stores/${storeId}/generate-ai`, {
      method: "POST",
      token,
    }),

  preview: (storeId: string, token: string) =>
    apiClient<unknown>(`/api/v1/stores/${storeId}/preview`, { token }),

  publish: (storeId: string, token: string) =>
    apiClient<Store>(`/api/v1/stores/${storeId}/publish`, {
      method: "POST",
      token,
    }),

  getStatus: (storeId: string, token: string) =>
    apiClient<StoreStatus>(`/api/v1/stores/${storeId}/status`, { token }),

  submitForApproval: (storeId: string, token: string) =>
    apiClient<Store>(`/api/v1/stores/${storeId}/submit`, {
      method: "POST",
      token,
    }),

  changeTheme: (storeId: string, themeId: string, token: string) =>
    apiClient<Store>(
      `/api/v1/stores/${storeId}/theme?themeId=${encodeURIComponent(themeId)}`,
      { method: "PATCH", token }
    ),
};