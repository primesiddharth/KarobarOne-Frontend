// src/types/tenant.ts

/* =========================
   TENANT CREATE
========================= */

export interface TenantCreatePayload {
  panNumber: string;

  businessName: string;
  legalName: string;

  email: string;
  mobile: string;
  whatsappMobile?: string | null;

  ownerName: string;

  businessAddressLine1: string;
  businessAddressLine2?: string | null;

  city: string;
  state: string;
  country?: string;
  postalCode: string;

  landmark?: string | null;
  postOffice?: string | null;
  policeStation?: string | null;

  businessType: string;
  businessDescription?: string | null;

  gstNumber?: string | null;

  documentMediaLink?: string | null;
  logoMediaId?: string | null;

  employeeCount?: number | null;
}


/* =========================
   TENANT UPDATE
   PATCH /api/v1/tenants/{tenantId}
========================= */

export interface TenantUpdatePayload {
  gstNumber?: string;
  documentMediaLink?: string;

  documentVerificationDone?: boolean;
  documentVerificationDoneBy?: string;

  businessName?: string;
  legalName?: string;

  logoMediaId?: string;

  email?: string;
  mobile?: string;
  whatsappMobile?: string;

  ownerName?: string;

  businessAddressLine1?: string;
  businessAddressLine2?: string;

  locationLatitude?: number;
  locationLongitude?: number;

  landmark?: string;
  postOffice?: string;
  policeStation?: string;

  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  businessType?: string;
  businessDescription?: string;

  employeeCount?: number;

  statusId?: number;
  isActive?: boolean;
}


/* =========================
   PLAN
========================= */

export interface TenantPlan {
  id: string;
  planCode: string;
  planName: string;

  monthlyPrice: string | number;
  transactionCommissionPercent: string | number;

  isActive: boolean;
  createdAt: string;
}


/* =========================
   PLAN MAPPING
========================= */

export interface TenantPlanMapping {
  id: string;
  tenantId: string;
  planId: string;

  planStartDate: string;
  planEndDate: string;

  planUpdateAt: string;

  autoRenew: boolean;
  planChange: boolean;

  changeReason: string;

  statusId: number;

  statusUpdateAt: string;
  statusUpdateBy: string;

  plan: TenantPlan;
}


/* =========================
   DOMAIN
========================= */

/*
 * Backend currently returns domains: []
 * so we keep this extensible until
 * the exact domain schema is provided.
 */
export interface TenantDomain {
  [key: string]: unknown;
}


/* =========================
   TENANT RESPONSE
========================= */

export interface Tenant {
  id: string;

  gstNumber: string;
  panNumber: string;

  documentMediaLink: string;

  documentVerificationDone: boolean;
  documentVerificationDoneBy: string;
  documentVerificationDoneAt: string;

  businessName: string;
  legalName: string;

  logoMediaId: string;

  email: string;
  mobile: string;
  whatsappMobile: string;

  ownerName: string;

  businessAddressLine1: string;
  businessAddressLine2: string;

  /*
   * Backend response is serialized as string
   * for these decimal values.
   */
  locationLatitude: string | number;
  locationLongitude: string | number;

  landmark: string;
  postOffice: string;
  policeStation: string;

  city: string;
  state: string;
  country: string;
  postalCode: string;

  businessType: string;
  businessDescription: string;

  employeeCount: number;

  registeredAt: string;

  statusId: number;
  isActive: boolean;

  planMapping: TenantPlanMapping | null;

  domains: TenantDomain[];

  createdAt: string;
  updatedAt: string;
}


/* =========================
   TENANT SETTINGS
========================= */

export interface TenantSettings {
  id: string;
  tenantId: string;

  currency: string;
  language: string;
  timezone: string;

  invoicePrefix: string;

  fiscalYearStart: number;
  taxRate: number;

  enableNotifications: boolean;
  enableAutoRenew: boolean;

  createdAt: string;
  updatedAt: string;
}


/* =========================
   TENANT SETTINGS UPDATE
========================= */

export interface TenantSettingsUpdatePayload {
  currency?: string;
  timezone?: string;
  language?: string;

  invoicePrefix?: string;

  fiscalYearStart?: number;
  taxRate?: number;

  enableNotifications?: boolean;
  enableAutoRenew?: boolean;
}