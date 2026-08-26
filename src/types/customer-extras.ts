// src/types/customer-extras.ts

export interface CustomerNote {
  id: string;
  customerId: string;
  noteText: string;
  createdBy: string;
  createdAt?: string;
}

export interface CustomerNoteCreatePayload {
  customerId: string;
  noteText: string;
  createdBy: string;
}

export interface CustomerActivityLog {
  id: string;
  customerId: string;
  activityType: string;
  entityType: string | null;
  entityId: string | null;
  activityData: Record<string, unknown> | null;
  createdAt?: string;
}

export interface CustomerConsentLog {
  id: string;
  customerId: string;
  consentType: string;
  accepted: boolean;
  acceptedAt?: string;
}

export interface CustomerSession {
  id: string;
  customerId: string;
  ipAddress: string | null;
  userAgent: string | null;
  loginAt: string;
  expiresAt: string;
}

export interface GuestCheckoutLog {
  id: string;
  tenantId: string;
  storeId: string;
  customerId: string | null;
  orderId: string | null;
  bookingId: string | null;
  guestName: string;
  guestEmail: string;
  guestMobile: string;
  createdAt?: string;
}

// ---- Approval Requests / Review Queue (generic, spans entity types) ----
export interface ApprovalRequest {
  id: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  versionData: Record<string, unknown>;
  status: string; // e.g. "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"
  createdBy: string;
  createdAt?: string;
}

export interface ApprovalRequestDraftPayload {
  tenantId: string;
  entityType: string;
  entityId: string;
  versionData: Record<string, unknown>;
  createdBy: string;
}

export interface ReviewQueueItem {
  id: string;
  tenantId: string;
  entityType: string;
  approvalStatus: string;
  assignedTo: string | null;
  createdAt?: string;
}