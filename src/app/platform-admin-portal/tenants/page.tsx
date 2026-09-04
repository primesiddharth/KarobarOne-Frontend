"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, Search } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";

interface Tenant {
  id: string;
  gstNumber?: string;
  panNumber?: string;
  businessName?: string;
  legalName?: string;
  email?: string;
  mobile?: string;
  whatsappMobile?: string;
  ownerName?: string;
  businessAddressLine1?: string;
  businessAddressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  businessType?: string;
  businessDescription?: string;
  employeeCount?: number;
  statusId?: number;
  isActive?: boolean;
  registeredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TenantListResponse {
  items: Tenant[];
  total: number;
  skip: number;
  limit: number;
}

export default function TenantsPage() {
  const { token, tokenType, isLoading: authLoading } = useAuth();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [skip, setSkip] = useState(0);
  const limit = 20;

  async function fetchTenants() {
    if (!token) {
      setTenants([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      params.set("skip", String(skip));
      params.set("limit", String(limit));

      const result = await apiClient<TenantListResponse>(
        `/api/v1/tenants?${params.toString()}`,
        {
          token,
        }
      );

      setTenants(result.items || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error("Failed to fetch tenants:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load tenants.");
      }

      setTenants([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;

    fetchTenants();
  }, [token, authLoading, skip]);

  const filteredTenants = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return tenants;
    }

    return tenants.filter((tenant) => {
      return (
        tenant.businessName?.toLowerCase().includes(value) ||
        tenant.legalName?.toLowerCase().includes(value) ||
        tenant.email?.toLowerCase().includes(value) ||
        tenant.mobile?.toLowerCase().includes(value) ||
        tenant.ownerName?.toLowerCase().includes(value) ||
        tenant.city?.toLowerCase().includes(value) ||
        tenant.state?.toLowerCase().includes(value) ||
        tenant.businessType?.toLowerCase().includes(value)
      );
    });
  }, [tenants, search]);

  const hasNextPage = skip + limit < total;
  const hasPreviousPage = skip > 0;

  function handlePrevious() {
    if (!hasPreviousPage) return;

    setSkip(Math.max(0, skip - limit));
  }

  function handleNext() {
    if (!hasNextPage) return;

    setSkip(skip + limit);
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
              Platform Admin
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Tenants
            </h1>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
        </div>
      </header>

      <main className="px-8 py-14">
        {/* All tenants card */}
        <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                <Building2 size={32} strokeWidth={2} />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
                  Platform Module
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  All tenants
                </h2>

                <p className="mt-2 text-base text-slate-500">
                  View and manage businesses registered on KarobarOne.
                </p>
              </div>
            </div>

            <div className="min-w-[160px] rounded-2xl bg-violet-50 px-8 py-6">
              <p className="text-sm text-slate-500">
                Total tenants
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {loading ? "—" : total}
              </p>
            </div>
          </div>
        </section>

        {/* Tenant directory */}
        <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
                Tenant Directory
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Registered tenants
              </h2>
            </div>

            <div className="relative w-full max-w-[440px]">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tenants..."
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-14 pr-6 text-base outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
              />
            </div>
          </div>

          {/* Auth error */}
          {!authLoading && !token && (
            <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-red-600">
              Please login to access the admin portal.
            </div>
          )}

          {/* Loading */}
          {token && loading && (
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-8 text-center text-slate-500">
              Loading tenants...
            </div>
          )}

          {/* API error */}
          {token && !loading && error && (
            <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-red-600">
              {error}
            </div>
          )}

          {/* Empty */}
          {token &&
            !loading &&
            !error &&
            filteredTenants.length === 0 && (
              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-12 text-center">
                <Building2
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 text-lg font-semibold text-slate-700">
                  {search
                    ? "No tenants found"
                    : "No tenants registered"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {search
                    ? "Try searching with a different business name, email or city."
                    : "Registered businesses will appear here."}
                </p>
              </div>
            )}

          {/* Tenant list */}
          {token &&
            !loading &&
            !error &&
            filteredTenants.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-left">
                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                          Business
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                          Owner
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                          Contact
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                          Location
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                          Type
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTenants.map((tenant) => (
                        <tr
                          key={tenant.id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                        >
                          {/* Business */}
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {tenant.businessName ||
                                  tenant.legalName ||
                                  "Unnamed business"}
                              </p>

                              {tenant.legalName &&
                                tenant.businessName &&
                                tenant.legalName !==
                                  tenant.businessName && (
                                  <p className="mt-1 text-sm text-slate-400">
                                    {tenant.legalName}
                                  </p>
                                )}

                              {tenant.email && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {tenant.email}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Owner */}
                          <td className="px-6 py-5 text-sm text-slate-600">
                            {tenant.ownerName || "—"}
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-5">
                            <div className="text-sm text-slate-600">
                              {tenant.mobile || "—"}
                            </div>

                            {tenant.whatsappMobile && (
                              <div className="mt-1 text-xs text-slate-400">
                                WhatsApp: {tenant.whatsappMobile}
                              </div>
                            )}
                          </td>

                          {/* Location */}
                          <td className="px-6 py-5 text-sm text-slate-600">
                            {[
                              tenant.city,
                              tenant.state,
                            ]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </td>

                          {/* Business type */}
                          <td className="px-6 py-5 text-sm text-slate-600">
                            {tenant.businessType || "—"}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                tenant.isActive
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {tenant.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                  <p className="text-sm text-slate-500">
                    {total === 0
                      ? "No tenants"
                      : `Showing ${skip + 1}-${Math.min(
                          skip + tenants.length,
                          total
                        )} of ${total}`}
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={!hasPreviousPage}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!hasNextPage}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
        </section>
      </main>
    </div>
  );
}