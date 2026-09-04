import { apiClient } from "@/lib/api-client";

import type {
  AddFeaturePayload,
  CreatePlanPayload,
  Feature,
  Plan,
  PlanFeaturesResponse,
  PlanHistoryResponse,
  PlansQueryParams,
  PlansResponse,
  UpdateFeaturePayload,
  UpdatePlanPayload,
} from "@/types/plan";

// ============================================
// PLANS
// ============================================

/**
 * GET /api/v1/plans
 * List subscription plans
 */
export async function getPlans(
  params?: PlansQueryParams,
  token?: string
): Promise<PlansResponse> {
  const searchParams = new URLSearchParams();

  if (params?.skip !== undefined) {
    searchParams.set("skip", String(params.skip));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.activeOnly !== undefined) {
    searchParams.set("activeOnly", String(params.activeOnly));
  }

  const query = searchParams.toString();

  return apiClient<PlansResponse>(
    `/api/v1/plans${query ? `?${query}` : ""}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * GET /api/v1/plans/{planId}
 * Get plan details
 */
export async function getPlan(
  planId: string,
  token?: string
): Promise<Plan> {
  return apiClient<Plan>(`/api/v1/plans/${planId}`, {
    method: "GET",
    token,
  });
}

/**
 * POST /api/v1/plans
 * Create subscription plan
 */
export async function createPlan(
  data: CreatePlanPayload,
  token?: string
): Promise<Plan> {
  return apiClient<Plan>("/api/v1/plans", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

/**
 * PATCH /api/v1/plans/{planId}
 * Update subscription plan
 */
export async function updatePlan(
  planId: string,
  data: UpdatePlanPayload,
  token?: string
): Promise<Plan> {
  return apiClient<Plan>(`/api/v1/plans/${planId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /api/v1/plans/{planId}
 * Delete subscription plan
 */
export async function deletePlan(
  planId: string,
  token?: string
): Promise<{ detail: string }> {
  return apiClient<{ detail: string }>(
    `/api/v1/plans/${planId}`,
    {
      method: "DELETE",
      token,
    }
  );
}

// ============================================
// PLAN FEATURES
// ============================================

/**
 * POST /api/v1/plans/{planId}/features
 * Add a feature to a plan
 */
export async function addFeature(
  planId: string,
  data: AddFeaturePayload,
  token?: string
): Promise<Feature> {
  return apiClient<Feature>(
    `/api/v1/plans/${planId}/features`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * GET /api/v1/plans/{planId}/features
 * List features for a plan
 */
export async function getPlanFeatures(
  planId: string,
  token?: string
): Promise<PlanFeaturesResponse> {
  return apiClient<PlanFeaturesResponse>(
    `/api/v1/plans/${planId}/features`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * PATCH /api/v1/features/{featureId}
 * Update a feature
 */
export async function updateFeature(
  featureId: string,
  data: UpdateFeaturePayload,
  token?: string
): Promise<Feature> {
  return apiClient<Feature>(
    `/api/v1/features/${featureId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * DELETE /api/v1/features/{featureId}
 * Remove a feature
 */
export async function deleteFeature(
  featureId: string,
  token?: string
): Promise<{ detail: string } | void> {
  return apiClient<{ detail: string } | void>(
    `/api/v1/features/${featureId}`,
    {
      method: "DELETE",
      token,
    }
  );
}

// ============================================
// PLAN HISTORY
// ============================================

/**
 * GET /api/v1/tenants/{tenantId}/plan-history
 * Get plan change history for a tenant
 */
export async function getPlanHistory(
  tenantId: string,
  params?: {
    skip?: number;
    limit?: number;
  },
  token?: string
): Promise<PlanHistoryResponse> {
  const searchParams = new URLSearchParams();

  if (params?.skip !== undefined) {
    searchParams.set("skip", String(params.skip));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return apiClient<PlanHistoryResponse>(
    `/api/v1/tenants/${tenantId}/plan-history${
      query ? `?${query}` : ""
    }`,
    {
      method: "GET",
      token,
    }
  );
}