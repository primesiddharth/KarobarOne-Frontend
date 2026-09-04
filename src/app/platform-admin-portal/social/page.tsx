"use client";

import Link from "next/link";

const modules = [
  {
    title: "Social Links",
    description:
      "Manage store social media profile links and their active status.",
    href: "/platform-admin-portal/social/social-links",
    icon: "🔗",
  },
  {
    title: "Social Platforms",
    description:
      "Manage supported social media platforms and platform configuration.",
    href: "/platform-admin-portal/social/social-platforms",
    icon: "🌐",
  },
];

export default function SocialPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/platform-admin-portal"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Platform Admin
        </Link>

        <div className="mt-5">
          <h1 className="text-4xl font-bold text-slate-950">
            Social Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage social platforms and store social media links.
          </p>
        </div>

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
      </div>
    </main>
  );
}