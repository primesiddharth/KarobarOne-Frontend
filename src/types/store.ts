// src/types/store.ts

export interface Store {
  id: string;
  tenantId: string;
  storeName: string;
  storeSlug: string;
  tagline: string | null;
  email: string | null;
  mobile: string | null;
  whatsappMobile: string | null;
  description: string | null;
  logoMediaId: string | null;
  faviconMediaId: string | null;
  heroMediaId: string | null;
  isActive: boolean;
  approvalStatus: string; // e.g. "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" — confirm exact values with backend intern
  createdAt: string;
  updatedAt: string;
}

export interface StoreCreatePayload {
  tenantId: string;
  storeName: string;
  storeSlug: string;
  tagline?: string | null;
  email?: string | null;
  mobile?: string | null;
  whatsappMobile?: string | null;
  description?: string | null;
  logoMediaId?: string | null;
  faviconMediaId?: string | null;
  heroMediaId?: string | null;
  isActive?: boolean;
  approvalStatus?: string;
}

export interface StoreUpdatePayload {
  storeName?: string;
  storeSlug?: string;
  tagline?: string | null;
  email?: string | null;
  mobile?: string | null;
  whatsappMobile?: string | null;
  description?: string | null;
  logoMediaId?: string | null;
  faviconMediaId?: string | null;
  heroMediaId?: string | null;
  isActive?: boolean;
  approvalStatus?: string;
}

// GET /stores/{id}/status doesn't have a named response schema in the backend —
// shape is unconfirmed, so treat it as unknown and inspect at runtime for now.
export type StoreStatus = Record<string, unknown>;