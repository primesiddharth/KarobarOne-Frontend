"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Rocket, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { websiteDeploymentApi, websitePublishLogApi } from "@/lib/api/system-logs";
import { ApiError } from "@/lib/api-client";
import { WebsiteDeployment, WebsitePublishLog } from "@/types/system-logs";

const STATUS_ICON: Record<string, React.ReactNode> = {
  SUCCESS: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  FAILED: <XCircle className="w-4 h-4 text-red-600" />,
  PENDING: <Clock className="w-4 h-4 text-yellow-600" />,
};

function DeploymentsContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [deployments, setDeployments] = useState<WebsiteDeployment[]>([]);
  const [publishLogs, setPublishLogs] = useState<WebsitePublishLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !storeId) return;
    Promise.all([
      websiteDeploymentApi.listByStore(storeId, token),
      websitePublishLogApi.listByStore(storeId, token),
    ])
      .then(([d, p]) => {
        setDeployments(d);
        setPublishLogs(p);
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, storeId]);

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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Deployments</h1>
        <p className="text-gray-500 mb-6">Deployment and publish history for your website.</p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading deployments...</div>
        ) : (
          <>
            <h2 className="font-semibold text-gray-900 mb-3">Deployments</h2>
            {deployments.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-200 mb-8">
                <Rocket className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No deployments yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden mb-8">
                {deployments.map((d) => (
                  <div key={d.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {STATUS_ICON[d.status] || <Rocket className="w-4 h-4 text-gray-400" />}
                      <div>
                        <p className="text-sm text-gray-900">{d.provider}</p>
                        <p className="text-xs text-gray-500">{d.deploymentId || "—"}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{d.status}</span>
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-semibold text-gray-900 mb-3">Publish Logs</h2>
            {publishLogs.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                <Rocket className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No publish logs yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {publishLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm text-gray-900">
                        {log.action} {log.version ? `· v${log.version}` : ""}
                      </p>
                      {log.message && (
                        <p className="text-xs text-gray-500">{log.message}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{log.status}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DeploymentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <DeploymentsContent />
    </Suspense>
  );
}