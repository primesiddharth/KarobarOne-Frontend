// src/lib/api/billing.ts

import { apiClient } from "@/lib/api-client";
import type {
  BillingRule,
  CreateBillingRulePayload,
  UpdateBillingRulePayload,
} from "@/types/billing";

const BILLING_BASE = "/api/v1";

// ============================================
// BILLING RULES
// ============================================

export async function getBillingRules(
  planId: string,
  token?: string
): Promise<BillingRule[]> {
  return apiClient<BillingRule[]>(
    `${BILLING_BASE}/plans/${planId}/billing-rules`,
    {
      method: "GET",
      token,
    }
  );
}

export async function createBillingRule(
  planId: string,
  payload: CreateBillingRulePayload,
  token?: string
): Promise<BillingRule> {
  return apiClient<BillingRule>(
    `${BILLING_BASE}/plans/${planId}/billing-rules`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function getBillingRule(
  ruleId: string,
  token?: string
): Promise<BillingRule> {
  return apiClient<BillingRule>(
    `${BILLING_BASE}/billing-rules/${ruleId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function updateBillingRule(
  ruleId: string,
  payload: UpdateBillingRulePayload,
  token?: string
): Promise<BillingRule> {
  return apiClient<BillingRule>(
    `${BILLING_BASE}/billing-rules/${ruleId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteBillingRule(
  ruleId: string,
  token?: string
): Promise<void> {
  return apiClient<void>(
    `${BILLING_BASE}/billing-rules/${ruleId}`,
    {
      method: "DELETE",
      token,
    }
  );
}

// ============================================
// COMMISSION CALCULATION
// ============================================

export async function calculateCommission(
  tenantId: string,
  amount: number,
  token?: string
): Promise<string> {
  return apiClient<string>(
    `${BILLING_BASE}/tenants/${tenantId}/calculate-commission?amount=${encodeURIComponent(
      amount
    )}`,
    {
      method: "POST",
      token,
    }
  );
}