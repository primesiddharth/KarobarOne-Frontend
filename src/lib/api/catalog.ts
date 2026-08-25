// src/lib/api/catalog.ts

import { apiClient } from "../api-client";
import {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  Brand,
  BrandCreatePayload,
  BrandUpdatePayload,
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductSearchParams,
  ProductPaginatedResponse,
} from "@/types/catalog";

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

// ---- Categories ----
export const categoryApi = {
  create: (data: CategoryCreatePayload, token: string) =>
    apiClient<Category>("/api/v1/catalog/categories/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (token: string) =>
    apiClient<Category[]>("/api/v1/catalog/categories/", { token }),

  getById: (categoryId: string, token: string) =>
    apiClient<Category>(`/api/v1/catalog/categories/${categoryId}`, { token }),

  update: (categoryId: string, data: CategoryUpdatePayload, token: string) =>
    apiClient<Category>(`/api/v1/catalog/categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (categoryId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/categories/${categoryId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Brands ----
export const brandApi = {
  create: (data: BrandCreatePayload, token: string) =>
    apiClient<Brand>("/api/v1/catalog/brands/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (token: string) => apiClient<Brand[]>("/api/v1/catalog/brands/", { token }),

  getById: (brandId: string, token: string) =>
    apiClient<Brand>(`/api/v1/catalog/brands/${brandId}`, { token }),

  update: (brandId: string, data: BrandUpdatePayload, token: string) =>
    apiClient<Brand>(`/api/v1/catalog/brands/${brandId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (brandId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/brands/${brandId}`, {
      method: "DELETE",
      token,
    }),

  requestApproval: (brandId: string, token: string) =>
    apiClient<unknown>(`/api/v1/catalog/brands/${brandId}/request-approval`, {
      method: "POST",
      token,
    }),
};

// ---- Products ----
export const productApi = {
  create: (data: ProductCreatePayload, token: string) =>
    apiClient<Product>("/api/v1/catalog/products/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  // tenantId is required by the backend. Response is a paginated wrapper.
  search: (params: ProductSearchParams, token: string) =>
    apiClient<ProductPaginatedResponse>(
      `/api/v1/catalog/products/${toQueryString(params)}`,
      { token }
    ),

  getById: (productId: string, token: string) =>
    apiClient<Product>(`/api/v1/catalog/products/${productId}`, { token }),

  update: (productId: string, data: ProductUpdatePayload, token: string) =>
    apiClient<Product>(`/api/v1/catalog/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (productId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/products/${productId}`, {
      method: "DELETE",
      token,
    }),

  submitApproval: (productId: string, token: string) =>
    apiClient<Product>(`/api/v1/catalog/products/${productId}/submit-approval`, {
      method: "POST",
      token,
    }),

  approve: (productId: string, token: string) =>
    apiClient<Product>(`/api/v1/catalog/products/${productId}/approve`, {
      method: "POST",
      token,
    }),
};