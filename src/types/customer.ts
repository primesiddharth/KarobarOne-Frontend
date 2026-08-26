// src/types/customer.ts

export interface Customer {
  id: string;
  tenantId: string;
  storeId: string;
  customerCode: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string;
  status: string;
  isGuestCustomer: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerCreatePayload {
  tenantId: string;
  storeId: string;
  customerCode?: string | null;
  firstName: string;
  lastName?: string | null;
  email: string;
  mobile: string;
  status?: string;
  isGuestCustomer?: boolean;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  password?: string | null;
}

export interface CustomerUpdatePayload {
  customerCode?: string | null;
  firstName?: string;
  lastName?: string | null;
  email?: string;
  mobile?: string;
  status?: string;
  isGuestCustomer?: boolean;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
}

export interface CustomerSearchParams {
  storeId?: string;
  status?: string;
  isGuestCustomer?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CustomerPaginatedResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Customer[];
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface CustomerAddressCreatePayload {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface CustomerGroup {
  id: string;
  storeId: string;
  groupName: string;
  description: string | null;
  createdAt?: string;
}

export interface CustomerGroupCreatePayload {
  storeId: string;
  groupName: string;
  description?: string | null;
}

export interface CustomerGroupUpdatePayload {
  groupName?: string;
  description?: string | null;
}

export interface CustomerGroupMember {
  customerId: string;
  groupId: string;
}
