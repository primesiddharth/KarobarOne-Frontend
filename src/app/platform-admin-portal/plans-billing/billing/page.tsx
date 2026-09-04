"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

import { getPlans } from "@/lib/api/plan";
import {
  createBillingRule,
  deleteBillingRule,
  getBillingRules,
  updateBillingRule,
} from "@/lib/api/billing";

import type { Plan } from "@/types/plan";
import type {
  BillingRule,
  CreateBillingRulePayload,
  UpdateBillingRulePayload,
} from "@/types/billing";

export default function BillingPage() {
  // ============================================
  // PLANS
  // ============================================

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [plansLoading, setPlansLoading] = useState(true);

  // ============================================
  // BILLING RULES
  // ============================================

  const [rules, setRules] = useState<BillingRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================================
  // FORM
  // ============================================

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<BillingRule | null>(
    null
  );

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    ruleType: "",
    ruleName: "",
    value: "",
    isActive: true,
  });

  // ============================================
  // LOAD PLANS
  // ============================================

  const loadPlans = async () => {
    try {
      setPlansLoading(true);
      setError("");

      const response = await getPlans({
        skip: 0,
        limit: 100,
      });

      const planItems = response.items ?? [];

      setPlans(planItems);

      if (planItems.length > 0 && !selectedPlanId) {
        setSelectedPlanId(planItems[0].id);
      }
    } catch (err) {
      console.error("Failed to load plans:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscription plans."
      );
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  // ============================================
  // LOAD BILLING RULES
  // ============================================

  const loadRules = async () => {
    if (!selectedPlanId) {
      setRules([]);
      return;
    }

    try {
      setRulesLoading(true);
      setError("");

      const response = await getBillingRules(selectedPlanId);

      setRules(response ?? []);
    } catch (err) {
      console.error("Failed to load billing rules:", err);

      setRules([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load billing rules."
      );
    } finally {
      setRulesLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, [selectedPlanId]);

  // ============================================
  // FORM HELPERS
  // ============================================

  const resetForm = () => {
    setForm({
      ruleType: "",
      ruleName: "",
      value: "",
      isActive: true,
    });

    setEditingRule(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingRule(null);

    setForm({
      ruleType: "",
      ruleName: "",
      value: "",
      isActive: true,
    });

    setShowForm(true);
    setError("");
  };

  const openEditForm = (rule: BillingRule) => {
    setEditingRule(rule);

    setForm({
      ruleType: rule.ruleType,
      ruleName: rule.ruleName,
      value: String(rule.value),
      isActive: rule.isActive,
    });

    setShowForm(true);
    setError("");
  };

  // ============================================
  // CREATE / UPDATE
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId) {
      setError("Please select a plan first.");
      return;
    }

    if (!form.ruleType.trim()) {
      setError("Rule type is required.");
      return;
    }

    if (!form.ruleName.trim()) {
      setError("Rule name is required.");
      return;
    }

    const numericValue = Number(form.value);

    if (form.value.trim() === "" || Number.isNaN(numericValue)) {
      setError("Please enter a valid rule value.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingRule) {
        const payload: UpdateBillingRulePayload = {
          ruleType: form.ruleType.trim(),
          ruleName: form.ruleName.trim(),
          value: numericValue,
          isActive: form.isActive,
        };

        await updateBillingRule(
          editingRule.id,
          payload
        );
      } else {
        const payload: CreateBillingRulePayload = {
          ruleType: form.ruleType.trim(),
          ruleName: form.ruleName.trim(),
          value: numericValue,
          isActive: form.isActive,
        };

        await createBillingRule(
          selectedPlanId,
          payload
        );
      }

      resetForm();
      await loadRules();
    } catch (err) {
      console.error("Failed to save billing rule:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save billing rule."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE
  // ============================================

  const handleDelete = async (rule: BillingRule) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${rule.ruleName}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteBillingRule(rule.id);

      await loadRules();
    } catch (err) {
      console.error("Failed to delete billing rule:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete billing rule."
      );
    }
  };

  // ============================================
  // SELECTED PLAN
  // ============================================

  const selectedPlan = plans.find(
    (plan) => plan.id === selectedPlanId
  );

  // ============================================
  // UI
  // ============================================

  return (
    <main className="min-h-screen bg-white px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              Plans & Billing
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Billing Rules
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-7 text-gray-500">
              Manage billing and commission rules for each subscription
              plan.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            disabled={!selectedPlanId}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Billing Rule
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="shrink-0 text-red-500 hover:text-red-700"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* PLAN SELECTOR */}

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Plan
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose a subscription plan to manage its billing rules.
            </p>
          </div>

          {plansLoading ? (
            <div className="text-sm text-gray-500">
              Loading plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-lg bg-gray-50 px-4 py-4 text-sm text-gray-500">
              No subscription plans found.
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <select
                value={selectedPlanId}
                onChange={(e) => {
                  setSelectedPlanId(e.target.value);
                  setShowForm(false);
                  setEditingRule(null);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:max-w-md"
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.planName} ({plan.planCode})
                  </option>
                ))}
              </select>

              {selectedPlan && (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium text-gray-700">
                    ₹
                    {Number(
                      selectedPlan.monthlyPrice
                    ).toLocaleString()}
                    /month
                  </span>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {Number(
                      selectedPlan.transactionCommissionPercent
                    )}
                    % commission
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingRule
                    ? "Edit Billing Rule"
                    : "Add Billing Rule"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedPlan?.planName}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              {/* RULE TYPE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Rule Type
                </label>

                <input
                  type="text"
                  value={form.ruleType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      ruleType: e.target.value,
                    }))
                  }
                  placeholder="e.g. commission"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* RULE NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Rule Name
                </label>

                <input
                  type="text"
                  value={form.ruleName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      ruleName: e.target.value,
                    }))
                  }
                  placeholder="e.g. Transaction Commission"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* VALUE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Value
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.value}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* STATUS */}

              <div className="flex items-center md:pt-7">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Active rule
                  </span>
                </label>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingRule
                    ? "Update Rule"
                    : "Create Rule"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* BILLING RULES */}

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Billing Rules
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedPlan
                  ? `Rules configured for ${selectedPlan.planName}.`
                  : "Select a plan to view its rules."}
              </p>
            </div>

            <button
              onClick={loadRules}
              disabled={rulesLoading || !selectedPlanId}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={rulesLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {rulesLoading ? (
            <div className="px-6 py-14 text-center text-sm text-gray-500">
              Loading billing rules...
            </div>
          ) : !selectedPlanId ? (
            <div className="px-6 py-14 text-center text-sm text-gray-500">
              Select a plan to view billing rules.
            </div>
          ) : rules.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <h3 className="font-medium text-gray-800">
                No billing rules found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add a billing rule for this plan to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">
                      Rule Type
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Rule Name
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Value
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rules.map((rule) => (
                    <tr
                      key={rule.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {rule.ruleType}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {rule.ruleName}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {Number(rule.value).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        {rule.isActive ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditForm(rule)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(rule)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}