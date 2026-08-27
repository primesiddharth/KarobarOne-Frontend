// src/types/system-logs.ts

// ---- Audit Logs ----
export interface AuditLog {
  id: string;
  tenantId: string | null;
  entityType: string;
  entityId: string;
  actionType: string;
  oldValue: unknown;
  newValue: unknown;
  changedFields: unknown;
  performedBy: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt?: string;
}

// ---- Login History ----
export interface LoginHistoryEntry {
  id: string;
  userId: string | null;
  email: string;
  ipAddress: string | null;
  userAgent: string | null;
  loginStatus: "SUCCESS" | "FAILED";
  failureReason: string | null;
  createdAt?: string;
}

// ---- Status History ----
export interface StatusHistoryEntry {
  id: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  oldStatus: string | null;
  newStatus: string;
  changeReason: string | null;
  changedBy: string;
  createdAt?: string;
}

// ---- Tags & Tag Mappings ----
export interface Tag {
  id: string;
  tenantId: string | null;
  storeId: string | null;
  tagName: string;
  tagSlug: string | null;
  tagType: string;
  description: string | null;
  colorCode: string | null;
  isSystemTag: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt?: string;
}

export interface TagCreatePayload {
  tenantId?: string | null;
  storeId?: string | null;
  tagName: string;
  tagSlug?: string | null;
  tagType: string;
  description?: string | null;
  colorCode?: string | null;
  isSystemTag?: boolean;
  isActive?: boolean;
  createdBy: string;
}

export interface TagUpdatePayload {
  tagName?: string;
  description?: string | null;
  colorCode?: string | null;
  isActive?: boolean;
}

export interface TagMapping {
  id: string;
  tagId: string;
  entityType: string;
  entityId: string;
  mappedBy: string;
}

export interface TagMappingCreatePayload {
  tagId: string;
  entityType: string;
  entityId: string;
  mappedBy: string;
}

// ---- Password Reset (public-facing) ----
export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  token: string;
  newPassword: string;
}

// ---- Invoice Generator ----
export interface InvoiceCompany {
  gstin: string;
  name: string;
  address1: string;
  address2: string;
  state: string;
  contact: string;
}

export interface InvoiceParty {
  name: string;
  address: string;
  gstin?: string | null;
  state: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string | null;
}

export interface InvoiceItem {
  description: string;
  hsn?: string | null;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceBank {
  name: string;
  branch: string;
  account: string;
  ifsc: string;
  upi?: string | null;
}

export interface InvoiceGeneratePayload {
  company?: InvoiceCompany;
  bill_to: InvoiceParty;
  ship_to: InvoiceParty;
  invoice: InvoiceMeta;
  items: InvoiceItem[];
  bank?: InvoiceBank;
  declaration?: string[];
}

// ---- Website Deployments ----
export interface WebsiteDeployment {
  id: string;
  storeId: string;
  deploymentId: string | null;
  provider: string;
  status: string;
  createdAt?: string;
}

export interface WebsiteDeploymentCreatePayload {
  storeId: string;
  deploymentId?: string | null;
  provider: string;
}

// ---- Website Publish Logs ----
export interface WebsitePublishLog {
  id: string;
  storeId: string;
  deploymentId: string | null;
  action: string;
  status: string;
  version: string | null;
  message: string | null;
  createdAt?: string;
}

export interface WebsitePublishLogCreatePayload {
  storeId: string;
  deploymentId?: string | null;
  action: string;
  status: string;
  version?: string | null;
  message?: string | null;
}