"use client";

import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserCog,
  Users,
  UserRoundCheck,
  MonitorSmartphone,
  Store,
} from "lucide-react";

const modules = [
  {
    title: "Users",
    description:
      "Manage platform users, accounts and user access.",
    href: "/platform-admin-portal/users/users",
    icon: Users,
    items: [
      "View users",
      "Create users",
      "Edit user details",
      "Delete users",
    ],
  },
  {
    title: "Roles",
    description:
      "Manage roles used to control access across the platform.",
    href: "/platform-admin-portal/users/roles",
    icon: UserCog,
    items: [
      "View roles",
      "Create roles",
      "Edit roles",
      "Manage role status",
    ],
  },
  {
    title: "Permissions",
    description:
      "Manage permissions available across the platform.",
    href: "/platform-admin-portal/users/permissions",
    icon: KeyRound,
    items: [
      "View permissions",
      "Create permissions",
      "Edit permissions",
      "Manage permission status",
    ],
  },
  {
    title: "Role Permissions",
    description:
      "Control which permissions are granted to each role.",
    href: "/platform-admin-portal/users/role-permissions",
    icon: ShieldCheck,
    items: [
      "View role permissions",
      "Grant permissions",
      "Revoke permissions",
      "Manage role access",
    ],
  },
  {
    title: "User Roles",
    description:
      "Assign and manage roles for platform users.",
    href: "/platform-admin-portal/users/user-roles",
    icon: UserRoundCheck,
    items: [
      "View user roles",
      "Assign roles",
      "Revoke roles",
      "Manage user access",
    ],
  },
  {
    title: "Store Staff Permissions",
    description:
      "Manage staff access and permissions at the store level.",
    href: "/platform-admin-portal/users/store-staff-permissions",
    icon: Store,
    items: [
      "View staff permissions",
      "Grant store access",
      "Revoke store access",
      "Manage staff permissions",
    ],
  },
  {
    title: "User Sessions",
    description:
      "View and manage active user sessions across the platform.",
    href: "/platform-admin-portal/users/sessions",
    icon: MonitorSmartphone,
    items: [
      "View active sessions",
      "Track session activity",
      "Manage sessions",
      "Revoke sessions",
    ],
  },
  {
    title: "User Security Settings",
    description:
      "Manage security settings and authentication controls for users.",
    href: "/platform-admin-portal/users/security",
    icon: LockKeyhole,
    items: [
      "View security settings",
      "Manage authentication",
      "Manage 2FA settings",
      "Update security controls",
    ],
  },
];

export default function UsersAccessPage() {
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
          Users & Access
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-7 text-gray-500">
          Manage users, roles, permissions, access controls, sessions and
          security settings.
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
            <ShieldCheck size={21} className="text-indigo-600" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Users & Access Overview
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Manage platform users and their roles, permissions, store-level
              staff access, active sessions and security settings from one
              place.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}