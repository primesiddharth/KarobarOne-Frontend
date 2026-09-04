"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";

import {
  addFeature,
  createPlan,
  deleteFeature,
  deletePlan,
  getPlanFeatures,
  getPlanHistory,
  getPlans,
  updateFeature,
  updatePlan,
} from "@/lib/api/plan";

import type {
  CreatePlanPayload,
  Feature,
  Plan,
  PlanHistory,
  UpdatePlanPayload,
} from "@/types/plan";

export default function PlansPage() {
  // ============================================================
  // AUTH
  // ============================================================

  const { token, isLoading: authLoading } = useAuth();

  // ============================================================
  // PLANS STATE
  // ============================================================

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // ============================================================
  // PLAN HISTORY STATE
  // ============================================================

  const [tenantId, setTenantId] = useState("");
  const [history, setHistory] = useState<PlanHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // ============================================================
  // PLAN FORM STATE
  // ============================================================

  const [form, setForm] = useState({
    planCode: "",
    planName: "",
    monthlyPrice: "",
    transactionCommissionPercent: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  // ============================================================
  // FEATURE STATE
  // ============================================================

  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const [features, setFeatures] = useState<Record<string, Feature[]>>({});
  const [featureLoading, setFeatureLoading] = useState<
    Record<string, boolean>
  >({});

  const [featureError, setFeatureError] = useState<
    Record<string, string>
  >({});

  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(
    null
  );

  const [featurePlanId, setFeaturePlanId] = useState<string | null>(null);

  const [featureForm, setFeatureForm] = useState({
    featureName: "",
    featureCode: "",
    featureValue: "",
  });

  const [featureSaving, setFeatureSaving] = useState(false);

  // ============================================================
  // LOAD PLANS
  // ============================================================

  const loadPlans = async () => {
    if (!token) {
      setPlans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getPlans(
        {
          skip: 0,
          limit: 100,
        },
        token
      );

      setPlans(response.items ?? []);
    } catch (err) {
      console.error("Failed to load plans:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load plans"
      );

      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setError("Please login to access Plans.");
      setLoading(false);
      return;
    }

    loadPlans();
  }, [token, authLoading]);

  // ============================================================
  // PLAN FORM
  // ============================================================

  const resetForm = () => {
    setForm({
      planCode: "",
      planName: "",
      monthlyPrice: "",
      transactionCommissionPercent: "",
      isActive: true,
    });

    setEditingPlan(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingPlan(null);

    setForm({
      planCode: "",
      planName: "",
      monthlyPrice: "",
      transactionCommissionPercent: "",
      isActive: true,
    });

    setError("");
    setShowForm(true);
  };

  const openEditForm = (plan: Plan) => {
    setEditingPlan(plan);

    setForm({
      planCode: plan.planCode,
      planName: plan.planName,
      monthlyPrice: String(plan.monthlyPrice),
      transactionCommissionPercent: String(
        plan.transactionCommissionPercent
      ),
      isActive: plan.isActive,
    });

    setError("");
    setShowForm(true);
  };

  const handleFormChange = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // CREATE / UPDATE PLAN
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Please login first.");
      return;
    }

    if (!form.planName.trim()) {
      setError("Plan name is required");
      return;
    }

    if (!form.planCode.trim() && !editingPlan) {
      setError("Plan code is required");
      return;
    }

    const monthlyPrice = Number(form.monthlyPrice);

    const commission = Number(
      form.transactionCommissionPercent
    );

    if (
      form.monthlyPrice.trim() === "" ||
      Number.isNaN(monthlyPrice)
    ) {
      setError("Enter a valid monthly price");
      return;
    }

    if (
      form.transactionCommissionPercent.trim() === "" ||
      Number.isNaN(commission)
    ) {
      setError("Enter a valid commission percentage");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingPlan) {
        const payload: UpdatePlanPayload = {
          planName: form.planName.trim(),
          monthlyPrice,
          transactionCommissionPercent: commission,
          isActive: form.isActive,
        };

        await updatePlan(
          editingPlan.id,
          payload,
          token
        );
      } else {
        const payload: CreatePlanPayload = {
          planCode: form.planCode.trim(),
          planName: form.planName.trim(),
          monthlyPrice,
          transactionCommissionPercent: commission,
          isActive: form.isActive,
        };

        await createPlan(payload, token);
      }

      resetForm();
      await loadPlans();
    } catch (err) {
      console.error("Failed to save plan:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save plan"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PLAN
  // ============================================================

  const handleDelete = async (plan: Plan) => {
    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${plan.planName}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deletePlan(plan.id, token);

      if (expandedPlanId === plan.id) {
        setExpandedPlanId(null);
      }

      await loadPlans();
    } catch (err) {
      console.error("Failed to delete plan:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete plan"
      );
    }
  };

  // ============================================================
  // LOAD FEATURES
  // ============================================================

  const loadFeatures = async (planId: string) => {
    if (!token) return;

    try {
      setFeatureLoading((prev) => ({
        ...prev,
        [planId]: true,
      }));

      setFeatureError((prev) => ({
        ...prev,
        [planId]: "",
      }));

      const response = await getPlanFeatures(
        planId,
        token
      );

      setFeatures((prev) => ({
        ...prev,
        [planId]: response ?? [],
      }));
    } catch (err) {
      console.error("Failed to load features:", err);

      setFeatureError((prev) => ({
        ...prev,
        [planId]:
          err instanceof Error
            ? err.message
            : "Failed to load features",
      }));

      setFeatures((prev) => ({
        ...prev,
        [planId]: [],
      }));
    } finally {
      setFeatureLoading((prev) => ({
        ...prev,
        [planId]: false,
      }));
    }
  };

  // ============================================================
  // EXPAND / COLLAPSE FEATURES
  // ============================================================

  const toggleFeatures = async (planId: string) => {
    if (expandedPlanId === planId) {
      setExpandedPlanId(null);
      return;
    }

    setExpandedPlanId(planId);

    await loadFeatures(planId);
  };

  // ============================================================
  // FEATURE FORM
  // ============================================================

  const resetFeatureForm = () => {
    setFeatureForm({
      featureName: "",
      featureCode: "",
      featureValue: "",
    });

    setEditingFeature(null);
    setFeaturePlanId(null);
    setShowFeatureForm(false);
  };

  const openCreateFeatureForm = (planId: string) => {
    setEditingFeature(null);

    setFeaturePlanId(planId);

    setFeatureForm({
      featureName: "",
      featureCode: "",
      featureValue: "",
    });

    setFeatureErrorForPlan(planId, "");

    setShowFeatureForm(true);
  };

  const openEditFeatureForm = (
    planId: string,
    feature: Feature
  ) => {
    setEditingFeature(feature);

    setFeaturePlanId(planId);

    setFeatureForm({
      featureName: feature.featureName ?? "",
      featureCode: feature.featureCode ?? "",
      featureValue:
        feature.featureValue !== undefined &&
        feature.featureValue !== null
          ? String(feature.featureValue)
          : "",
    });

    setFeatureErrorForPlan(planId, "");

    setShowFeatureForm(true);
  };

  const setFeatureErrorForPlan = (
    planId: string,
    message: string
  ) => {
    setFeatureError((prev) => ({
      ...prev,
      [planId]: message,
    }));
  };

  const handleFeatureFormChange = (
    field: keyof typeof featureForm,
    value: string
  ) => {
    setFeatureForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // CREATE / UPDATE FEATURE
  // ============================================================

  const handleFeatureSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!token) {
      setError("Please login first.");
      return;
    }

    if (!featurePlanId) {
      setError("Plan not selected.");
      return;
    }

    if (!featureForm.featureName.trim()) {
      setFeatureErrorForPlan(
        featurePlanId,
        "Feature name is required"
      );
      return;
    }

    if (!featureForm.featureCode.trim()) {
      setFeatureErrorForPlan(
        featurePlanId,
        "Feature code is required"
      );
      return;
    }

    if (!featureForm.featureValue.trim()) {
      setFeatureErrorForPlan(
        featurePlanId,
        "Feature value is required"
      );
      return;
    }

    try {
      setFeatureSaving(true);

      setFeatureErrorForPlan(featurePlanId, "");

      const payload = {
        featureName: featureForm.featureName.trim(),
        featureCode: featureForm.featureCode.trim(),
        featureValue: featureForm.featureValue.trim(),
      };

      if (editingFeature) {
        await updateFeature(
          editingFeature.id,
          payload,
          token
        );
      } else {
        await addFeature(
          featurePlanId,
          payload,
          token
        );
      }

      const currentPlanId = featurePlanId;

      resetFeatureForm();

      await loadFeatures(currentPlanId);
    } catch (err) {
      console.error("Failed to save feature:", err);

      setFeatureErrorForPlan(
        featurePlanId,
        err instanceof Error
          ? err.message
          : "Failed to save feature"
      );
    } finally {
      setFeatureSaving(false);
    }
  };

  // ============================================================
  // DELETE FEATURE
  // ============================================================

  const handleDeleteFeature = async (
    planId: string,
    feature: Feature
  ) => {
    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${feature.featureName}"?`
    );

    if (!confirmed) return;

    try {
      setFeatureErrorForPlan(planId, "");

      await deleteFeature(
        feature.id,
        token
      );

      await loadFeatures(planId);
    } catch (err) {
      console.error(
        "Failed to delete feature:",
        err
      );

      setFeatureErrorForPlan(
        planId,
        err instanceof Error
          ? err.message
          : "Failed to delete feature"
      );
    }
  };

  // ============================================================
  // PLAN HISTORY
  // ============================================================

  const loadHistory = async () => {
    if (!token) {
      setHistoryError("Please login first.");
      return;
    }

    if (!tenantId.trim()) {
      setHistoryError("Enter a tenant ID");
      return;
    }

    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await getPlanHistory(
        tenantId.trim(),
        {
          skip: 0,
          limit: 100,
        },
        token
      );

      setHistory(response.items ?? []);
    } catch (err) {
      console.error(
        "Failed to load plan history:",
        err
      );

      setHistoryError(
        err instanceof Error
          ? err.message
          : "Failed to load plan history"
      );

      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Plans & Billing
            </h1>

            <p className="mt-1 text-gray-500">
              Manage subscription plans, features and
              plan change history.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            disabled={!token}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Create Plan
          </button>
        </div>

        {/* ======================================================
            GLOBAL ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            CREATE / EDIT PLAN
        ====================================================== */}

        {showForm && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPlan
                    ? "Edit Plan"
                    : "Create Plan"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingPlan
                    ? "Update subscription plan details."
                    : "Create a new subscription plan."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              {/* PLAN CODE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Plan Code
                </label>

                <input
                  type="text"
                  value={form.planCode}
                  disabled={!!editingPlan}
                  onChange={(e) =>
                    handleFormChange(
                      "planCode",
                      e.target.value
                    )
                  }
                  placeholder="e.g. BASIC"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>

              {/* PLAN NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Plan Name
                </label>

                <input
                  type="text"
                  value={form.planName}
                  onChange={(e) =>
                    handleFormChange(
                      "planName",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Basic Plan"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              {/* MONTHLY PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Monthly Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.monthlyPrice}
                  onChange={(e) =>
                    handleFormChange(
                      "monthlyPrice",
                      e.target.value
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              {/* COMMISSION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Transaction Commission (%)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.transactionCommissionPercent
                  }
                  onChange={(e) =>
                    handleFormChange(
                      "transactionCommissionPercent",
                      e.target.value
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              {/* ACTIVE */}

              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    handleFormChange(
                      "isActive",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />

                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active plan
                </label>
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingPlan
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================
            PLANS
        ====================================================== */}

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Plans
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage subscription plans and their
                  feature flags.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {plans.length} Plans
              </span>
            </div>
          </div>

          {/* LOADING */}

          {authLoading || loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Loading plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-gray-700">
                No plans found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create your first subscription plan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">
                      Plan
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Code
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Monthly Price
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Commission
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Features
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {plans.map((plan) => {
                    const isExpanded =
                      expandedPlanId === plan.id;

                    const planFeatures =
                      features[plan.id] ?? [];

                    return (
                      <tbody key={plan.id}>
                        {/* PLAN ROW */}

                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {plan.planName}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {plan.planCode}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            ₹
                            {Number(
                              plan.monthlyPrice
                            ).toLocaleString()}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {Number(
                              plan.transactionCommissionPercent
                            )}
                            %
                          </td>

                          <td className="px-6 py-4">
                            {plan.isActive ? (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                Active
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                Inactive
                              </span>
                            )}
                          </td>

                          {/* FEATURES BUTTON */}

                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                toggleFeatures(plan.id)
                              }
                              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                            >
                              {isExpanded
                                ? "Hide Features"
                                : "View Features"}
                            </button>
                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  openEditForm(plan)
                                }
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(plan)
                                }
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* ==================================================
                            FEATURES EXPANDED ROW
                        ================================================== */}

                        {isExpanded && (
                          <tr className="border-b bg-gray-50">
                            <td
                              colSpan={7}
                              className="px-6 py-5"
                            >
                              <div className="rounded-xl border border-gray-200 bg-white">
                                {/* FEATURE HEADER */}

                                <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      Features
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                      Feature flags configured
                                      for {plan.planName}.
                                    </p>
                                  </div>

                                  <button
                                    onClick={() =>
                                      openCreateFeatureForm(
                                        plan.id
                                      )
                                    }
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                  >
                                    + Add Feature
                                  </button>
                                </div>

                                {/* FEATURE ERROR */}

                                {featureError[
                                  plan.id
                                ] && (
                                  <div className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {
                                      featureError[
                                        plan.id
                                      ]
                                    }
                                  </div>
                                )}

                                {/* FEATURE LOADING */}

                                {featureLoading[
                                  plan.id
                                ] ? (
                                  <div className="px-5 py-8 text-center text-sm text-gray-500">
                                    Loading features...
                                  </div>
                                ) : planFeatures.length ===
                                  0 ? (
                                  <div className="px-5 py-8 text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                      No features found
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                      Add the first feature
                                      flag to this plan.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="border-b bg-gray-50 text-left text-xs text-gray-500">
                                          <th className="px-5 py-3 font-medium">
                                            Feature Name
                                          </th>

                                          <th className="px-5 py-3 font-medium">
                                            Feature Code
                                          </th>

                                          <th className="px-5 py-3 font-medium">
                                            Feature Value
                                          </th>

                                          <th className="px-5 py-3 text-right font-medium">
                                            Actions
                                          </th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {planFeatures.map(
                                          (feature) => (
                                            <tr
                                              key={
                                                feature.id
                                              }
                                              className="border-b last:border-0 hover:bg-gray-50"
                                            >
                                              <td className="px-5 py-3 text-sm font-medium text-gray-900">
                                                {feature.featureName ??
                                                  "-"}
                                              </td>

                                              <td className="px-5 py-3 text-sm text-gray-600">
                                                {feature.featureCode ??
                                                  "-"}
                                              </td>

                                              <td className="px-5 py-3 text-sm text-gray-600">
                                                {feature.featureValue !==
                                                undefined
                                                  ? String(
                                                      feature.featureValue
                                                    )
                                                  : "-"}
                                              </td>

                                              <td className="px-5 py-3">
                                                <div className="flex justify-end gap-2">
                                                  <button
                                                    onClick={() =>
                                                      openEditFeatureForm(
                                                        plan.id,
                                                        feature
                                                      )
                                                    }
                                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                  >
                                                    Edit
                                                  </button>

                                                  <button
                                                    onClick={() =>
                                                      handleDeleteFeature(
                                                        plan.id,
                                                        feature
                                                      )
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                  >
                                                    Delete
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* FEATURE FORM */}

                        {isExpanded &&
                          showFeatureForm &&
                          featurePlanId === plan.id && (
                            <tr className="border-b bg-gray-50">
                              <td
                                colSpan={7}
                                className="px-6 pb-5"
                              >
                                <div className="rounded-xl border border-indigo-200 bg-white p-5">
                                  <div className="mb-5 flex items-center justify-between">
                                    <div>
                                      <h3 className="font-semibold text-gray-900">
                                        {editingFeature
                                          ? "Edit Feature"
                                          : "Add Feature"}
                                      </h3>

                                      <p className="mt-1 text-xs text-gray-500">
                                        Configure a feature
                                        flag for this plan.
                                      </p>
                                    </div>

                                    <button
                                      onClick={
                                        resetFeatureForm
                                      }
                                      className="text-sm font-medium text-gray-500 hover:text-gray-900"
                                    >
                                      Cancel
                                    </button>
                                  </div>

                                  <form
                                    onSubmit={
                                      handleFeatureSubmit
                                    }
                                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                                  >
                                    {/* FEATURE NAME */}

                                    <div>
                                      <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Feature Name
                                      </label>

                                      <input
                                        type="text"
                                        value={
                                          featureForm.featureName
                                        }
                                        onChange={(e) =>
                                          handleFeatureFormChange(
                                            "featureName",
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g. Inventory"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                                      />
                                    </div>

                                    {/* FEATURE CODE */}

                                    <div>
                                      <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Feature Code
                                      </label>

                                      <input
                                        type="text"
                                        value={
                                          featureForm.featureCode
                                        }
                                        onChange={(e) =>
                                          handleFeatureFormChange(
                                            "featureCode",
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g. INVENTORY"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                                      />
                                    </div>

                                    {/* FEATURE VALUE */}

                                    <div>
                                      <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Feature Value
                                      </label>

                                      <input
                                        type="text"
                                        value={
                                          featureForm.featureValue
                                        }
                                        onChange={(e) =>
                                          handleFeatureFormChange(
                                            "featureValue",
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g. true / 10 / unlimited"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                                      />
                                    </div>

                                    {/* BUTTONS */}

                                    <div className="flex justify-end gap-3 md:col-span-3">
                                      <button
                                        type="button"
                                        onClick={
                                          resetFeatureForm
                                        }
                                        className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>

                                      <button
                                        type="submit"
                                        disabled={
                                          featureSaving
                                        }
                                        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {featureSaving
                                          ? "Saving..."
                                          : editingFeature
                                          ? "Update Feature"
                                          : "Add Feature"}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ======================================================
            PLAN HISTORY
        ====================================================== */}

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Plan History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View subscription plan changes for a tenant.
            </p>
          </div>

          {/* TENANT SEARCH */}

          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={tenantId}
                onChange={(e) =>
                  setTenantId(e.target.value)
                }
                placeholder="Enter Tenant ID"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500"
              />

              <button
                onClick={loadHistory}
                disabled={
                  historyLoading || !token
                }
                className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {historyLoading
                  ? "Loading..."
                  : "View History"}
              </button>
            </div>

            {historyError && (
              <p className="mt-2 text-sm text-red-600">
                {historyError}
              </p>
            )}
          </div>

          {/* HISTORY TABLE */}

          {historyLoading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Enter a tenant ID to view plan history.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">
                      Old Plan
                    </th>

                    <th className="px-6 py-4 font-medium">
                      New Plan
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Reason
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Changed By
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Changed At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {item.oldPlan?.planName ??
                            "-"}
                        </div>

                        <div className="text-xs text-gray-500">
                          {item.oldPlan?.planCode ??
                            "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {item.newPlan?.planName ??
                            "-"}
                        </div>

                        <div className="text-xs text-gray-500">
                          {item.newPlan?.planCode ??
                            "-"}
                        </div>
                      </td>

                      <td className="max-w-[250px] px-6 py-4 text-sm text-gray-600">
                        {item.changeReason || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.changedBy}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          item.changedAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}