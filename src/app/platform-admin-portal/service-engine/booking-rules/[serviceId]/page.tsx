"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  getBookingRule,
  createBookingRule,
} from "@/lib/api/services-engine";

import type { BookingRule } from "@/types/services-engine";

export default function BookingRulesPage() {
  const params = useParams();

  const serviceId = params.serviceId as string;
  const tenantId = "default-tenant";

  const [rule, setRule] = useState<BookingRule | null>(null);

  const [bookingMode, setBookingMode] =
    useState("BOOKING_ONLY");

  const [requiresApproval, setRequiresApproval] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // GET BOOKING RULE
  // =========================================================

  async function loadBookingRule() {
    try {
      setLoading(true);
      setError("");

      const data = await getBookingRule(serviceId);

      setRule(data);

      setBookingMode(data.bookingMode);
      setRequiresApproval(
        data.requiresApproval ?? false
      );
    } catch (err) {
      console.error(err);

      /*
       * Rule may not exist yet.
       * In that case user can create one.
       */
      setRule(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (serviceId) {
      loadBookingRule();
    }
  }, [serviceId]);

  // =========================================================
  // CREATE BOOKING RULE
  // =========================================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = await createBookingRule({
        tenantId,
        serviceId,
        bookingMode,
        requiresApproval,
      });

      setRule(data);

      setBookingMode(data.bookingMode);
      setRequiresApproval(
        data.requiresApproval ?? false
      );

      alert("Booking rule saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save booking rule.");
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
            Loading booking rules...
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
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href={`/platform-admin-portal/service-engine/services/${serviceId}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Service
        </Link>

        {/* Header */}
        <div className="mt-4">
          <h1 className="text-4xl font-bold text-slate-950">
            Booking Rules
          </h1>

          <p className="mt-2 text-slate-500">
            Configure booking rules for this service.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Existing Rule */}
        {rule && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Booking rule configured
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Rule ID: {rule.id}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  rule.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {rule.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          {/* Booking Mode */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Booking Mode *
            </label>

            <select
              value={bookingMode}
              onChange={(e) =>
                setBookingMode(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="BOOKING_ONLY">
                Booking Only
              </option>

              <option value="BOOKING_AND_PAYMENT">
                Booking & Payment
              </option>
            </select>

            <p className="mt-2 text-sm text-slate-500">
              Select how customers can book this service.
            </p>
          </div>

          {/* Requires Approval */}
          <div className="mt-7 rounded-xl border border-slate-200 p-5">
            <div className="flex items-start gap-4">
              <input
                id="requiresApproval"
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) =>
                  setRequiresApproval(
                    e.target.checked
                  )
                }
                className="mt-1 h-5 w-5 rounded border-slate-300"
              />

              <div>
                <label
                  htmlFor="requiresApproval"
                  className="font-semibold text-slate-900"
                >
                  Requires Approval
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  When enabled, bookings need approval
                  before they are confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : rule
                ? "Save Booking Rule"
                : "Create Booking Rule"}
            </button>
          </div>
        </form>

        {/* Service Information */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-bold text-blue-900">
            Service Information
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Service ID
              </p>

              <p className="mt-1 break-all text-sm font-medium text-slate-800">
                {serviceId}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Current Booking Mode
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {bookingMode}
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}