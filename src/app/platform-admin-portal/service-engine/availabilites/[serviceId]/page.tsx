"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  getAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "@/lib/api/services-engine";

import type { Availability } from "@/types/services-engine";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export default function AvailabilitiesPage() {
  const params = useParams();

  const serviceId = params.serviceId as string;
  const tenantId = "default-tenant";

  const [availabilities, setAvailabilities] = useState<
    Availability[]
  >([]);

  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");

  // =========================================================
  // GET AVAILABILITIES
  // =========================================================

  async function loadAvailabilities() {
    try {
      setLoading(true);
      setError("");

      const data = await getAvailabilities(serviceId);

      setAvailabilities(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load availabilities.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (serviceId) {
      loadAvailabilities();
    }
  }, [serviceId]);

  // =========================================================
  // RESET FORM
  // =========================================================

  function resetForm() {
    setDayOfWeek("1");
    setStartTime("09:00");
    setEndTime("17:00");
    setEditingId(null);
    setError("");
  }

  // =========================================================
  // EDIT
  // =========================================================

  function handleEdit(availability: Availability) {
    setEditingId(availability.id);
    setDayOfWeek(String(availability.dayOfWeek));
    setStartTime(availability.startTime);
    setEndTime(availability.endTime);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (!startTime || !endTime) {
      setError("Start time and end time are required.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        // =====================================================
        // PUT
        // =====================================================

        await updateAvailability(editingId, {
          dayOfWeek: Number(dayOfWeek),
          startTime,
          endTime,
        });

        alert("Availability updated successfully.");
      } else {
        // =====================================================
        // POST
        // =====================================================

        await createAvailability({
          tenantId,
          serviceId,
          dayOfWeek: Number(dayOfWeek),
          startTime,
          endTime,
        });

        alert("Availability created successfully.");
      }

      resetForm();
      await loadAvailabilities();
    } catch (err) {
      console.error(err);

      setError(
        editingId
          ? "Failed to update availability."
          : "Failed to create availability."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE
  // =========================================================

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this availability?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteAvailability(id);

      setAvailabilities((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      alert("Availability deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete availability.");
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================================
  // DAY NAME
  // =========================================================

  function getDayName(day: number) {
    return (
      DAYS.find((item) => item.value === day)?.label ||
      `Day ${day}`
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border bg-white p-8 text-slate-500">
            Loading availabilities...
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
      <div className="mx-auto max-w-6xl">

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
            Availabilities
          </h1>

          <p className="mt-2 text-slate-500">
            Manage available days and time slots for this
            service.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingId
                  ? "Edit Availability"
                  : "Add Availability"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Set the day and time when this service is
                available.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            {/* Day */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Day *
              </label>

              <select
                value={dayOfWeek}
                onChange={(e) =>
                  setDayOfWeek(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {DAYS.map((day) => (
                  <option
                    key={day.value}
                    value={day.value}
                  >
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Start Time *
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                End Time *
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Availability"
                : "Add Availability"}
            </button>
          </div>
        </form>

        {/* =====================================================
            LIST
        ====================================================== */}

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Availability Schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {availabilities.length}{" "}
                {availabilities.length === 1
                  ? "time slot"
                  : "time slots"}{" "}
                configured.
              </p>
            </div>
          </div>

          {availabilities.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="text-4xl">🕐</div>

              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                No availability configured
              </h3>

              <p className="mt-2 text-slate-500">
                Add the first available day and time slot
                above.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">

                  <thead className="border-b bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                        Day
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                        Start Time
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                        End Time
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {availabilities.map(
                      (availability) => (
                        <tr
                          key={availability.id}
                          className="border-b last:border-0 hover:bg-slate-50"
                        >
                          {/* Day */}
                          <td className="px-6 py-5">
                            <span className="font-semibold text-slate-900">
                              {getDayName(
                                availability.dayOfWeek
                              )}
                            </span>
                          </td>

                          {/* Start */}
                          <td className="px-6 py-5 text-slate-600">
                            {availability.startTime}
                          </td>

                          {/* End */}
                          <td className="px-6 py-5 text-slate-600">
                            {availability.endTime}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                availability.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {availability.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5">
                            <div className="flex gap-4">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    availability
                                  )
                                }
                                className="font-medium text-blue-600 hover:text-blue-700"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    availability.id
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  availability.id
                                }
                                className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                              >
                                {deletingId ===
                                availability.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            SERVICE INFO
        ====================================================== */}

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-bold text-blue-900">
            Service Availability
          </h2>

          <p className="mt-2 text-sm text-blue-800">
            These time slots determine when customers can
            book this service.
          </p>

          <div className="mt-4 rounded-xl bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Service ID
            </p>

            <p className="mt-1 break-all text-sm font-medium text-slate-800">
              {serviceId}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}