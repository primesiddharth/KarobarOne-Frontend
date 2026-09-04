// src/lib/api/tenant-plan.ts

import { apiClient } from "../api-client";

export interface TenantPlanAssignPayload {
  planId: string;
  planStartDate: string;
  planEndDate: string;
  autoRenew: boolean;
}

export interface TenantPlanUpdatePayload {
  planId: string;
  planEndDate: string;
  autoRenew: boolean;
  changeReason: string;
}

export interface TenantPlan {
  id: string;
  tenantId: string;
  planId: string;
  planStartDate: string;
  planEndDate: string;
  planUpdateAt: string;
  autoRenew: boolean;
  planChange: boolean;
  changeReason: string;
  statusId: number;
  statusUpdateAt: string;
  statusUpdatedBy: string;
  plan: {
    id: string;
    planCode: string;
    planName: string;
    monthlyPrice: number;
    transactionCommissionPercent: number;
    isActive: boolean;
    createdAt: string;
  };
}

export const tenantPlanApi = {
  // POST /api/v1/tenants/{tenantId}/plan
  assign: (
    tenantId: string,
    data: TenantPlanAssignPayload,
    token: string
  ) =>
    apiClient<TenantPlan>(
      `/api/v1/tenants/${tenantId}/plan`,
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }
    ),

  // GET /api/v1/tenants/{tenantId}/plan
  getCurrent: (
    tenantId: string,
    token: string
  ) =>
    apiClient<TenantPlan>(
      `/api/v1/tenants/${tenantId}/plan`,
      {
        method: "GET",
        token,
      }
    ),

  // PATCH /api/v1/tenants/{tenantId}/plan
  update: (
    tenantId: string,
    data: TenantPlanUpdatePayload,
    token: string
  ) =>
    apiClient<TenantPlan>(
      `/api/v1/tenants/${tenantId}/plan`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }
    ),

  // POST /api/v1/tenants/{tenantId}/upgrade
  upgrade: (
    tenantId: string,
    token: string
  ) =>
    apiClient<TenantPlan>(
      `/api/v1/tenants/${tenantId}/upgrade`,
      {
        method: "POST",
        token,
      }
    ),

  // POST /api/v1/tenants/{tenantId}/downgrade
  downgrade: (
    tenantId: string,
    token: string
  ) =>
    apiClient<TenantPlan>(
      `/api/v1/tenants/${tenantId}/downgrade`,
      {
        method: "POST",
        token,
      }
    ),
};