// src/types/shipping.ts

export interface ShippingProfile {
  id: string;
  tenant_id: string;
  profile_name: string;
  description: string | null;
  free_shipping_threshold: string | null;
  is_active: boolean;
}

export interface ShippingProfileCreatePayload {
  tenant_id: string;
  profile_name: string;
  description?: string | null;
  free_shipping_threshold?: number | null;
  is_active?: boolean;
}

export interface ShippingZone {
  id: string;
  tenant_id: string;
  zone_name: string;
  zone_code: string;
  country: string;
  state: string;
  city: string;
  postal_code_pattern: string | null;
  is_active: boolean;
}

export interface ShippingZoneCreatePayload {
  tenant_id: string;
  zone_name: string;
  zone_code: string;
  country: string;
  state: string;
  city: string;
  postal_code_pattern?: string | null;
  is_active?: boolean;
}

export interface ShippingRate {
  id: string;
  shipping_profile_id: string;
  shipping_zone_id: string;
  minimum_weight: number;
  maximum_weight: number;
  shipping_charge: number;
}

export interface ShippingRateCreatePayload {
  shipping_profile_id: string;
  shipping_zone_id: string;
  minimum_weight: number;
  maximum_weight: number;
  shipping_charge: number;
}

export interface ShippingPartner {
  id: string;
  partner_code: string;
  partner_name: string;
  website_url: string | null;
  tracking_url_template: string | null;
  api_enabled: boolean;
  is_active: boolean;
}

export interface ShippingPartnerCreatePayload {
  partner_code: string;
  partner_name: string;
  website_url?: string | null;
  tracking_url_template?: string | null;
  api_enabled?: boolean;
  is_active?: boolean;
}

export interface Shipment {
  id: string;
  order_id: string;
  shipping_partner_id: string;
  shipment_number: string;
  tracking_number: string | null;
  tracking_url: string | null;
  shipment_status: string;
}

export interface ShipmentCreatePayload {
  order_id: string;
  shipping_partner_id: string;
  shipment_number: string;
  tracking_number?: string | null;
  tracking_url?: string | null;
  shipment_status?: string;
}

export interface ShippingException {
  id: string;
  shipment_id: string;
  exception_type: string;
  description: string;
  resolved: boolean;
}

// ---- Shiprocket (external courier integration) ----
export interface ShiprocketServiceabilityQuery {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number;
  cod: 0 | 1;
}

export interface ShiprocketOrderPayload {
  order_id: string;
  [key: string]: unknown;
}

export interface ShiprocketAwbPayload {
  shipment_id: string;
  courier_id?: string;
}

export interface ShiprocketPickupPayload {
  shipment_id: string[];
}