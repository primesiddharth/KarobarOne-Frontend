// ============================================
// PLAN TYPES
// ============================================

export interface Plan {
  id: string;
  planCode: string;
  planName: string;
  monthlyPrice: string | number;
  transactionCommissionPercent: string | number;
  isActive: boolean;
  createdAt: string;
  features?: Feature[];
}

// ============================================
// FEATURE TYPES
// ============================================

export interface Feature {
  id: string;
  planId: string;
  featureCode: string;
  featureName: string;
  featureValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddFeaturePayload {
  featureCode: string;
  featureName: string;
  featureValue: string;
}

export interface UpdateFeaturePayload {
  featureCode: string;
  featureName: string;
  featureValue: string;
}

// ============================================
// PLAN PAYLOADS
// ============================================

export interface CreatePlanPayload {
  planCode: string;
  planName: string;
  monthlyPrice: number;
  transactionCommissionPercent: number;
  isActive: boolean;
}

export interface UpdatePlanPayload {
  planName: string;
  monthlyPrice: number;
  transactionCommissionPercent: number;
  isActive: boolean;
}

// ============================================
// PLAN LIST
// ============================================

export interface PlansResponse {
  items: Plan[];
  total: number;
  skip: number;
  limit: number;
}

export interface PlansQueryParams {
  skip?: number;
  limit?: number;
  activeOnly?: boolean;
}

// ============================================
// PLAN HISTORY
// ============================================

export interface PlanHistory {
  id: string;
  tenantId: string;
  oldPlanId: string;
  newPlanId: string;
  changedBy: string;
  changeReason: string;
  changedAt: string;
  oldPlan: Plan;
  newPlan: Plan;
}

export interface PlanHistoryResponse {
  items: PlanHistory[];
  total: number;
  skip: number;
  limit: number;
}

export interface PlanHistoryQueryParams {
  tenantId: string;
  skip?: number;
  limit?: number;
}

// ============================================
// FEATURE LIST RESPONSE
// ============================================

export type PlanFeaturesResponse = Feature[];