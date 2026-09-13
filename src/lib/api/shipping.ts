// src/lib/api/shipping.ts

import { apiClient } from "../api-client";
import {
  ShippingProfile,
  ShippingProfileCreatePayload,
  ShippingZone,
  ShippingZoneCreatePayload,
  ShippingRate,
  ShippingRateCreatePayload,
  ShippingPartner,
  ShippingPartnerCreatePayload,
  Shipment,
  ShipmentCreatePayload,
  ShippingException,
  ShiprocketServiceabilityQuery,
  ShiprocketOrderPayload,
  ShiprocketAwbPayload,
  ShiprocketPickupPayload,
} from "@/types/shipping";

function toQueryString<T extends object>(params: T): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  return entries.length
    ? `?${entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&")}`
    : "";
}

// ---- Shipping Profiles ----
export const shippingProfileApi = {
  create: (data: ShippingProfileCreatePayload, token: string) =>
    apiClient<ShippingProfile>("/api/v1/github/shipping-profiles/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) =>
    apiClient<ShippingProfile[]>("/api/v1/github/shipping-profiles/", { token }),
  update: (id: string, data: Partial<ShippingProfileCreatePayload>, token: string) =>
    apiClient<ShippingProfile>(`/api/v1/github/shipping-profiles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (id: string, token: string) =>
    apiClient<void>(`/api/v1/github/shipping-profiles/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Shipping Zones ----
export const shippingZoneApi = {
  create: (data: ShippingZoneCreatePayload, token: string) =>
    apiClient<ShippingZone>("/api/v1/github/shipping-zones/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) =>
    apiClient<ShippingZone[]>("/api/v1/github/shipping-zones/", { token }),
  update: (id: string, data: Partial<ShippingZoneCreatePayload>, token: string) =>
    apiClient<ShippingZone>(`/api/v1/github/shipping-zones/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (id: string, token: string) =>
    apiClient<void>(`/api/v1/github/shipping-zones/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Shipping Rates ----
export const shippingRateApi = {
  create: (data: ShippingRateCreatePayload, token: string) =>
    apiClient<ShippingRate>("/api/v1/github/shipping-rates/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByProfile: (profileId: string, token: string) =>
    apiClient<ShippingRate[]>(
      `/api/v1/github/shipping-rates/profile/${profileId}`,
      { token }
    ),
  update: (id: string, data: Partial<ShippingRateCreatePayload>, token: string) =>
    apiClient<ShippingRate>(`/api/v1/github/shipping-rates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (id: string, token: string) =>
    apiClient<void>(`/api/v1/github/shipping-rates/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Shipping Partners ----
export const shippingPartnerApi = {
  create: (data: ShippingPartnerCreatePayload, token: string) =>
    apiClient<ShippingPartner>("/api/v1/github/shipping-partners/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) =>
    apiClient<ShippingPartner[]>("/api/v1/github/shipping-partners/", {
      token,
    }),
  update: (id: string, data: Partial<ShippingPartnerCreatePayload>, token: string) =>
    apiClient<ShippingPartner>(`/api/v1/github/shipping-partners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (id: string, token: string) =>
    apiClient<void>(`/api/v1/github/shipping-partners/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Shipments ----
export const shipmentApi = {
  create: (data: ShipmentCreatePayload, token: string) =>
    apiClient<Shipment>("/api/v1/github/shipments/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByOrder: (orderId: string, token: string) =>
    apiClient<Shipment[]>(`/api/v1/github/shipments/order/${orderId}`, {
      token,
    }),
  update: (id: string, data: Partial<ShipmentCreatePayload>, token: string) =>
    apiClient<Shipment>(`/api/v1/github/shipments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (id: string, token: string) =>
    apiClient<void>(`/api/v1/github/shipments/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Shipping Exceptions (NDR-type issues) ----
export const shippingExceptionApi = {
  listByShipment: (shipmentId: string, token: string) =>
    apiClient<ShippingException[]>(
      `/api/v1/github/shipping-exceptions/shipment/${shipmentId}`,
      { token }
    ),
  resolve: (id: string, token: string) =>
    apiClient<ShippingException>(`/api/v1/github/shipping-exceptions/${id}/resolve`, {
      method: "PATCH",
      token,
    }),
};

// ---- Shiprocket (external courier integration) ----
export const shiprocketApi = {
  checkServiceability: (query: ShiprocketServiceabilityQuery, token: string) =>
    apiClient<unknown>(
      `/api/v1/github/shiprocket/serviceability${toQueryString(query)}`,
      { token }
    ),
  createOrder: (data: ShiprocketOrderPayload, token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/order", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  generateAwb: (data: ShiprocketAwbPayload, token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/awb", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  schedulePickup: (data: ShiprocketPickupPayload, token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/pickup", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  cancel: (shipmentIds: string[], token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/cancel", {
      method: "POST",
      body: JSON.stringify({ ids: shipmentIds }),
      token,
    }),
  track: (awbCode: string, token: string) =>
    apiClient<unknown>(`/api/v1/github/shiprocket/track/${awbCode}`, { token }),
  getCourierCompanies: (token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/courier-companies", { token }),
  getManifest: (shipmentIds: string[], token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/manifest", {
      method: "POST",
      body: JSON.stringify({ shipment_id: shipmentIds }),
      token,
    }),
  getLabel: (shipmentIds: string[], token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/label", {
      method: "POST",
      body: JSON.stringify({ shipment_id: shipmentIds }),
      token,
    }),
  getInvoice: (orderIds: string[], token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/invoice", {
      method: "POST",
      body: JSON.stringify({ ids: orderIds }),
      token,
    }),
  getPickupLocations: (token: string) =>
    apiClient<unknown>("/api/v1/github/shiprocket/pickup-locations", { token }),
};