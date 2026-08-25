"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { customerApi } from "@/lib/api/customer";
import { ApiError } from "@/lib/api-client";
import { Customer } from "@/types/customer";

export default function TrashedCustomersPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    customerApi
      .listTrash(token)
      .then((res) => setCustomers(res.data))
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleRestore(customerId: string) {
    if (!token) return;
    setRestoringId(customerId);
    try {
      await customerApi.restore(customerId, token);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/customers?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Trash</h1>
        <p className="text-gray-500 mb-6">Deleted customers — restore them here if needed.</p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading trash...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Trash2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Trash is empty.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-gray-900">
                    {customer.firstName} {customer.lastName || ""}
                  </p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
                <button
                  onClick={() => handleRestore(customer.id)}
                  disabled={restoringId === customer.id}
                  className="inline-flex items-center gap-1.5 text-sm text-[#5b4ef9] hover:bg-[#5b4ef9]/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}