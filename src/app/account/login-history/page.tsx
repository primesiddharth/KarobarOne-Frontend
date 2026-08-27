"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getUserIdFromToken } from "@/lib/jwt";
import { loginHistoryApi } from "@/lib/api/system-logs";
import { ApiError } from "@/lib/api-client";
import { LoginHistoryEntry } from "@/types/system-logs";

function LoginHistoryContent() {
  const { token } = useAuth();
  const userId = getUserIdFromToken(token);

  const [entries, setEntries] = useState<LoginHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !userId) return;
    loginHistoryApi
      .listForUser(userId, token)
      .then(setEntries)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Login History</h1>
        <p className="text-gray-500 mb-6">Recent sign-in attempts on your account.</p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading login history...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No login history yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {entry.loginStatus === "SUCCESS" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm text-gray-900">
                      {entry.ipAddress || "Unknown IP"}
                    </p>
                    {entry.failureReason && (
                      <p className="text-xs text-red-500">{entry.failureReason}</p>
                    )}
                  </div>
                </div>
                {entry.createdAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginHistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <LoginHistoryContent />
    </Suspense>
  );
}