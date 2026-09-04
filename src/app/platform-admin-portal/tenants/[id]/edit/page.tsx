"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";

import { tenantApi } from "@/lib/api/tenant";
import type {
  Tenant,
  TenantUpdatePayload,
} from "@/types/tenant";


export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();

  const tenantId = params.id as string;


  /* =========================
     STATE
  ========================= */

  const [tenant, setTenant] = useState<Tenant | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const [form, setForm] = useState<TenantUpdatePayload>({});


  /* =========================
     TOKEN
  ========================= */

  const getToken = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };


  /* =========================
     LOAD TENANT
  ========================= */

  useEffect(() => {
    const loadTenant = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await tenantApi.getById(
          tenantId,
          token
        );

        setTenant(response);

        setForm({
          gstNumber: response.gstNumber || "",
          documentMediaLink:
            response.documentMediaLink || "",

          documentVerificationDone:
            response.documentVerificationDone,

          documentVerificationDoneBy:
            response.documentVerificationDoneBy || "",

          businessName:
            response.businessName || "",

          legalName:
            response.legalName || "",

          logoMediaId:
            response.logoMediaId || "",

          email:
            response.email || "",

          mobile:
            response.mobile || "",

          whatsappMobile:
            response.whatsappMobile || "",

          ownerName:
            response.ownerName || "",

          businessAddressLine1:
            response.businessAddressLine1 || "",

          businessAddressLine2:
            response.businessAddressLine2 || "",

          locationLatitude:
            typeof response.locationLatitude === "string"
              ? Number(response.locationLatitude)
              : response.locationLatitude,

          locationLongitude:
            typeof response.locationLongitude === "string"
              ? Number(response.locationLongitude)
              : response.locationLongitude,

          landmark:
            response.landmark || "",

          postOffice:
            response.postOffice || "",

          policeStation:
            response.policeStation || "",

          city:
            response.city || "",

          state:
            response.state || "",

          country:
            response.country || "",

          postalCode:
            response.postalCode || "",

          businessType:
            response.businessType || "",

          businessDescription:
            response.businessDescription || "",

          employeeCount:
            response.employeeCount ?? undefined,

          statusId:
            response.statusId,

          isActive:
            response.isActive,
        });

      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load tenant."
        );
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      loadTenant();
    }
  }, [tenantId]);


  /* =========================
     INPUT HANDLER
  ========================= */

  const updateField = (
    field: keyof TenantUpdatePayload,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* =========================
     SAVE
  ========================= */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }


      /* Remove empty optional numeric values */

      const payload: TenantUpdatePayload = {
        ...form,
      };

      if (
        payload.locationLatitude === undefined ||
        Number.isNaN(payload.locationLatitude)
      ) {
        delete payload.locationLatitude;
      }

      if (
        payload.locationLongitude === undefined ||
        Number.isNaN(payload.locationLongitude)
      ) {
        delete payload.locationLongitude;
      }

      if (
        payload.employeeCount === undefined ||
        Number.isNaN(payload.employeeCount)
      ) {
        delete payload.employeeCount;
      }

      if (
        payload.statusId === undefined ||
        Number.isNaN(payload.statusId)
      ) {
        delete payload.statusId;
      }


      await tenantApi.update(
        tenantId,
        payload,
        token
      );

      setSuccess(
        "Tenant updated successfully."
      );

      setTimeout(() => {
        router.push(
          `/platform-admin-portal/tenants/${tenantId}`
        );
      }, 800);

    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update tenant."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error && !tenant) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    );
  }


  /* =========================
     PAGE
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}

      <div className="mx-auto max-w-6xl">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border bg-white p-2 hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Tenant
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Update tenant business information
              </p>
            </div>

          </div>

        </div>


        {/* Alerts */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}


        {/* Form */}

        <form onSubmit={handleSubmit}>

          <div className="space-y-6">


            {/* =========================
                BUSINESS INFORMATION
            ========================= */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Business Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Field
                  label="Business Name"
                  value={form.businessName ?? ""}
                  onChange={(value) =>
                    updateField("businessName", value)
                  }
                />

                <Field
                  label="Legal Name"
                  value={form.legalName ?? ""}
                  onChange={(value) =>
                    updateField("legalName", value)
                  }
                />

                <Field
                  label="GST Number"
                  value={form.gstNumber ?? ""}
                  onChange={(value) =>
                    updateField("gstNumber", value)
                  }
                />

                <Field
                  label="Business Type"
                  value={form.businessType ?? ""}
                  onChange={(value) =>
                    updateField("businessType", value)
                  }
                />

                <Field
                  label="Owner Name"
                  value={form.ownerName ?? ""}
                  onChange={(value) =>
                    updateField("ownerName", value)
                  }
                />

                <Field
                  label="Employee Count"
                  type="number"
                  value={form.employeeCount ?? ""}
                  onChange={(value) =>
                    updateField(
                      "employeeCount",
                      value === ""
                        ? undefined as never
                        : Number(value)
                    )
                  }
                />

              </div>

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Business Description
                </label>

                <textarea
                  rows={4}
                  value={form.businessDescription ?? ""}
                  onChange={(e) =>
                    updateField(
                      "businessDescription",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </section>


            {/* =========================
                CONTACT
            ========================= */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Field
                  label="Email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                />

                <Field
                  label="Mobile"
                  value={form.mobile ?? ""}
                  onChange={(value) =>
                    updateField("mobile", value)
                  }
                />

                <Field
                  label="WhatsApp Mobile"
                  value={form.whatsappMobile ?? ""}
                  onChange={(value) =>
                    updateField("whatsappMobile", value)
                  }
                />

                <Field
                  label="Logo Media ID"
                  value={form.logoMediaId ?? ""}
                  onChange={(value) =>
                    updateField("logoMediaId", value)
                  }
                />

                <Field
                  label="Document Media Link"
                  value={form.documentMediaLink ?? ""}
                  onChange={(value) =>
                    updateField("documentMediaLink", value)
                  }
                />

              </div>

            </section>


            {/* =========================
                ADDRESS
            ========================= */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Business Address
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Field
                  label="Address Line 1"
                  value={
                    form.businessAddressLine1 ?? ""
                  }
                  onChange={(value) =>
                    updateField(
                      "businessAddressLine1",
                      value
                    )
                  }
                />

                <Field
                  label="Address Line 2"
                  value={
                    form.businessAddressLine2 ?? ""
                  }
                  onChange={(value) =>
                    updateField(
                      "businessAddressLine2",
                      value
                    )
                  }
                />

                <Field
                  label="City"
                  value={form.city ?? ""}
                  onChange={(value) =>
                    updateField("city", value)
                  }
                />

                <Field
                  label="State"
                  value={form.state ?? ""}
                  onChange={(value) =>
                    updateField("state", value)
                  }
                />

                <Field
                  label="Country"
                  value={form.country ?? ""}
                  onChange={(value) =>
                    updateField("country", value)
                  }
                />

                <Field
                  label="Postal Code"
                  value={form.postalCode ?? ""}
                  onChange={(value) =>
                    updateField("postalCode", value)
                  }
                />

                <Field
                  label="Landmark"
                  value={form.landmark ?? ""}
                  onChange={(value) =>
                    updateField("landmark", value)
                  }
                />

                <Field
                  label="Post Office"
                  value={form.postOffice ?? ""}
                  onChange={(value) =>
                    updateField("postOffice", value)
                  }
                />

                <Field
                  label="Police Station"
                  value={form.policeStation ?? ""}
                  onChange={(value) =>
                    updateField("policeStation", value)
                  }
                />

                <Field
                  label="Latitude"
                  type="number"
                  step="any"
                  value={form.locationLatitude ?? ""}
                  onChange={(value) =>
                    updateField(
                      "locationLatitude",
                      value === ""
                        ? undefined as never
                        : Number(value)
                    )
                  }
                />

                <Field
                  label="Longitude"
                  type="number"
                  step="any"
                  value={form.locationLongitude ?? ""}
                  onChange={(value) =>
                    updateField(
                      "locationLongitude",
                      value === ""
                        ? undefined as never
                        : Number(value)
                    )
                  }
                />

              </div>

            </section>


            {/* =========================
                STATUS
            ========================= */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Tenant Status
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Field
                  label="Status ID"
                  type="number"
                  value={form.statusId ?? ""}
                  onChange={(value) =>
                    updateField(
                      "statusId",
                      value === ""
                        ? undefined as never
                        : Number(value)
                    )
                  }
                />

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Active
                  </label>

                  <label className="flex h-10 cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      checked={form.isActive ?? false}
                      onChange={(e) =>
                        updateField(
                          "isActive",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />

                    <span className="text-sm text-gray-700">
                      Tenant is active
                    </span>

                  </label>

                </div>

              </div>

            </section>


            {/* =========================
                VERIFICATION
            ========================= */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Document Verification
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Verification Status
                  </label>

                  <label className="flex h-10 cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      checked={
                        form.documentVerificationDone ??
                        false
                      }
                      onChange={(e) =>
                        updateField(
                          "documentVerificationDone",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />

                    <span className="text-sm text-gray-700">
                      Document verified
                    </span>

                  </label>

                </div>

                <Field
                  label="Verified By"
                  value={
                    form.documentVerificationDoneBy ??
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "documentVerificationDoneBy",
                      value
                    )
                  }
                />

              </div>

            </section>


            {/* =========================
                ACTIONS
            ========================= */}

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}


/* =========================
   REUSABLE FIELD
========================= */

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
}: FieldProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
}