// src/types/catalog-extras.ts

// ---- Variants ----
export interface Variant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  inventory: number;
  attributes: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VariantCreatePayload {
  productId: string;
  sku: string;
  price: number;
  inventory?: number;
  attributes?: Record<string, unknown> | null;
}

export interface VariantUpdatePayload {
  sku?: string;
  price?: number;
  inventory?: number;
  attributes?: Record<string, unknown> | null;
}

// ---- Attributes ----
export interface Attribute {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: string; // e.g. "text" (default) — confirm full allowed list with backend intern
  createdAt?: string;
  updatedAt?: string;
}

export interface AttributeCreatePayload {
  tenantId: string;
  name: string;
  code: string;
  type?: string;
}

export interface AttributeUpdatePayload {
  name?: string;
  code?: string;
  type?: string;
}

export interface AttributeMapping {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
}

export interface AttributeMappingCreatePayload {
  attributeId: string;
  value: string;
}

// ---- Product Images ----
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  fileSize: number;
  fileType: string;
  createdAt?: string;
}

export interface ProductImageCreatePayload {
  productId: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
  fileSize: number;
  fileType: string;
}

// ---- Shipping Profiles ----
export interface ShippingProfile {
  id: string;
  tenantId: string;
  name: string;
  deliveryEstimate: string;
  charges: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingProfileCreatePayload {
  tenantId: string;
  name: string;
  deliveryEstimate: string;
  charges?: number;
}

export interface ShippingProfileUpdatePayload {
  name?: string;
  deliveryEstimate?: string;
  charges?: number;
}