"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2, History } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { statusHistoryApi } from "@/lib/api/system-logs";
import { ApiError } from "@/lib/api-client";
import { StatusHistoryEntry } from "@/types/system-logs";

function StatusHistoryContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [entries, setEntries] = useState<StatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    statusHistoryApi
      .list(token)
      .then(setEntries)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(historyId: string) {
    if (!token) return;
    setDeletingId(historyId);
    try {
      await statusHistoryApi.remove(historyId, token);
      setEntries((prev) => prev.filter((e) => e.id !== historyId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/catalog/products?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Status History</h1>
        <p className="text-gray-500 mb-6">Status transitions across your entities.</p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading status history...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No status history yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm text-gray-900">
                    {entry.entityType}: {entry.oldStatus || "—"} → {entry.newStatus}
                  </p>
                  {entry.changeReason && (
                    <p className="text-xs text-gray-500">{entry.changeReason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
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

export default function StatusHistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <StatusHistoryContent />
    </Suspense>
  );
}