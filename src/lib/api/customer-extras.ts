// src/lib/api/customer-extras.ts

import { apiClient } from "../api-client";
import {
  CustomerNote,
  CustomerNoteCreatePayload,
  CustomerActivityLog,
  CustomerConsentLog,
  CustomerSession,
  GuestCheckoutLog,
  ApprovalRequest,
  ApprovalRequestDraftPayload,
  ReviewQueueItem,
} from "@/types/customer-extras";

// ---- Notes ----
export const noteApi = {
  create: (data: CustomerNoteCreatePayload, token: string) =>
    apiClient<CustomerNote>("/api/v1/notes/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByCustomer: (customerId: string, token: string) =>
    apiClient<CustomerNote[]>(`/api/v1/notes/customer/${customerId}`, { token }),
  update: (noteId: string, noteText: string, token: string) =>
    apiClient<CustomerNote>(`/api/v1/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify({ noteText }),
      token,
    }),
  remove: (noteId: string, token: string) =>
    apiClient<void>(`/api/v1/notes/${noteId}`, { method: "DELETE", token }),
};

// ---- Activity Logs ----
export const activityLogApi = {
  create: (data: { customerId: string; activityType: string }, token: string) =>
    apiClient<CustomerActivityLog>("/api/v1/activity-logs/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByCustomer: (customerId: string, token: string) =>
    apiClient<CustomerActivityLog[]>(`/api/v1/activity-logs/customer/${customerId}`, {
      token,
    }),
};

// ---- Consents ----
export const consentApi = {
  create: (
    data: { customerId: string; consentType: string; accepted: boolean },
    token: string
  ) =>
    apiClient<CustomerConsentLog>("/api/v1/consents/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByCustomer: (customerId: string, token: string) =>
    apiClient<CustomerConsentLog[]>(`/api/v1/consents/customer/${customerId}`, {
      token,
    }),
};

// ---- Sessions (customer-facing sessions, distinct from platform User Sessions) ----
export const customerSessionApi = {
  listByCustomer: (customerId: string, token: string) =>
    apiClient<CustomerSession[]>(`/api/v1/sessions/customer/${customerId}`, {
      token,
    }),
  remove: (sessionId: string, token: string) =>
    apiClient<void>(`/api/v1/sessions/${sessionId}`, { method: "DELETE", token }),
};

// ---- Guest Checkouts ----
export const guestCheckoutApi = {
  create: (
    data: {
      tenantId: string;
      storeId: string;
      guestName: string;
      guestEmail: string;
      guestMobile: string;
    },
    token: string
  ) =>
    apiClient<GuestCheckoutLog>("/api/v1/guest-checkouts/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) =>
    apiClient<GuestCheckoutLog[]>("/api/v1/guest-checkouts/", { token }),
  getById: (logId: string, token: string) =>
    apiClient<GuestCheckoutLog>(`/api/v1/guest-checkouts/${logId}`, { token }),
  remove: (logId: string, token: string) =>
    apiClient<void>(`/api/v1/guest-checkouts/${logId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Approval Requests + Review Queue (generic — spans Products, Brands, etc.) ----
export const approvalRequestApi = {
  list: (tenantId: string, token: string) =>
    apiClient<ApprovalRequest[]>(
      `/api/v1/approval-requests/?tenantId=${tenantId}`,
      { token }
    ),
  draft: (data: ApprovalRequestDraftPayload, token: string) =>
    apiClient<ApprovalRequest>("/api/v1/approval-requests/draft", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  submit: (requestId: string, token: string) =>
    apiClient<ApprovalRequest>("/api/v1/approval-requests/submit", {
      method: "POST",
      body: JSON.stringify({ requestId }),
      token,
    }),
  approve: (requestId: string, token: string) =>
    apiClient<ApprovalRequest>(`/api/v1/approval-requests/${requestId}/approve`, {
      method: "POST",
      token,
    }),
  reject: (requestId: string, reason: string, token: string) =>
    apiClient<ApprovalRequest>(`/api/v1/approval-requests/${requestId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
      token,
    }),
  withdraw: (requestId: string, token: string) =>
    apiClient<ApprovalRequest>(`/api/v1/approval-requests/${requestId}/withdraw`, {
      method: "POST",
      token,
    }),
  remove: (requestId: string, token: string) =>
    apiClient<void>(`/api/v1/approval-requests/${requestId}`, {
      method: "DELETE",
      token,
    }),
};

export const reviewQueueApi = {
  list: (tenantId: string, token: string) =>
    apiClient<ReviewQueueItem[]>(`/api/v1/review-queue/?tenantId=${tenantId}`, {
      token,
    }),
  assign: (queueId: string, assignedTo: string, token: string) =>
    apiClient<ReviewQueueItem>(`/api/v1/review-queue/${queueId}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ assignedTo }),
      token,
    }),
};