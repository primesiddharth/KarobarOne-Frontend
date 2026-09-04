"use client";

import Link from "next/link";
import {
  CreditCard,
  FileText,
  ArrowRight,
  ReceiptText,
} from "lucide-react";

const modules = [
  {
    title: "Plans",
    description:
      "Manage subscription plans, pricing, commissions, features and plan history.",
    href: "/platform-admin-portal/plans-billing/plans",
    icon: CreditCard,
    items: [
      "View subscription plans",
      "Create and update plans",
      "Manage plan status",
      "View plan history",
    ],
  },
  {
    title: "Billing",
    description:
  "Manage billing rules and commissions.",
    href: "/platform-admin-portal/plans-billing/billing",
    icon: ReceiptText,
    items: [
      "Manage billing rules",
      "Configure commissions",
    ],
  },
];

export default function PlansBillingPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-8 md:px-10 lg:px-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/platform-admin-portal"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
        >
          ← Back to Manage KarobarOne
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Plans & Billing
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-7 text-gray-500">
          Manage subscription plans, billing rules and commissions.
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.title}
              href={module.href}
              className="group relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              {/* Arrow */}
              <div className="absolute right-7 top-7 text-gray-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-indigo-500">
                <ArrowRight size={24} strokeWidth={1.8} />
              </div>

              {/* Icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                <Icon
                  size={27}
                  strokeWidth={1.8}
                  className="text-indigo-600"
                />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900">
                {module.title}
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-xl text-base leading-7 text-gray-500">
                {module.description}
              </p>

              {/* Features */}
              <div className="mt-7 space-y-3">
                {module.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              {/* Open Module */}
              <div className="mt-8 flex items-center gap-2 text-base font-medium text-indigo-600">
                Open {module.title}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Information */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <FileText size={21} className="text-indigo-600" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Plans & Billing Overview
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Plans handles subscription plan management and plan change history,
while Billing handles billing rules and commissions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}