// src/types/billing.ts

export interface BillingRule {
  id: string;
  planId: string;
  ruleType: string;
  ruleName: string;
  value: string | number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillingRulePayload {
  ruleType: string;
  ruleName: string;
  value: number;
  isActive: boolean;
}

export interface UpdateBillingRulePayload {
  ruleType?: string;
  ruleName?: string;
  value?: number;
  isActive?: boolean;
}