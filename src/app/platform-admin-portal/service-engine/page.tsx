"use client";

import Link from "next/link";

const modules = [
  {
    title: "Categories",
    description: "Create and manage service categories.",
    href: "/platform-admin-portal/service-engine/categories",
    icon: "📁",
  },
  {
    title: "Services",
    description: "Manage services, pricing and approval status.",
    href: "/platform-admin-portal/service-engine/services",
    icon: "🛠️",
  },
];

export default function ServiceEnginePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          href="/platform-admin-portal"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Platform Admin
        </Link>

        {/* Header */}
        <div className="mt-4">
          <h1 className="text-4xl font-bold text-slate-950">
            Service Engine
          </h1>

          <p className="mt-2 text-slate-500">
            Manage service categories, services, booking rules
            and availability.
          </p>
        </div>

        {/* Main Modules */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start gap-5">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {module.icon}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {module.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-5 font-semibold text-blue-600 group-hover:text-blue-700">
                    Manage →
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Configuration Info */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-blue-900">
            Service Configuration
          </h2>

          <p className="mt-2 text-sm leading-6 text-blue-800">
            Booking rules and availability are configured
            for individual services. Open a service from
            the Services section to manage these settings.
          </p>

          <Link
            href="/platform-admin-portal/service-engine/services"
            className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open Services →
          </Link>
        </div>

      </div>
    </main>
  );
}