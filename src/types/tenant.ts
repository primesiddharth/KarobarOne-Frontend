// src/types/tenant.ts

export interface TenantCreatePayload {
  panNumber: string;
  businessName: string;
  legalName: string;
  email: string;
  mobile: string;
  ownerName: string;
  businessAddressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  businessType: string;
  gstNumber?: string | null;
  documentMediaLink?: string | null;
  logoMediaId?: string | null;
  whatsappMobile?: string | null;
  businessAddressLine2?: string | null;
  landmark?: string | null;
  postOffice?: string | null;
  policeStation?: string | null;
  country?: string; // defaults to "India" on backend
  businessDescription?: string | null;
  employeeCount?: number | null;
}

export interface Tenant extends TenantCreatePayload {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Response may include extra fields (status, plan info) — confirm with backend
  // intern / TenantResponse schema if the dashboard ends up needing them.
}