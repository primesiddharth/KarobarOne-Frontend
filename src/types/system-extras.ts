// src/types/system-extras.ts

// ---- Entity Verifications (OTP/email/mobile verification) ----
export interface EntityVerification {
  id: string;
  entityType: string;
  entityId: string;
  verificationType: string;
  status: string; // e.g. "PENDING" | "VERIFIED" | "EXPIRED"
  attempts: number;
  expiresAt: string;
  createdAt?: string;
}

export interface EntityVerificationCreatePayload {
  entityType?: string;
  entityId: string;
  verificationType?: string;
  otpHash: string;
  expiresAt: string;
}

// ---- Entity Versions (draft/rollback history for any entity) ----
export interface EntityVersion {
  id: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  versionNumber: number;
  versionData: Record<string, unknown>;
  isPublished: boolean;
  createdBy: string;
  createdAt?: string;
}

export interface EntityVersionCreatePayload {
  tenantId: string;
  entityType: string;
  entityId: string;
  versionNumber: number;
  versionData: Record<string, unknown>;
  isPublished?: boolean;
  createdBy: string;
}

// ---- User Sessions (platform-level, distinct from Customer Sessions) ----
export interface UserSession {
  id: string;
  userId: string;
  refreshTokenId: string;
  loginAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  endedAt?: string | null;
}