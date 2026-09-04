"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  getService,
  updateService,
  deleteService,
  submitServiceApproval,
  getCategories,
} from "@/lib/api/services-engine";

import type { ServiceCategory } from "@/types/services-engine";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;
  const tenantId = "default-tenant";

  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [serviceName, setServiceName] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [serviceType, setServiceType] = useState("PHYSICAL");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState("");
  const [duration, setDuration] = useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaSlug, setMetaSlug] = useState("");

  const [approvalStatus, setApprovalStatus] = useState("PENDING");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // GET SERVICE + CATEGORIES
  // =========================================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [service, categoryData] = await Promise.all([
          getService(id),
          getCategories(tenantId),
        ]);

        setCategories(categoryData);

        setServiceName(service.serviceName);
        setServiceSlug(service.serviceSlug);
        setCategoryId(service.categoryId);
        setServiceType(service.serviceType);
        setDescription(service.description || "");
        setPricing(String(service.pricing));
        setDuration(String(service.duration));

        setMetaTitle(service.metaTitle || "");
        setMetaDescription(service.metaDescription || "");
        setMetaSlug(service.metaSlug || "");

        setApprovalStatus(
          service.approvalStatus || "PENDING"
        );

        setIsActive(service.isActive);
      } catch (err) {
        console.error(err);
        setError("Failed to load service.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  // =========================================================
  // UPDATE SERVICE - PUT
  // =========================================================

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!serviceName.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!serviceSlug.trim()) {
      setError("Service slug is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!pricing) {
      setError("Pricing is required.");
      return;
    }

    if (!duration) {
      setError("Duration is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateService(id, {
        categoryId,
        serviceName: serviceName.trim(),
        serviceSlug: serviceSlug.trim(),
        serviceType,
        description: description.trim() || null,
        pricing,
        duration: Number(duration),

        metaTitle: metaTitle.trim() || null,
        metaDescription:
          metaDescription.trim() || null,
        metaSlug: metaSlug.trim() || null,

        approvalStatus: approvalStatus || null,
        isActive,
      });

      alert("Service updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update service.");
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // SUBMIT FOR APPROVAL - POST
  // =========================================================

  async function handleApproval() {
    if (
      !window.confirm(
        "Are you sure you want to submit this service for approval?"
      )
    ) {
      return;
    }

    try {
      setApproving(true);
      setError("");

      const updated = await submitServiceApproval(id);

      setApprovalStatus(
        updated.approvalStatus || "PENDING"
      );

      alert("Service submitted for approval.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit service for approval.");
    } finally {
      setApproving(false);
    }
  }

  // =========================================================
  // DELETE SERVICE
  // =========================================================

  async function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete this service?"
      )
    ) {
      return;
    }

    try {
      await deleteService(id);

      alert("Service deleted successfully.");

      router.push(
        "/platform-admin-portal/service-engine/services"
      );

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete service.");
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-white p-8 text-slate-500">
            Loading service...
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/platform-admin-portal/service-engine/services"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Services
        </Link>

        {/* Header */}
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">
              Edit Service
            </h1>

            <p className="mt-2 text-slate-500">
              Update service details and manage service
              configuration.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
          >
            Delete Service
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* =====================================================
            SERVICE FORM
        ====================================================== */}

        <form
          onSubmit={handleUpdate}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">

            {/* Service Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Service Name *
              </label>

              <input
                value={serviceName}
                onChange={(e) =>
                  setServiceName(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Service Slug */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Service Slug *
              </label>

              <input
                value={serviceSlug}
                onChange={(e) =>
                  setServiceSlug(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Category *
              </label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Service Type *
              </label>

              <select
                value={serviceType}
                onChange={(e) =>
                  setServiceType(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="PHYSICAL">
                  Physical
                </option>

                <option value="ONLINE">
                  Online
                </option>
              </select>
            </div>

            {/* Pricing */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Pricing *
              </label>

              <input
                type="number"
                min="0"
                value={pricing}
                onChange={(e) =>
                  setPricing(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Duration (minutes) *
              </label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* =================================================
              SEO
          ================================================== */}

          <div className="mt-8 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold text-slate-900">
              SEO Information
            </h2>

            <div className="mt-5 grid gap-6 md:grid-cols-2">

              {/* Meta Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Meta Title
                </label>

                <input
                  value={metaTitle}
                  onChange={(e) =>
                    setMetaTitle(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              {/* Meta Slug */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Meta Slug
                </label>

                <input
                  value={metaSlug}
                  onChange={(e) =>
                    setMetaSlug(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              {/* Meta Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Meta Description
                </label>

                <textarea
                  value={metaDescription}
                  onChange={(e) =>
                    setMetaDescription(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              STATUS
          ================================================== */}

          <div className="mt-8 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold text-slate-900">
              Service Status
            </h2>

            <div className="mt-5 grid gap-6 md:grid-cols-2">

              {/* Approval Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Approval Status
                </label>

                <input
                  value={approvalStatus}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Active Status
                </label>

                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) =>
                    setIsActive(
                      e.target.value === "true"
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option value="true">
                    Active
                  </option>

                  <option value="false">
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
              SAVE / APPROVAL
          ================================================== */}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleApproval}
              disabled={approving}
              className="rounded-xl border border-blue-200 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >
              {approving
                ? "Submitting..."
                : "Submit for Approval"}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>

        {/* =====================================================
            SERVICE CONFIGURATION
        ====================================================== */}

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Service Configuration
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage booking and availability settings for
            this service.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* Booking Rules */}
            <Link
              href={`/platform-admin-portal/service-engine/booking-rules/${id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  📋
                </div>

                <span className="text-xl text-slate-400 transition group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Booking Rules
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Configure booking mode and approval
                requirements for this service.
              </p>
            </Link>

            {/* Availabilities */}
            <Link
              href={`/platform-admin-portal/service-engine/availabilities/${id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  🕐
                </div>

                <span className="text-xl text-slate-400 transition group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Availabilities
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage available days and time slots for
                this service.
              </p>
            </Link>

          </div>
        </div>

      </div>
    </main>
  );
}