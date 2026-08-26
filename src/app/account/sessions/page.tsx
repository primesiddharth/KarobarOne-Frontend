"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { userSessionApi } from "@/lib/api/system-extras";
import { getUserIdFromToken } from "@/lib/jwt";
import { ApiError } from "@/lib/api-client";
import { UserSession } from "@/types/system-extras";

export default function ActiveSessionsPage() {
  const { token } = useAuth();
  const userId = getUserIdFromToken(token);

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endingId, setEndingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !userId) return;
    setIsLoading(true);
    try {
      const result = await userSessionApi.list(userId, token);
      setSessions(result);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleEnd(sessionId: string) {
    if (!token || !userId) return;
    setEndingId(sessionId);
    try {
      await userSessionApi.end(userId, sessionId, token);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setEndingId(null);
    }
  }

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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Active Sessions</h1>
        <p className="text-gray-500 mb-6">
          Devices currently logged into your account.
        </p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Monitor className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active sessions found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#5b4ef9]/10 flex items-center justify-center">
                    <Monitor className="w-4 h-4 text-[#5b4ef9]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{session.userAgent || "Unknown device"}</p>
                    <p className="text-xs text-gray-500">
                      {session.ipAddress || "Unknown IP"} · Logged in{" "}
                      {new Date(session.loginAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleEnd(session.id)}
                  disabled={endingId === session.id}
                  className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  End
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}