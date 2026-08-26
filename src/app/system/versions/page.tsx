"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, History, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { entityVersionApi } from "@/lib/api/system-extras";
import { ApiError } from "@/lib/api-client";
import { EntityVersion } from "@/types/system-extras";

// Usage: /system/versions?entityType=PRODUCT&entityId=<id>&tenantId=<id>&storeId=<id>
function EntityVersionsPageContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const entityType = searchParams.get("entityType") || "";
  const entityId = searchParams.get("entityId") || "";
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [versions, setVersions] = useState<EntityVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !entityType || !entityId) return;
    setIsLoading(true);
    try {
      const result = await entityVersionApi.listForEntity(entityType, entityId, token);
      setVersions(result.sort((a, b) => b.versionNumber - a.versionNumber));
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, entityType, entityId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRollback(versionId: string) {
    if (!token) return;
    if (!confirm("Roll back to this version? This will overwrite the current data.")) return;
    setBusyId(versionId);
    try {
      await entityVersionApi.rollback(versionId, token);
      alert("Rolled back successfully.");
      load();
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Version History</h1>
        <p className="text-gray-500 mb-6">
          {entityType ? `${entityType} · ${entityId}` : "No entity specified"}
        </p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No version history yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {versions.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-gray-900">Version {v.versionNumber}</p>
                  <p className="text-xs text-gray-400">
                    {v.isPublished ? "Published" : "Draft"}
                    {v.createdAt ? ` · ${new Date(v.createdAt).toLocaleString()}` : ""}
                  </p>
                </div>
                {!v.isPublished && (
                  <button
                    onClick={() => handleRollback(v.id)}
                    disabled={busyId === v.id}
                    className="inline-flex items-center gap-1.5 text-sm text-[#5b4ef9] hover:bg-[#5b4ef9]/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Roll back
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default function EntityVersionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <EntityVersionsPageContent />
    </Suspense>
  );
}
