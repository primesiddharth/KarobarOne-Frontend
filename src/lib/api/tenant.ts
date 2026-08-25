// src/lib/api/tenant.ts

import { apiClient } from "../api-client";
import { Tenant, TenantCreatePayload } from "@/types/tenant";

export const tenantApi = {
  create: (data: TenantCreatePayload, token: string) =>
    apiClient<Tenant>("/api/v1/tenants", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (token: string) => apiClient<Tenant[]>("/api/v1/tenants", { token }),

  getById: (tenantId: string, token: string) =>
    apiClient<Tenant>(`/api/v1/tenants/${tenantId}`, { token }),
};