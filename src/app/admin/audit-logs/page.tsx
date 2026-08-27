"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, FileClock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { auditLogApi } from "@/lib/api/system-logs";
import { ApiError } from "@/lib/api-client";
import { AuditLog } from "@/types/system-logs";

function AuditLogsContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    auditLogApi
      .list(token)
      .then(setLogs)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href={`/catalog/products?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Audit Logs</h1>
        <p className="text-gray-500 mb-6">A record of changes made across your data.</p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileClock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No audit logs yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">
                    {log.actionType} · {log.entityType}
                  </p>
                  {log.createdAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {log.entityId}
                  {log.performedBy ? ` · by ${log.performedBy}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <AuditLogsContent />
    </Suspense>
  );
}