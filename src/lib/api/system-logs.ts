// src/lib/api/system-logs.ts

import { apiClient } from "../api-client";
import {
  AuditLog,
  LoginHistoryEntry,
  StatusHistoryEntry,
  Tag,
  TagCreatePayload,
  TagUpdatePayload,
  TagMapping,
  TagMappingCreatePayload,
  PasswordResetRequestPayload,
  PasswordResetConfirmPayload,
  InvoiceGeneratePayload,
  WebsiteDeployment,
  WebsiteDeploymentCreatePayload,
  WebsitePublishLog,
  WebsitePublishLogCreatePayload,
} from "@/types/system-logs";

// ---- Audit Logs ----
export const auditLogApi = {
  list: (token: string) => apiClient<AuditLog[]>("/api/v1/audit-logs/", { token }),
  getById: (logId: string, token: string) =>
    apiClient<AuditLog>(`/api/v1/audit-logs/${logId}`, { token }),
};

// ---- Login History ----
export const loginHistoryApi = {
  listForUser: (userId: string, token: string) =>
    apiClient<LoginHistoryEntry[]>(`/api/v1/login-history/${userId}`, { token }),
};

// ---- Status History ----
export const statusHistoryApi = {
  list: (token: string) =>
    apiClient<StatusHistoryEntry[]>("/api/v1/status-history/", { token }),
  getById: (historyId: string, token: string) =>
    apiClient<StatusHistoryEntry>(`/api/v1/status-history/${historyId}`, { token }),
  remove: (historyId: string, token: string) =>
    apiClient<void>(`/api/v1/status-history/${historyId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Tags ----
export const tagApi = {
  create: (data: TagCreatePayload, token: string) =>
    apiClient<Tag>("/api/v1/tags/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) => apiClient<Tag[]>("/api/v1/tags/", { token }),
  update: (tagId: string, data: TagUpdatePayload, token: string) =>
    apiClient<Tag>(`/api/v1/tags/${tagId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (tagId: string, token: string) =>
    apiClient<void>(`/api/v1/tags/${tagId}`, { method: "DELETE", token }),
};

// ---- Tag Mappings ----
export const tagMappingApi = {
  create: (data: TagMappingCreatePayload, token: string) =>
    apiClient<TagMapping>("/api/v1/tag-mappings/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) =>
    apiClient<TagMapping[]>("/api/v1/tag-mappings/", { token }),
  remove: (mappingId: string, token: string) =>
    apiClient<void>(`/api/v1/tag-mappings/${mappingId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Password Reset (no token needed — public endpoints) ----
export const passwordResetApi = {
  request: (data: PasswordResetRequestPayload) =>
    apiClient<{ message: string }>("/api/v1/password-reset/request", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  confirm: (data: PasswordResetConfirmPayload) =>
    apiClient<{ message: string }>("/api/v1/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ---- Invoice Generator ----
export const invoiceApi = {
  generate: (data: InvoiceGeneratePayload, token: string) =>
    apiClient<unknown>("/api/v1/invoice/generate", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
};

// ---- Website Deployments ----
export const websiteDeploymentApi = {
  create: (data: WebsiteDeploymentCreatePayload, token: string) =>
    apiClient<WebsiteDeployment>("/api/v1/website-deployments/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByStore: (storeId: string, token: string) =>
    apiClient<WebsiteDeployment[]>(`/api/v1/website-deployments/store/${storeId}`, {
      token,
    }),
  getById: (deploymentId: string, token: string) =>
    apiClient<WebsiteDeployment>(`/api/v1/website-deployments/${deploymentId}`, {
      token,
    }),
  start: (deploymentId: string, token: string) =>
    apiClient<WebsiteDeployment>(`/api/v1/website-deployments/${deploymentId}/start`, {
      method: "POST",
      token,
    }),
  markSuccess: (deploymentId: string, token: string) =>
    apiClient<WebsiteDeployment>(
      `/api/v1/website-deployments/${deploymentId}/success`,
      { method: "POST", token }
    ),
  markFailed: (deploymentId: string, token: string) =>
    apiClient<WebsiteDeployment>(
      `/api/v1/website-deployments/${deploymentId}/failed`,
      { method: "POST", token }
    ),
};

// ---- Website Publish Logs ----
export const websitePublishLogApi = {
  create: (data: WebsitePublishLogCreatePayload, token: string) =>
    apiClient<WebsitePublishLog>("/api/v1/website-publish-logs/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByStore: (storeId: string, token: string) =>
    apiClient<WebsitePublishLog[]>(
      `/api/v1/website-publish-logs/store/${storeId}`,
      { token }
    ),
};