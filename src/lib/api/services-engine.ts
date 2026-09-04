// src/lib/api/services-engine.ts

import { apiClient } from "@/lib/api-client";

import type {
  Availability,
  AvailabilityCreate,
  AvailabilityUpdate,
  BookingRule,
  BookingRuleCreate,
  BookingValidationRequest,
  Service,
  ServiceCategory,
  ServiceCategoryCreate,
  ServiceCategoryUpdate,
  ServiceCreate,
  ServiceUpdate,
} from "@/types/services-engine";

/* =========================================================
   CATEGORIES
========================================================= */

export async function getCategories(
  tenantId: string,
  token?: string
): Promise<ServiceCategory[]> {
  return apiClient<ServiceCategory[]>(
    `/api/v1/service-engine/categories?tenantId=${encodeURIComponent(
      tenantId
    )}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function getCategory(
  categoryId: string,
  token?: string
): Promise<ServiceCategory> {
  return apiClient<ServiceCategory>(
    `/api/v1/service-engine/categories/${categoryId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function createCategory(
  payload: ServiceCategoryCreate,
  token?: string
): Promise<ServiceCategory> {
  return apiClient<ServiceCategory>(
    `/api/v1/service-engine/categories`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function updateCategory(
  categoryId: string,
  payload: ServiceCategoryUpdate,
  token?: string
): Promise<ServiceCategory> {
  return apiClient<ServiceCategory>(
    `/api/v1/service-engine/categories/${categoryId}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteCategory(
  categoryId: string,
  token?: string
): Promise<unknown> {
  return apiClient(
    `/api/v1/service-engine/categories/${categoryId}`,
    {
      method: "DELETE",
      token,
    }
  );
}

/* =========================================================
   SERVICES
========================================================= */

export async function getServices(
  tenantId: string,
  token?: string
): Promise<Service[]> {
  return apiClient<Service[]>(
    `/api/v1/service-engine/services?tenantId=${encodeURIComponent(
      tenantId
    )}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function getService(
  serviceId: string,
  token?: string
): Promise<Service> {
  return apiClient<Service>(
    `/api/v1/service-engine/services/${serviceId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function createService(
  payload: ServiceCreate,
  token?: string
): Promise<Service> {
  return apiClient<Service>(
    `/api/v1/service-engine/services`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function updateService(
  serviceId: string,
  payload: ServiceUpdate,
  token?: string
): Promise<Service> {
  return apiClient<Service>(
    `/api/v1/service-engine/services/${serviceId}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteService(
  serviceId: string,
  token?: string
): Promise<unknown> {
  return apiClient(
    `/api/v1/service-engine/services/${serviceId}`,
    {
      method: "DELETE",
      token,
    }
  );
}

export async function submitServiceApproval(
  serviceId: string,
  token?: string
): Promise<Service> {
  return apiClient<Service>(
    `/api/v1/service-engine/services/${serviceId}/submit-approval`,
    {
      method: "POST",
      token,
    }
  );
}

/* =========================================================
   BOOKING RULES
========================================================= */

export async function createBookingRule(
  payload: BookingRuleCreate,
  token?: string
): Promise<BookingRule> {
  return apiClient<BookingRule>(
    `/api/v1/service-engine/booking-rules`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function getBookingRule(
  serviceId: string,
  token?: string
): Promise<BookingRule> {
  return apiClient<BookingRule>(
    `/api/v1/service-engine/booking-rules/service/${serviceId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function validateBooking(
  payload: BookingValidationRequest,
  token?: string
): Promise<unknown> {
  return apiClient(
    `/api/v1/service-engine/booking-rules/validate-booking`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
}

/* =========================================================
   AVAILABILITIES
========================================================= */

export async function createAvailability(
  payload: AvailabilityCreate,
  token?: string
): Promise<Availability> {
  return apiClient<Availability>(
    `/api/v1/service-engine/availabilities`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function getAvailabilities(
  serviceId: string,
  token?: string
): Promise<Availability[]> {
  return apiClient<Availability[]>(
    `/api/v1/service-engine/availabilities/service/${serviceId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function updateAvailability(
  availabilityId: string,
  payload: AvailabilityUpdate,
  token?: string
): Promise<Availability> {
  return apiClient<Availability>(
    `/api/v1/service-engine/availabilities/${availabilityId}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteAvailability(
  availabilityId: string,
  token?: string
): Promise<unknown> {
  return apiClient(
    `/api/v1/service-engine/availabilities/${availabilityId}`,
    {
      method: "DELETE",
      token,
    }
  );
}