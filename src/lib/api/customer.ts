// src/lib/api/customer.ts

import { apiClient } from "../api-client";
import {
  Customer,
  CustomerCreatePayload,
  CustomerUpdatePayload,
  CustomerSearchParams,
  CustomerPaginatedResponse,
  CustomerAddress,
  CustomerAddressCreatePayload,
  CustomerGroup,
  CustomerGroupCreatePayload,
  CustomerGroupUpdatePayload,
  CustomerGroupMember,
} from "@/types/customer";

function toQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ""
  );
  if (entries.length === 0) return "";
  const query = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return `?${query}`;
}

// ---- Customers ----
export const customerApi = {
  create: (data: CustomerCreatePayload, token: string) =>
    apiClient<Customer>("/api/v1/customers/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (params: CustomerSearchParams, token: string) =>
    apiClient<CustomerPaginatedResponse>(
      `/api/v1/customers/${toQueryString(params)}`,
      { token }
    ),

  getById: (customerId: string, token: string) =>
    apiClient<Customer>(`/api/v1/customers/${customerId}`, { token }),

  update: (customerId: string, data: CustomerUpdatePayload, token: string) =>
    apiClient<Customer>(`/api/v1/customers/${customerId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (customerId: string, token: string) =>
    apiClient<void>(`/api/v1/customers/${customerId}`, {
      method: "DELETE",
      token,
    }),

  restore: (customerId: string, token: string) =>
    apiClient<Customer>(`/api/v1/customers/${customerId}/restore`, {
      method: "POST",
      token,
    }),

  listTrash: (token: string) =>
    apiClient<CustomerPaginatedResponse>("/api/v1/customers/trash/list", {
      token,
    }),
};

// ---- Customer Addresses (customer-engine) ----
export const customerAddressApi = {
  list: (customerId: string, token: string) =>
    apiClient<CustomerAddress[]>(
      `/api/v1/customer-engine/customers/${customerId}/addresses`,
      { token }
    ),

  create: (
    customerId: string,
    data: CustomerAddressCreatePayload,
    token: string
  ) =>
    apiClient<CustomerAddress>(
      `/api/v1/customer-engine/customers/${customerId}/addresses`,
      { method: "POST", body: JSON.stringify(data), token }
    ),

  remove: (addressId: string, token: string) =>
    apiClient<void>(`/api/v1/customer-engine/addresses/${addressId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Customer Groups ----
export const customerGroupApi = {
  create: (data: CustomerGroupCreatePayload, token: string) =>
    apiClient<CustomerGroup>("/api/v1/groups/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (token: string) =>
    apiClient<CustomerGroup[]>("/api/v1/groups/", { token }),

  getById: (groupId: string, token: string) =>
    apiClient<CustomerGroup>(`/api/v1/groups/${groupId}`, { token }),

  update: (groupId: string, data: CustomerGroupUpdatePayload, token: string) =>
    apiClient<CustomerGroup>(`/api/v1/groups/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (groupId: string, token: string) =>
    apiClient<void>(`/api/v1/groups/${groupId}`, {
      method: "DELETE",
      token,
    }),

  listMembers: (groupId: string, token: string) =>
    apiClient<CustomerGroupMember[]>(`/api/v1/groups/${groupId}/members`, {
      token,
    }),

  addMember: (groupId: string, customerId: string, token: string) =>
    apiClient<CustomerGroupMember>(`/api/v1/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ groupId, customerId }),
      token,
    }),

  removeMember: (groupId: string, customerId: string, token: string) =>
    apiClient<void>(`/api/v1/groups/${groupId}/members/${customerId}`, {
      method: "DELETE",
      token,
    }),
};