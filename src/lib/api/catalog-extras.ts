// src/lib/api/catalog-extras.ts

import { apiClient, ApiError } from "../api-client";
import {
  Variant,
  VariantCreatePayload,
  VariantUpdatePayload,
  Attribute,
  AttributeCreatePayload,
  AttributeUpdatePayload,
  AttributeMapping,
  AttributeMappingCreatePayload,
  ProductImage,
  ProductImageCreatePayload,
  ShippingProfile,
  ShippingProfileCreatePayload,
  ShippingProfileUpdatePayload,
} from "@/types/catalog-extras";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ---- Variants ----
export const variantApi = {
  create: (data: VariantCreatePayload, token: string) =>
    apiClient<Variant>("/api/v1/catalog/variants/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  listByProduct: (productId: string, token: string) =>
    apiClient<Variant[]>(`/api/v1/catalog/variants/?productId=${productId}`, {
      token,
    }),

  update: (variantId: string, data: VariantUpdatePayload, token: string) =>
    apiClient<Variant>(`/api/v1/catalog/variants/${variantId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (variantId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/variants/${variantId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Attributes ----
export const attributeApi = {
  create: (data: AttributeCreatePayload, token: string) =>
    apiClient<Attribute>("/api/v1/catalog/attributes/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (token: string) =>
    apiClient<Attribute[]>("/api/v1/catalog/attributes/", { token }),

  update: (attributeId: string, data: AttributeUpdatePayload, token: string) =>
    apiClient<Attribute>(`/api/v1/catalog/attributes/${attributeId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (attributeId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/attributes/${attributeId}`, {
      method: "DELETE",
      token,
    }),

  // Attach an attribute value to a product
  mapToProduct: (
    productId: string,
    data: AttributeMappingCreatePayload,
    token: string
  ) =>
    apiClient<AttributeMapping>(
      `/api/v1/catalog/attributes/mappings?productId=${productId}`,
      { method: "POST", body: JSON.stringify(data), token }
    ),

  getMappingsForProduct: (productId: string, token: string) =>
    apiClient<AttributeMapping[]>(
      `/api/v1/catalog/attributes/mappings/${productId}`,
      { token }
    ),

  removeMapping: (mappingId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/attributes/mappings/${mappingId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Product Images ----
export const imageApi = {
  // Registers image metadata after you already have a hosted URL
  create: (data: ProductImageCreatePayload, token: string) =>
    apiClient<ProductImage>("/api/v1/catalog/images/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  listByProduct: (productId: string, token: string) =>
    apiClient<ProductImage[]>(`/api/v1/catalog/images/?productId=${productId}`, {
      token,
    }),

  remove: (imageId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/images/${imageId}`, {
      method: "DELETE",
      token,
    }),

  // Multipart file upload — bypasses apiClient since it needs FormData, not JSON
  upload: async (
    file: File,
    productId: string,
    token: string
  ): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);

    const res = await fetch(`${BASE_URL}/api/v1/catalog/images/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail.map((d: { msg: string }) => d.msg).join(", ")
          : `Upload failed: ${res.status}`;
      throw new ApiError(message, res.status, data);
    }

    return data as ProductImage;
  },
};

// ---- Shipping Profiles ----
export const shippingProfileApi = {
  create: (data: ShippingProfileCreatePayload, token: string) =>
    apiClient<ShippingProfile>("/api/v1/catalog/shipping/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (token: string) =>
    apiClient<ShippingProfile[]>("/api/v1/catalog/shipping/", { token }),

  update: (
    profileId: string,
    data: ShippingProfileUpdatePayload,
    token: string
  ) =>
    apiClient<ShippingProfile>(`/api/v1/catalog/shipping/${profileId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  remove: (profileId: string, token: string) =>
    apiClient<void>(`/api/v1/catalog/shipping/${profileId}`, {
      method: "DELETE",
      token,
    }),
};