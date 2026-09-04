// src/types/service-engine.ts

export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | string;

export type ServiceType =
  | "PHYSICAL"
  | "ONLINE"
  | string;

export type BookingMode =
  | "BOOKING_ONLY"
  | "BOOKING_AND_PAYMENT"
  | string;

export interface ServiceCategory {
  tenantId: string;
  categoryName: string;
  categorySlug: string;
  categoryType?: string | null;
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategoryCreate {
  tenantId: string;
  categoryName: string;
  categorySlug: string;
  categoryType?: string | null;
}

export interface ServiceCategoryUpdate {
  categoryName?: string | null;
  categorySlug?: string | null;
  categoryType?: string | null;
  isActive?: boolean | null;
}

export interface Service {
  tenantId: string;
  categoryId: string;

  serviceName: string;
  serviceSlug: string;
  serviceType: string;

  description?: string | null;

  pricing: string;
  duration: number;

  media?: unknown | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
  metaSlug?: string | null;

  approvalStatus?: string | null;

  id: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreate {
  tenantId: string;
  categoryId: string;

  serviceName: string;
  serviceSlug: string;
  serviceType: string;

  description?: string | null;

  pricing: number | string;
  duration: number;

  media?: unknown | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
  metaSlug?: string | null;

  approvalStatus?: string | null;
}

export interface ServiceUpdate {
  categoryId?: string | null;

  serviceName?: string | null;
  serviceSlug?: string | null;
  serviceType?: string | null;

  description?: string | null;

  pricing?: number | string | null;
  duration?: number | null;

  media?: unknown | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
  metaSlug?: string | null;

  approvalStatus?: string | null;

  isActive?: boolean | null;
}

export interface BookingRule {
  tenantId: string;
  serviceId: string;

  bookingMode: string;
  requiresApproval?: boolean | null;

  id: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface BookingRuleCreate {
  tenantId: string;
  serviceId: string;

  bookingMode?: string;
  requiresApproval?: boolean | null;
}

export interface BookingValidationRequest {
  tenantId: string;
  serviceId: string;

  isPaid?: boolean | null;
  paymentReferenceId?: string | null;
}

export interface Availability {
  tenantId: string;
  serviceId: string;

  dayOfWeek: number;
  startTime: string;
  endTime: string;

  id: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityCreate {
  tenantId: string;
  serviceId: string;

  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface AvailabilityUpdate {
  dayOfWeek?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  isActive?: boolean | null;
}