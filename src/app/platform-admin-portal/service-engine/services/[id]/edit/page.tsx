"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  getService,
  getBookingRule,
  getAvailabilities,
} from "@/lib/api/services-engine";

import type {
  Service,
  BookingRule,
  Availability,
} from "@/types/services-engine";

export default function ServiceDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [bookingRule, setBookingRule] =
    useState<BookingRule | null>(null);
  const [availability, setAvailability] =
    useState<Availability[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const serviceData = await getService(id);

        setService(serviceData);

        const [rule, slots] = await Promise.all([
          getBookingRule(id).catch(() => null),
          getAvailabilities(id).catch(() => []),
        ]);

        setBookingRule(rule);
        setAvailability(slots);
      } catch (err) {
        console.error(err);
        setError("Failed to load service.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-12">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8">
          Loading service...
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/platform-admin-portal/service-engine/services"
            className="text-blue-600"
          >
            ← Back to Services
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
            {error || "Service not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/platform-admin-portal/service-engine/services"
              className="text-sm font-medium text-blue-600"
            >
              ← Services
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-950">
              {service.serviceName}
            </h1>

            <p className="mt-2 text-slate-500">
              Service details and configuration
            </p>
          </div>

          <Link
            href={`/platform-admin-portal/service-engine/services/${id}/edit`}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Edit Service
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Details */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Basic Details
            </h2>

            <div className="mt-6 space-y-4">
              <Info label="Service Name" value={service.serviceName} />
              <Info label="Slug" value={service.serviceSlug} />
              <Info label="Type" value={service.serviceType} />
              <Info label="Pricing" value={`₹${service.pricing}`} />
              <Info
                label="Duration"
                value={`${service.duration} minutes`}
              />
              <Info
                label="Status"
                value={service.isActive ? "Active" : "Inactive"}
              />
              <Info
                label="Approval"
                value={service.approvalStatus || "PENDING"}
              />
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Description
            </h2>

            <p className="mt-6 leading-7 text-slate-600">
              {service.description || "No description available."}
            </p>
          </section>

          {/* Booking Rule */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Booking Rule
            </h2>

            {bookingRule ? (
              <div className="mt-6 space-y-4">
                <Info
                  label="Booking Mode"
                  value={bookingRule.bookingMode}
                />

                <Info
                  label="Requires Approval"
                  value={
                    bookingRule.requiresApproval ? "Yes" : "No"
                  }
                />

                <Info
                  label="Status"
                  value={bookingRule.isActive ? "Active" : "Inactive"}
                />
              </div>
            ) : (
              <p className="mt-6 text-slate-500">
                No booking rule configured.
              </p>
            )}
          </section>

          {/* Availability */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Availability
            </h2>

            {availability.length === 0 ? (
              <p className="mt-6 text-slate-500">
                No availability configured.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {availability.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <div className="font-medium text-slate-900">
                      {getDayName(slot.dayOfWeek)}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      {slot.startTime} — {slot.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  );
}

function getDayName(day: number) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day] || `Day ${day}`;
}