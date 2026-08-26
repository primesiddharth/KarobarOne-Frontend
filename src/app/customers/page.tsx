"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Users, Pencil, Trash2, MapPin, Trash } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { customerApi } from "@/lib/api/customer";
import { ApiError } from "@/lib/api-client";
import { Customer } from "@/types/customer";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  BLOCKED: "bg-red-100 text-red-700",
};

function CustomerListPageContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await customerApi.list(
        { storeId: storeId || undefined, status: statusFilter || undefined },
        token
      );
      setCustomers(result.data);
      setTotal(result.total);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load customers.");
    } finally {
      setIsLoading(false);
    }
  }, [token, storeId, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(customerId: string) {
    if (!token) return;
    if (!confirm("Delete this customer? They can be restored from trash later.")) return;
    setDeletingId(customerId);
    try {
      await customerApi.remove(customerId, token);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      setTotal((t) => t - 1);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">
              {total} customer{total !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/customers/trash?tenantId=${tenantId}&storeId=${storeId}`}
              className="inline-flex items-center gap-2 text-gray-500 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Trash className="w-4 h-4" />
              Trash
            </Link>
            <Link
              href={`/customers/add?tenantId=${tenantId}&storeId=${storeId}`}
              className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#4a3ee0] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </Link>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No customers yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#5b4ef9]/10 flex items-center justify-center shrink-0 text-[#5b4ef9] font-semibold text-sm">
                    {customer.firstName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {customer.firstName} {customer.lastName || ""}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {customer.email} · {customer.mobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {customer.isGuestCustomer && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                      Guest
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[customer.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                  <Link
                    href={`/customers/${customer.id}?tenantId=${tenantId}&storeId=${storeId}`}
                    title="Manage addresses"
                    className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/customers/${customer.id}/edit?tenantId=${tenantId}&storeId=${storeId}`}
                    title="Edit customer"
                    className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={deletingId === customer.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default function CustomerListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <CustomerListPageContent />
    </Suspense>
  );
}
