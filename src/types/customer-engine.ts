// src/types/customer-engine.ts

export interface CustomerEngineProfile {
  id: string;
  tenantId: string;
  storeId: string;
  customerCode: string;
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string;
  status: string;
  isGuestCustomer: boolean;
  profileImage: string | null;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerEngineProfileUpdatePayload {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile?: string | null;
}

export interface AccountActivationPayload {
  password: string;
}

export interface ProfileImageUploadResponse {
  message: string;
  profileImage: string;
}