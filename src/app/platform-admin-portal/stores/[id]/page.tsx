// src/app/platform-admin-portal/stores/[id]/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  CalendarDays,
  Package,
  ShieldCheck,
  Edit,
  Trash2,
  Send,
  Eye,
  Sparkles,
  Palette,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { storeApi } from "@/lib/api/store";
import { Store } from "@/types/store";
import { useAuth } from "@/context/auth-context";

export default function StoreDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { token, isLoading: authLoading } = useAuth();

  const [storeId, setStoreId] = useState<string>("");
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get dynamic [id]
  useEffect(() => {
    params.then(({ id }) => {
      setStoreId(id);
    });
  }, [params]);

  // Load store
  useEffect(() => {
    if (authLoading || !token || !storeId) return;

    async function loadStore() {
      try {
        setLoading(true);
        setError("");

        const data = await storeApi.getById(storeId, token);

        setStore(data);
      } catch (err) {
        console.error("Failed to load store:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load store."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStore();
  }, [authLoading, token, storeId]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="size-5 animate-spin" />
          Loading store...
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto size-10 text-red-500" />

          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Login required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please login to view store details.
          </p>

          <Link
            href="/login"
            className="mt-5 inline-flex rounded-full bg-[#5b4ef9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4d42dc]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Platform Admin
              </p>

              <h1 className="mt-1 text-xl font-semibold text-slate-950">
                Store Details
              </h1>
            </div>

            <Link
              href="/platform-admin-portal/stores"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#5b4ef9]"
            >
              <ArrowLeft className="size-4" />
              Stores
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-800">
                  Unable to load store
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-slate-500">
          Store not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Platform Admin
            </p>

            <h1 className="mt-1 text-xl font-semibold text-slate-950">
              Store Details
            </h1>
          </div>

          <Link
            href="/platform-admin-portal/stores"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
          >
            <ArrowLeft className="size-4" />
            Stores
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Store overview */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#5b4ef9]/10">
                  <Building2 className="size-7 text-[#5b4ef9]" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-slate-950">
                      {store.storeName}
                    </h2>

                    <StatusBadge
                      status={
                        store.isActive
                          ? store.approvalStatus || "ACTIVE"
                          : "INACTIVE"
                      }
                    />
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Store ID: {store.id}
                  </p>
                </div>
              </div>

              <Link
                href={`/platform-admin-portal/stores/${store.id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5b4ef9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d42dc]"
              >
                <Edit className="size-4" />
                Edit Store
              </Link>
            </div>
          </section>

          {/* Main information */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Store information */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeading
                icon={Building2}
                eyebrow="Store"
                title="Store information"
              />

              <div className="mt-5 space-y-4">

                <InfoRow
                  icon={Building2}
                  label="Store name"
                  value={store.storeName}
                />

                <InfoRow
                  icon={Globe}
                  label="Store slug"
                  value={store.storeSlug}
                />

                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={store.email || "Not provided"}
                />

                <InfoRow
                  icon={Phone}
                  label="Mobile"
                  value={store.mobile || "Not provided"}
                />

                <InfoRow
                  icon={Phone}
                  label="WhatsApp"
                  value={
                    store.whatsappMobile || "Not provided"
                  }
                />

                <InfoRow
                  icon={CalendarDays}
                  label="Created"
                  value={formatDate(store.createdAt)}
                />

              </div>
            </section>

            {/* Store status */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeading
                icon={ShieldCheck}
                eyebrow="Status"
                title="Store status"
              />

              <div className="mt-5 space-y-4">

                <InfoRow
                  icon={ShieldCheck}
                  label="Approval status"
                  value={
                    store.approvalStatus || "Not available"
                  }
                />

                <InfoRow
                  icon={ShieldCheck}
                  label="Store status"
                  value={store.isActive ? "Active" : "Inactive"}
                />

                <InfoRow
                  icon={CalendarDays}
                  label="Last updated"
                  value={formatDate(store.updatedAt)}
                />

              </div>
            </section>
          </div>

          {/* Description */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              icon={Building2}
              eyebrow="About"
              title="Store description"
            />

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {store.description || "No description provided."}
            </p>

            {store.tagline && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Tagline
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {store.tagline}
                </p>
              </div>
            )}
          </section>

          {/* Store operations */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              icon={SettingsIcon}
              eyebrow="Configuration"
              title="Store operations"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <OperationCard
                icon={Globe}
                title="Website"
                value="Available"
              />

              <OperationCard
                icon={Package}
                title="Products"
                value="Manage"
              />

              <OperationCard
                icon={Sparkles}
                title="AI"
                value="Generate"
              />

              <OperationCard
                icon={Palette}
                title="Theme"
                value="Change"
              />

            </div>
          </section>

          {/* Admin actions */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              icon={SettingsIcon}
              eyebrow="Administration"
              title="Admin actions"
            />

            <div className="mt-5 flex flex-wrap gap-3">

              <Link
                href={`/platform-admin-portal/stores/${store.id}/edit`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
              >
                <Edit className="size-4" />
                Edit Store
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
              >
                <Eye className="size-4" />
                Preview
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
              >
                <Send className="size-4" />
                Submit for Approval
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Delete Store
              </button>

            </div>
          </section>

          <footer className="py-8 text-xs text-slate-400">
            Store {store.id} • Platform Admin
          </footer>
        </div>
      </main>
    </div>
  );
}

/* ---------- Components ---------- */

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#5b4ef9]/10">
        <Icon className="size-5 text-[#5b4ef9]" />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          {title}
        </h2>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
        <Icon className="size-4 text-slate-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function OperationCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#5b4ef9]/10">
          <Icon className="size-5 text-[#5b4ef9]" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const isGood =
    normalized === "ACTIVE" ||
    normalized === "APPROVED";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        isGood
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SettingsIcon(
  props: React.ComponentProps<"svg">
) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V22h-2.54v-.1a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 17a1.7 1.7 0 0 0-1.56-1.04H6.4v-2.54h.14A1.7 1.7 0 0 0 8.1 12.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.56V5h2.54v.5a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04H21v2.54h-.04A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}