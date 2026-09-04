"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getServices,
  deleteService,
} from "@/lib/api/services-engine";

import type { Service } from "@/types/services-engine";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tenantId = "default-tenant";

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const data = await getServices(tenantId);
      setServices(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await deleteService(id);

      setServices((prev) =>
        prev.filter((service) => service.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete service.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/platform-admin-portal/service-engine"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Service Engine
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-950">
              Services
            </h1>

            <p className="mt-2 text-slate-500">
              Create and manage platform services.
            </p>
          </div>

          <Link
            href="/platform-admin-portal/service-engine/services/new"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Service
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-white p-8 text-slate-500">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-4xl">🛠️</div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No services found
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first service.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Service
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Type
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Pricing
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Duration
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Approval
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
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-900">
                          {service.serviceName}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {service.serviceSlug}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {service.serviceType}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        ₹{service.pricing}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {service.duration} min
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            service.approvalStatus === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : service.approvalStatus === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {service.approvalStatus || "PENDING"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            service.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-4">
                          <Link
                            href={`/platform-admin-portal/service-engine/services/${service.id}`}
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            View / Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(service.id)}
                            className="font-medium text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}