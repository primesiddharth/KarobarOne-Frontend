import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CreditCard,
  Globe,
  Image,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Admin Portal | KarobarOne",
  description: "Manage the KarobarOne platform.",
};

const modules = [
  {
    title: "Tenants",
    description: "Manage tenants, plans, settings and statuses.",
    href: "/platform-admin-portal/tenants",
    icon: Building2,
  },
  {
    title: "Plans & Billing",
    description: "Manage subscription plans, features, billing and history.",
    href: "/platform-admin-portal/plans-billing",
    icon: CreditCard,
  },
  {
    title: "Users & Access",
    description: "Manage users, roles, permissions, sessions and security.",
    href: "/platform-admin-portal/users",
    icon: Users,
  },
  {
    title: "Website Management",
    description: "Manage websites, approvals, SEO, content and AI tools.",
    href: "/platform-admin-portal/website-management",
    icon: Globe,
  },
  {
    title: "Media",
    description: "Manage media files, metadata, variants and upload logs.",
    href: "/platform-admin-portal/media",
    icon: Image,
  },
  {
    title: "Services",
    description: "Manage services, availability and booking configuration.",
    href: "/platform-admin-portal/service-engine",
    icon: Wrench,
  },
  {
    title: "Social",
    description: "Manage social links and supported social platforms.",
    href: "/platform-admin-portal/social",
    icon: Settings,
  },
];

export default function PlatformAdminPortalPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              KarobarOne portal
            </p>

            <h1 className="mt-1 text-xl font-semibold text-slate-950">
              Platform Admin Portal
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
          >
            Home
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Intro */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#5b4ef9]/10">
                <ShieldCheck className="size-6 text-[#5b4ef9]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Admin portal
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Platform overview
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Manage tenants, subscriptions, users, websites, media,
                  services and other platform-level settings from one place.
                </p>
              </div>
            </div>
          </section>

          {/* Modules */}
          <section className="mt-8">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Platform modules
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-950">
                Manage KarobarOne
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
                const Icon = module.icon;

                return (
                  <Link
                    key={module.title}
                    href={module.href}
                    className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#5b4ef9]/25 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[#5b4ef9]/10">
                        <Icon className="size-5 text-[#5b4ef9]" />
                      </div>

                      <ArrowRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#5b4ef9]" />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-slate-950">
                      {module.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {module.description}
                    </p>

                    <div className="mt-5 text-sm font-medium text-[#5b4ef9]">
                      Open module
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}