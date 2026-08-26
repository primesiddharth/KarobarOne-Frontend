"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, UserX } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { guestCheckoutApi } from "@/lib/api/customer-extras";
import { ApiError } from "@/lib/api-client";
import { GuestCheckoutLog } from "@/types/customer-extras";

function GuestCheckoutsPageContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [logs, setLogs] = useState<GuestCheckoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestMobile, setGuestMobile] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!token) return;
    guestCheckoutApi
      .list(token)
      .then(setLogs)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !tenantId || !storeId || !guestName.trim() || !guestEmail.trim() || !guestMobile.trim())
      return;
    setIsCreating(true);
    try {
      const created = await guestCheckoutApi.create(
        { tenantId, storeId, guestName: guestName.trim(), guestEmail: guestEmail.trim(), guestMobile: guestMobile.trim() },
        token
      );
      setLogs((prev) => [created, ...prev]);
      setGuestName("");
      setGuestEmail("");
      setGuestMobile("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(logId: string) {
    if (!token) return;
    setDeletingId(logId);
    try {
      await guestCheckoutApi.remove(logId, token);
      setLogs((prev) => prev.filter((l) => l.id !== logId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href={`/customers?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Guest Checkouts</h1>
        <p className="text-gray-500 mb-6">
          Orders placed by customers who checked out without creating an account.
        </p>

        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-3 mb-6"
        >
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Guest name"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <input
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="Email"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <div className="flex gap-2">
            <input
              value={guestMobile}
              onChange={(e) => setGuestMobile(e.target.value)}
              placeholder="Mobile"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="bg-[#5b4ef9] text-white px-3 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading guest checkouts...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <UserX className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No guest checkouts yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-gray-900">{log.guestName}</p>
                  <p className="text-sm text-gray-500">
                    {log.guestEmail} · {log.guestMobile}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  disabled={deletingId === log.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default function GuestCheckoutsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <GuestCheckoutsPageContent />
    </Suspense>
  );
}
