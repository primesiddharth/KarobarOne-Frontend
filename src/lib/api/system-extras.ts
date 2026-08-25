// src/lib/api/system-extras.ts

import { apiClient } from "../api-client";
import {
  EntityVerification,
  EntityVerificationCreatePayload,
  EntityVersion,
  EntityVersionCreatePayload,
  UserSession,
} from "@/types/system-extras";

// ---- Entity Verifications ----
export const verificationApi = {
  create: (data: EntityVerificationCreatePayload, token: string) =>
    apiClient<EntityVerification>("/api/v1/verifications/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (token: string) =>
    apiClient<EntityVerification[]>("/api/v1/verifications/", { token }),

  getById: (verificationId: string, token: string) =>
    apiClient<EntityVerification>(`/api/v1/verifications/${verificationId}`, {
      token,
    }),

  remove: (verificationId: string, token: string) =>
    apiClient<void>(`/api/v1/verifications/${verificationId}`, {
      method: "DELETE",
      token,
    }),

  incrementAttempt: (verificationId: string, token: string) =>
    apiClient<EntityVerification>(
      `/api/v1/verifications/${verificationId}/increment-attempt`,
      { method: "POST", token }
    ),

  verify: (verificationId: string, otpHash: string, token: string) =>
    apiClient<EntityVerification>(
      `/api/v1/verifications/${verificationId}/verify`,
      { method: "POST", body: JSON.stringify({ otpHash }), token }
    ),
};

// ---- Entity Versions ----
export const entityVersionApi = {
  create: (data: EntityVersionCreatePayload, token: string) =>
    apiClient<EntityVersion>("/api/v1/entity-versions/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  listForEntity: (entityType: string, entityId: string, token: string) =>
    apiClient<EntityVersion[]>(
      `/api/v1/entity-versions/?entityType=${entityType}&entityId=${entityId}`,
      { token }
    ),

  getById: (versionId: string, token: string) =>
    apiClient<EntityVersion>(`/api/v1/entity-versions/${versionId}`, { token }),

  rollback: (versionId: string, token: string) =>
    apiClient<EntityVersion>(`/api/v1/entity-versions/${versionId}/rollback`, {
      method: "POST",
      token,
    }),
};

// ---- User Sessions (platform-level "active devices") ----
export const userSessionApi = {
  list: (userId: string, token: string) =>
    apiClient<UserSession[]>(`/api/v1/users/${userId}/sessions/`, { token }),

  end: (userId: string, sessionId: string, token: string) =>
    apiClient<UserSession>(
      `/api/v1/users/${userId}/sessions/${sessionId}/end`,
      { method: "PATCH", token }
    ),
};