"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { tenantApi } from "@/lib/api/tenant";

import {
  tenantPlanApi,
  TenantPlan,
} from "@/lib/api/tenant-plan";

interface Plan {
  id?: string;
  planCode?: string;
  planName?: string;
  monthlyPrice?: number | string;
  transactionCommissionPercent?: number | string;
  isActive?: boolean;
  createdAt?: string;
}

interface PlanMapping {
  id?: string;
  tenantId?: string;
  planId?: string;
  planStartDate?: string;
  planEndDate?: string;
  planUpdateAt?: string;
  autoRenew?: boolean;
  planChange?: boolean;
  changeReason?: string;
  statusId?: number;
  statusUpdateAt?: string;
  statusUpdateBy?: string;
  plan?: Plan;
}

interface Tenant {
  id: string;

  gstNumber?: string;
  panNumber?: string;
  documentMediaLink?: string;
  documentVerificationDone?: boolean;
  documentVerificationDoneBy?: string;
  documentVerificationDoneAt?: string;

  businessName?: string;
  legalName?: string;
  logoMediaId?: string;

  email?: string;
  mobile?: string;
  whatsappMobile?: string;
  ownerName?: string;

  businessAddressLine1?: string;
  businessAddressLine2?: string;
  locationLatitude?: number | string;
  locationLongitude?: number | string;
  landmark?: string;
  postOffice?: string;
  policeStation?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  businessType?: string;
  businessDescription?: string;
  employeeCount?: number;

  registeredAt?: string;
  statusId?: number;
  isActive?: boolean;

  planMapping?: PlanMapping;
  domains?: string[];

  createdAt?: string;
  updatedAt?: string;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSimpleDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function displayValue(
  value?: string | number | boolean | null
) {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <span className="break-words text-sm font-medium text-slate-800">
        {displayValue(value)}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export default function TenantDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { token, isLoading: authLoading } = useAuth();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tenantPlan, setTenantPlan] = useState<TenantPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planActionLoading, setPlanActionLoading] = useState(false);
  const [planMessage, setPlanMessage] = useState("");
  const [planError, setPlanError] = useState("");
const [tenantSettings, setTenantSettings] = useState<any>(null);
const [settingsLoading, setSettingsLoading] = useState(false);
const [settingsSaving, setSettingsSaving] = useState(false);
const [settingsMessage, setSettingsMessage] = useState("");
const [settingsError, setSettingsError] = useState("");

useEffect(() => {
  if (authLoading) return;

  if (!id) {
    setError("Tenant ID is missing.");
    setLoading(false);
    return;
  }

  if (!token) {
    setError("Please login to access the admin portal.");
    setLoading(false);
    return;
  }

  async function fetchTenant() {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient<Tenant>(
        `/api/v1/tenants/${id}`,
        {
          method: "GET",
          token,
        }
      );

      setTenant(response);
    } catch (err) {
      console.error("Failed to load tenant:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load tenant details.");
      }

      setTenant(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTenantPlan() {
    if (!token || !id) return;

    try {
      setPlanLoading(true);
      setPlanError("");

      const response = await tenantPlanApi.getCurrent(id, token);

      setTenantPlan(response);
    } catch (err) {
      console.error("Failed to load tenant plan:", err);

      setTenantPlan(null);

      if (err instanceof Error) {
        setPlanError(err.message);
      } else {
        setPlanError("Failed to load tenant plan.");
      }
    } finally {
      setPlanLoading(false);
    }
  }

  async function fetchTenantSettings() {
    if (!token || !id) return;

    try {
      setSettingsLoading(true);
      setSettingsError("");

      const response = await tenantApi.getSettings(id, token);

      setTenantSettings(response);
    } catch (err) {
      console.error("Failed to load tenant settings:", err);

      setTenantSettings(null);

      if (err instanceof Error) {
        setSettingsError(err.message);
      } else {
        setSettingsError("Failed to load tenant settings.");
      }
    } finally {
      setSettingsLoading(false);
    }
  }

  fetchTenantPlan();
  fetchTenantSettings();
  fetchTenant();
}, [id, token, authLoading]);


// Keep this OUTSIDE useEffect
async function handleSaveSettings() {
  if (!token || !id || !tenantSettings) return;

  try {
    setSettingsSaving(true);
    setSettingsMessage("");
    setSettingsError("");

    const updated = await tenantApi.updateSettings(
      id,
      {
        currency: tenantSettings.currency,
        timezone: tenantSettings.timezone,
        language: tenantSettings.language,
        invoicePrefix: tenantSettings.invoicePrefix,
        fiscalYearStart: tenantSettings.fiscalYearStart,
        taxRate: tenantSettings.taxRate,
        enableNotifications: tenantSettings.enableNotifications,
        enableAutoRenew: tenantSettings.enableAutoRenew,
      },
      token
    );

    setTenantSettings(updated);
    setSettingsMessage("Settings updated successfully.");
  } catch (err) {
    console.error("Failed to update tenant settings:", err);

    if (err instanceof Error) {
      setSettingsError(err.message);
    } else {
      setSettingsError("Failed to update tenant settings.");
    }
  } finally {
    setSettingsSaving(false);
  }
}

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-8 w-64 animate-pulse rounded bg-slate-200" />

          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />
            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => router.back()}
            className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Back
          </button>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!tenant) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Tenant not found
            </h2>

            <button
              onClick={() =>
                router.push(
                  "/platform-admin-portal/tenants"
                )
              }
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Tenants
            </button>
          </div>
        </div>
      </main>
    );
  }

  const plan = tenant.planMapping?.plan;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Platform Admin
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              {tenant.businessName || "Tenant Details"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Tenant ID: {tenant.id}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              ← Back
            </button>

            <button
              onClick={() =>
                router.push(
                  `/platform-admin-portal/tenants/${tenant.id}/edit`
                )
              }
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Edit Tenant
            </button>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${tenant.isActive
                    ? "bg-green-500"
                    : "bg-red-500"
                  }`}
              />

              <span className="font-semibold text-slate-900">
                {tenant.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Business Type
            </p>

            <p className="mt-3 font-semibold text-slate-900">
              {displayValue(tenant.businessType)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Current Plan
            </p>

            <p className="mt-3 font-semibold text-slate-900">
              {displayValue(plan?.planName)}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tenant Plan Management */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Plan Management
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage this tenant's subscription plan.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={planActionLoading || !tenantPlan}
                  onClick={async () => {
                    if (!token || !id) return;

                    try {
                      setPlanActionLoading(true);
                      setPlanMessage("");
                      setPlanError("");

                      const response = await tenantPlanApi.upgrade(
                        id,
                        token
                      );

                      setTenantPlan(response);
                      setPlanMessage("Tenant upgraded successfully.");
                    } catch (err) {
                      setPlanError(
                        err instanceof Error
                          ? err.message
                          : "Failed to upgrade tenant."
                      );
                    } finally {
                      setPlanActionLoading(false);
                    }
                  }}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {planActionLoading ? "Processing..." : "Upgrade"}
                </button>

                <button
                  type="button"
                  disabled={planActionLoading || !tenantPlan}
                  onClick={async () => {
                    if (!token || !id) return;

                    try {
                      setPlanActionLoading(true);
                      setPlanMessage("");
                      setPlanError("");

                      const response = await tenantPlanApi.downgrade(
                        id,
                        token
                      );

                      setTenantPlan(response);
                      setPlanMessage("Tenant downgraded successfully.");
                    } catch (err) {
                      setPlanError(
                        err instanceof Error
                          ? err.message
                          : "Failed to downgrade tenant."
                      );
                    } finally {
                      setPlanActionLoading(false);
                    }
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                >
                  {planActionLoading ? "Processing..." : "Downgrade"}
                </button>
              </div>
            </div>

            {planLoading ? (
              <div className="mt-6 text-sm text-slate-500">
                Loading plan...
              </div>
            ) : tenantPlan ? (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Plan</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tenantPlan.plan?.planName || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Monthly Price</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    ₹{tenantPlan.plan?.monthlyPrice ?? "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Start Date</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tenantPlan.planStartDate
                      ? new Date(tenantPlan.planStartDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">End Date</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tenantPlan.planEndDate
                      ? new Date(tenantPlan.planEndDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Commission</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tenantPlan.plan?.transactionCommissionPercent ?? "—"}%
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Auto Renew</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tenantPlan.autoRenew ? "Yes" : "No"}
                  </p>
                </div>

              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                No plan assigned to this tenant.
              </div>
            )}

            {planMessage && (
              <p className="mt-4 text-sm text-green-600">
                {planMessage}
              </p>
            )}

            {planError && (
              <p className="mt-4 text-sm text-red-600">
                {planError}
              </p>
            )}
          </section>

          {/* Tenant Settings */}
<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="mb-5">
    <h2 className="text-lg font-semibold">Tenant Settings</h2>
    <p className="text-sm text-gray-500">
      Manage tenant-level configuration.
    </p>
  </div>

  {settingsLoading ? (
    <p className="text-sm text-gray-500">Loading settings...</p>
  ) : settingsError ? (
    <p className="text-sm text-red-600">{settingsError}</p>
  ) : tenantSettings ? (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Currency */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Currency
          </label>
          <input
            type="text"
            value={tenantSettings.currency ?? ""}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                currency: e.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="INR"
          />
        </div>

        {/* Language */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Language
          </label>
          <input
            type="text"
            value={tenantSettings.language ?? ""}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                language: e.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="en"
          />
        </div>

        {/* Timezone */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Timezone
          </label>
          <input
            type="text"
            value={tenantSettings.timezone ?? ""}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                timezone: e.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Asia/Kolkata"
          />
        </div>

        {/* Invoice Prefix */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Invoice Prefix
          </label>
          <input
            type="text"
            value={tenantSettings.invoicePrefix ?? ""}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                invoicePrefix: e.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="INV"
          />
        </div>

        {/* Fiscal Year Start */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Fiscal Year Start
          </label>
          <input
            type="number"
            value={tenantSettings.fiscalYearStart ?? ""}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                fiscalYearStart: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Tax Rate */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Tax Rate
          </label>
          <input
            type="number"
            value={tenantSettings.taxRate ?? ""}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                taxRate: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 border-t pt-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(tenantSettings.enableNotifications)}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                enableNotifications: e.target.checked,
              })
            }
          />
          <span className="text-sm font-medium">
            Enable Notifications
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(tenantSettings.enableAutoRenew)}
            onChange={(e) =>
              setTenantSettings({
                ...tenantSettings,
                enableAutoRenew: e.target.checked,
              })
            }
          />
          <span className="text-sm font-medium">
            Enable Auto Renew
          </span>
        </label>
      </div>

      {/* Messages */}
      {settingsMessage && (
        <p className="text-sm text-green-600">
          {settingsMessage}
        </p>
      )}

      {settingsError && (
        <p className="text-sm text-red-600">
          {settingsError}
        </p>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={handleSaveSettings}
        disabled={settingsSaving}
        className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {settingsSaving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      Settings not available.
    </p>
  )}
</div>

          {/* Business */}
          <Section title="Business Information">
            <InfoRow
              label="Business Name"
              value={tenant.businessName}
            />

            <InfoRow
              label="Legal Name"
              value={tenant.legalName}
            />

            <InfoRow
              label="Business Type"
              value={tenant.businessType}
            />

            <InfoRow
              label="Employee Count"
              value={tenant.employeeCount}
            />

            <InfoRow
              label="Business Description"
              value={tenant.businessDescription}
            />

            <InfoRow
              label="Registered At"
              value={formatDate(tenant.registeredAt)}
            />
          </Section>

          {/* Contact */}
          <Section title="Contact Information">
            <InfoRow
              label="Owner Name"
              value={tenant.ownerName}
            />

            <InfoRow
              label="Email"
              value={tenant.email}
            />

            <InfoRow
              label="Mobile"
              value={tenant.mobile}
            />

            <InfoRow
              label="WhatsApp Mobile"
              value={tenant.whatsappMobile}
            />
          </Section>

          {/* Documents */}
          <Section title="Documents & Verification">
            <InfoRow
              label="GST Number"
              value={tenant.gstNumber}
            />

            <InfoRow
              label="PAN Number"
              value={tenant.panNumber}
            />

            <InfoRow
              label="Document Verification"
              value={tenant.documentVerificationDone}
            />

            <InfoRow
              label="Verified At"
              value={formatDate(
                tenant.documentVerificationDoneAt
              )}
            />

            <InfoRow
              label="Verified By"
              value={tenant.documentVerificationDoneBy}
            />

            <InfoRow
              label="Document Link"
              value={tenant.documentMediaLink}
            />
          </Section>

          {/* Address */}
          <Section title="Business Address">
            <InfoRow
              label="Address Line 1"
              value={tenant.businessAddressLine1}
            />

            <InfoRow
              label="Address Line 2"
              value={tenant.businessAddressLine2}
            />

            <InfoRow
              label="Landmark"
              value={tenant.landmark}
            />

            <InfoRow
              label="Post Office"
              value={tenant.postOffice}
            />

            <InfoRow
              label="Police Station"
              value={tenant.policeStation}
            />

            <InfoRow
              label="City"
              value={tenant.city}
            />

            <InfoRow
              label="State"
              value={tenant.state}
            />

            <InfoRow
              label="Country"
              value={tenant.country}
            />

            <InfoRow
              label="Postal Code"
              value={tenant.postalCode}
            />

            <InfoRow
              label="Latitude"
              value={tenant.locationLatitude}
            />

            <InfoRow
              label="Longitude"
              value={tenant.locationLongitude}
            />
          </Section>

          {/* Plan */}
          <Section title="Subscription / Plan">
            <InfoRow
              label="Plan Name"
              value={plan?.planName}
            />

            <InfoRow
              label="Plan Code"
              value={plan?.planCode}
            />

            <InfoRow
              label="Monthly Price"
              value={plan?.monthlyPrice}
            />

            <InfoRow
              label="Transaction Commission"
              value={
                plan?.transactionCommissionPercent !==
                  undefined
                  ? `${plan.transactionCommissionPercent}%`
                  : "—"
              }
            />

            <InfoRow
              label="Plan Start Date"
              value={formatSimpleDate(
                tenant.planMapping?.planStartDate
              )}
            />

            <InfoRow
              label="Plan End Date"
              value={formatSimpleDate(
                tenant.planMapping?.planEndDate
              )}
            />

            <InfoRow
              label="Auto Renew"
              value={tenant.planMapping?.autoRenew}
            />

            <InfoRow
              label="Plan Change"
              value={tenant.planMapping?.planChange}
            />

            <InfoRow
              label="Change Reason"
              value={tenant.planMapping?.changeReason}
            />

            <InfoRow
              label="Plan Status ID"
              value={tenant.planMapping?.statusId}
            />
          </Section>

          {/* Domains */}
          <Section title="Domains">
            <InfoRow
              label="Domains"
              value={
                tenant.domains &&
                  tenant.domains.length > 0
                  ? tenant.domains.join(", ")
                  : "No domains registered"
              }
            />
          </Section>

          {/* System */}
          <Section title="System Information">
            <InfoRow
              label="Tenant ID"
              value={tenant.id}
            />

            <InfoRow
              label="Status ID"
              value={tenant.statusId}
            />

            <InfoRow
              label="Created At"
              value={formatDate(tenant.createdAt)}
            />

            <InfoRow
              label="Updated At"
              value={formatDate(tenant.updatedAt)}
            />

            <InfoRow
              label="Logo Media ID"
              value={tenant.logoMediaId}
            />

            <InfoRow
              label="Plan Mapping ID"
              value={tenant.planMapping?.id}
            />
          </Section>

        </div>
      </div>
    </main>
  );
}