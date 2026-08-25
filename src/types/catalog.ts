// src/types/catalog.ts

// ---- Categories ----
export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreatePayload {
  tenantId: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

export interface CategoryUpdatePayload {
  name?: string;
  slug?: string;
  parentId?: string | null;
}

// ---- Brands ----
export interface Brand {
  id: string;
  tenantId: string;
  name: string;
  logoUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandCreatePayload {
  tenantId: string;
  name: string;
  logoUrl?: string | null;
}

export interface BrandUpdatePayload {
  name?: string;
  logoUrl?: string | null;
}

// ---- Products ----
export interface Product {
  id: string;
  tenantId: string;
  storeId: string;
  name: string;
  slug: string;
  description: string | null;
  status: string; // default "DRAFT" — confirm full allowed list with backend intern
  productType: string; // default "PHYSICAL" — confirm full allowed list with backend intern
  sku: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  categoryId: string | null;
  brandId: string | null;
  shippingProfileId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreatePayload {
  tenantId: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string | null;
  status?: string;
  productType?: string;
  sku?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  shippingProfileId?: string | null;
}

export interface ProductUpdatePayload {
  name?: string;
  slug?: string;
  description?: string | null;
  status?: string;
  productType?: string;
  sku?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  shippingProfileId?: string | null;
}

export interface ProductSearchParams {
  tenantId: string; // required by the backend
  storeId?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  productType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

// GET /catalog/products/ returns a paginated wrapper, not a bare array
export interface ProductPaginatedResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Product[];
}