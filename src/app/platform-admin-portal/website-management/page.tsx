"use client";

import Link from "next/link";
import {
  Globe2,
  ShieldCheck,
  Search,
  Sparkles,
  Wand2,
  PenLine,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const subModules = [
  {
    title: "Admin Websites",
    description:
      "Review website submissions and manage approval, rejection and publishing.",
    icon: ShieldCheck,
    href: "/platform-admin-portal/website-management/admin-websites",
    actions: ["Pending Websites", "Approve", "Reject", "Publish"],
  },
  {
    title: "Websites",
    description:
      "Create, update, submit and preview standalone business websites.",
    icon: Globe2,
    href: "/platform-admin-portal/website-management/websites",
    actions: ["Create Website", "Update", "Submit", "Preview"],
  },
  {
    title: "SEO Metadata",
    description:
      "Manage SEO metadata, calculate scores, run audits and analyze keywords.",
    icon: Search,
    href: "/platform-admin-portal/website-management/seo",
    actions: ["SEO Score", "AI Suggestions", "Audit", "Keyword Density"],
  },
  {
    title: "Website AI Content",
    description:
      "Manage AI-generated website copy and content records.",
    icon: Sparkles,
    href: "/platform-admin-portal/website-management/ai-content",
    actions: ["Create Content", "View Content", "Update Content"],
  },
  {
    title: "Website AI Generation",
    description:
      "Generate website content using AI based on the selected content type.",
    icon: Wand2,
    href: "/platform-admin-portal/website-management/ai-generation",
    actions: ["Generate with AI"],
  },
  {
    title: "Blog Writer AI Agent",
    description:
      "Generate blog posts using the AI blog writing agent.",
    icon: PenLine,
    href: "/platform-admin-portal/website-management/blog-writer",
    actions: ["Generate Blog"],
  },
  {
    title: "Public Website",
    description:
      "Resolve and view the public-facing website using its domain or slug.",
    icon: ExternalLink,
    href: "/platform-admin-portal/website-management/public-website",
    actions: ["By Slug", "By Domain"],
  },
];

export default function WebsiteManagementPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">
            Website Management
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Websites
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Create, manage, review, optimize and publish business websites
            from one place.
          </p>
        </div>

        <Link
          href="/platform-admin-portal/website-management/websites"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Create Website
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Overview */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          label="Website Management"
          value="7"
          description="Modules"
        />

        <OverviewCard
          label="Website Operations"
          value="4"
          description="Core actions"
        />

        <OverviewCard
          label="AI Tools"
          value="3"
          description="AI modules"
        />

        <OverviewCard
          label="SEO Tools"
          value="4"
          description="Optimization tools"
        />
      </section>

      {/* Submodules */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-950">
            Website Modules
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a module to manage that part of the website platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {subModules.map((module) => (
            <SubModuleCard
              key={module.title}
              title={module.title}
              description={module.description}
              icon={module.icon}
              href={module.href}
              actions={module.actions}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

function OverviewCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-950">{value}</span>

        <span className="mb-1 text-sm text-gray-500">{description}</span>
      </div>
    </div>
  );
}

/* ============================================================
   SUBMODULE CARD
============================================================ */

function SubModuleCard({
  title,
  description,
  icon: Icon,
  href,
  actions,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  actions: string[];
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
      {/* Icon + open */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <Icon size={22} className="text-gray-900" />
        </div>

        <Link
          href={href}
          aria-label={`Open ${title}`}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-950">{title}</h3>

      {/* Description */}
      <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-600">
        {description}
      </p>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {actions.map((action) => (
          <span
            key={action}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
          >
            {action}
          </span>
        ))}
      </div>

      {/* Open module */}
      <Link
        href={href}
        className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-semibold text-gray-900"
      >
        <span>Open module</span>
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}