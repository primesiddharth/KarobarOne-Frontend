"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Search,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { storeApi } from "@/lib/api/store";
import type { Store } from "@/types/store";
import { useAuth } from "@/context/auth-context";

export default function StoreManagementPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setLoading(false);
      return;
    }

    async function loadStores() {
      try {
        setLoading(true);
        setError("");

        const data = await storeApi.list(undefined, token);

        setStores(data);
      } catch (err) {
        console.error("Failed to load stores:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load stores."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, [token, authLoading]);

  const filteredStores = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return stores;
    }

    return stores.filter((store) => {
      return (
        store.storeName.toLowerCase().includes(query) ||
        store.storeSlug.toLowerCase().includes(query) ||
        (store.email ?? "").toLowerCase().includes(query) ||
        store.id.toLowerCase().includes(query)
      );
    });
  }, [stores, search]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Loader2 className="size-5 animate-spin" />
          Loading stores...
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto size-10 text-red-500" />

          <h2 className="mt-4 text-xl font-semibold text-slate-950">
            Login required
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please login to view stores.
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

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Platform Admin
            </p>

            <h1 className="mt-1 text-xl font-semibold text-slate-950">
              Store Management
            </h1>
          </div>

          <Link
            href="/platform-admin-portal"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Intro */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#5b4ef9]/10">
                    <Building2 className="size-5 text-[#5b4ef9]" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Platform module
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                      All stores
                    </h2>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                  View and manage all stores registered on the KarobarOne
                  platform.
                </p>
              </div>

              <div className="rounded-2xl bg-[#5b4ef9]/5 px-5 py-4 md:min-w-40">
                <p className="text-xs text-slate-500">
                  Total stores
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {stores.length}
                </p>
              </div>
            </div>
          </section>

          {/* Store list */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* Toolbar */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Store directory
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  Registered stores
                </h2>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search stores..."
                    className="h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#5b4ef9]/40 sm:w-60"
                  />
                </div>

                {/* Filter */}
                <button
                  type="button"
                  disabled
                  className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-400"
                  title="Filters will be added after backend filter parameters are confirmed."
                >
                  <SlidersHorizontal className="size-4" />
                  Filter
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Unable to load stores
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!error && filteredStores.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 px-6 py-12 text-center">
                <Building2 className="mx-auto size-10 text-slate-300" />

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {search
                    ? "No stores found"
                    : "No stores registered"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {search
                    ? "Try searching with a different store name, slug or email."
                    : "Registered stores will appear here."}
                </p>
              </div>
            )}

            {/* Desktop table */}
            {!error && filteredStores.length > 0 && (
              <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50/70">
                    <tr>
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Store
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Created
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredStores.map((store) => (
                      <tr
                        key={store.id}
                        className="transition hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#5b4ef9]/10">
                              <Building2 className="size-4 text-[#5b4ef9]" />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {store.storeName}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {store.storeSlug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {store.email || "No email"}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {store.mobile || "No mobile"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              store.isActive
                                ? store.approvalStatus || "Active"
                                : "Inactive"
                            }
                          />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(store.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/platform-admin-portal/stores/${store.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5b4ef9] hover:underline"
                          >
                            View
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile cards */}
            {!error && filteredStores.length > 0 && (
              <div className="mt-6 space-y-3 md:hidden">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#5b4ef9]/10">
                          <Building2 className="size-4 text-[#5b4ef9]" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {store.storeName}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {store.storeSlug}
                          </p>
                        </div>
                      </div>

                      <StatusBadge
                        status={
                          store.isActive
                            ? store.approvalStatus || "Active"
                            : "Inactive"
                        }
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Contact
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-slate-700">
                          {store.email || store.mobile || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatDate(store.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/platform-admin-portal/stores/${store.id}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
                    >
                      View store
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-5 flex flex-col justify-between gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400 sm:flex-row">
              <p>
                Showing {filteredStores.length} of {stores.length} stores
              </p>

              <p>Store management</p>
            </div>
          </section>
        </div>
      </main>
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
          : "bg-red-50 text-red-700"
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
    month: "short",
    year: "numeric",
  });
}