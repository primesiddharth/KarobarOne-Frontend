"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Globe,
  Laptop,
  Loader2,
  LogOut,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  endUserSession,
  getUserSessions,
  getUsers,
} from "@/lib/api/users";

import type {
  User,
  UserSession,
} from "@/types/users";

export default function SessionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);

  const [selectedUserId, setSelectedUserId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [endingSessionId, setEndingSessionId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD USERS
  // ============================================================

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers();

        setUsers(data);

        if (data.length > 0) {
          setSelectedUserId(data[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load users."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // ============================================================
  // LOAD USER SESSIONS
  // ============================================================

  useEffect(() => {
    if (!selectedUserId) {
      setSessions([]);
      return;
    }

    async function loadSessions() {
      try {
        setLoadingSessions(true);
        setError("");
        setSuccess("");

        const data = await getUserSessions(selectedUserId);

        setSessions(data);
      } catch (err) {
        setSessions([]);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load user sessions."
        );
      } finally {
        setLoadingSessions(false);
      }
    }

    loadSessions();
  }, [selectedUserId]);

  // ============================================================
  // END SESSION
  // ============================================================

  async function handleEndSession(sessionId: string) {
    if (!selectedUserId) return;

    const confirmed = window.confirm(
      "Are you sure you want to end this session?"
    );

    if (!confirmed) return;

    try {
      setEndingSessionId(sessionId);
      setError("");
      setSuccess("");

      const updatedSession = await endUserSession(
        selectedUserId,
        sessionId
      );

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? updatedSession
            : session
        )
      );

      setSuccess("Session ended successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to end session."
      );
    } finally {
      setEndingSessionId(null);
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  const selectedUser = users.find(
    (user) => user.id === selectedUserId
  );

  const activeSessions = sessions.filter(
    (session) => session.isActive
  );

  const endedSessions = sessions.filter(
    (session) => !session.isActive
  );

  function formatDate(value: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  }

  function getBrowserName(userAgent: string) {
    if (/Edg/i.test(userAgent)) return "Microsoft Edge";
    if (/Chrome/i.test(userAgent)) return "Google Chrome";
    if (/Firefox/i.test(userAgent)) return "Mozilla Firefox";
    if (/Safari/i.test(userAgent)) return "Safari";
    if (/Opera|OPR/i.test(userAgent)) return "Opera";

    return "Unknown browser";
  }

  function getDeviceType(userAgent: string) {
    if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
      return "Mobile";
    }

    return "Desktop";
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="size-5 animate-spin text-[#5b4ef9]" />
            Loading users...
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/platform-admin-portal/users"
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              <ArrowLeft className="size-5" />
            </Link>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Users & Access
              </p>

              <h1 className="mt-1 text-xl font-semibold text-slate-950">
                User Sessions
              </h1>
            </div>
          </div>

          <Link
            href="/platform-admin-portal"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
          >
            Portal Home
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Intro */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#5b4ef9]/10">
                <Activity className="size-6 text-[#5b4ef9]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Account activity
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  User sessions
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  View active and previous sessions for users and
                  terminate active sessions when required.
                </p>
              </div>
            </div>
          </section>

          {/* Alerts */}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="size-4" />
              {success}
            </div>
          )}

          {/* User selector */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100">
                <UserRound className="size-5 text-slate-500" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Select User
                </h2>

                <p className="text-sm text-slate-500">
                  Choose a user to view their sessions.
                </p>
              </div>
            </div>

            <select
              value={selectedUserId}
              onChange={(event) =>
                setSelectedUserId(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
            >
              {users.length === 0 && (
                <option value="">No users available</option>
              )}

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} — {user.email}
                </option>
              ))}
            </select>
          </section>

          {/* Session content */}
          {selectedUser && (
            <section className="mt-6">
              {/* User summary */}
              <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Selected user
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-slate-950">
                      {selectedUser.firstName}{" "}
                      {selectedUser.lastName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="rounded-xl bg-emerald-50 px-4 py-2">
                      <p className="text-xs font-medium text-emerald-600">
                        Active
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-emerald-700">
                        {activeSessions.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-100 px-4 py-2">
                      <p className="text-xs font-medium text-slate-500">
                        Ended
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-slate-700">
                        {endedSessions.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {loadingSessions ? (
                <div className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-12 text-sm text-slate-500 shadow-sm">
                  <Loader2 className="size-5 animate-spin text-[#5b4ef9]" />
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <Activity className="mx-auto size-8 text-slate-400" />

                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    No sessions found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    This user does not have any recorded sessions.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  {/* Desktop */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                      <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Session
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            IP Address
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Device
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Login
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Logout
                          </th>

                          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {sessions.map((session) => (
                          <tr
                            key={session.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex size-9 items-center justify-center rounded-xl ${
                                    session.isActive
                                      ? "bg-emerald-50"
                                      : "bg-slate-100"
                                  }`}
                                >
                                  {session.isActive ? (
                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                  ) : (
                                    <XCircle className="size-4 text-slate-400" />
                                  )}
                                </div>

                                <div>
                                  <p className="font-medium text-slate-900">
                                    {session.isActive
                                      ? "Active session"
                                      : "Ended session"}
                                  </p>

                                  <span
                                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                      session.isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {session.isActive
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Globe className="size-4 text-slate-400" />
                                {session.ipAddress}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-start gap-2">
                                <Laptop className="mt-0.5 size-4 text-slate-400" />

                                <div>
                                  <p className="text-sm font-medium text-slate-700">
                                    {getDeviceType(
                                      session.userAgent
                                    )}
                                  </p>

                                  <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                                    {getBrowserName(
                                      session.userAgent
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock3 className="size-4 text-slate-400" />
                                {formatDate(session.loginAt)}
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                              {formatDate(session.logoutAt)}
                            </td>

                            <td className="px-6 py-4 text-right">
                              {session.isActive ? (
                                <button
                                  type="button"
                                  disabled={
                                    endingSessionId === session.id
                                  }
                                  onClick={() =>
                                    handleEndSession(session.id)
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {endingSessionId ===
                                  session.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <LogOut className="size-4" />
                                  )}

                                  End Session
                                </button>
                              ) : (
                                <span className="text-xs font-medium text-slate-400">
                                  Already ended
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="divide-y divide-slate-100 md:hidden">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                session.isActive
                                  ? "bg-emerald-50"
                                  : "bg-slate-100"
                              }`}
                            >
                              {session.isActive ? (
                                <CheckCircle2 className="size-5 text-emerald-600" />
                              ) : (
                                <XCircle className="size-5 text-slate-400" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900">
                                {session.isActive
                                  ? "Active session"
                                  : "Ended session"}
                              </h3>

                              <span
                                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  session.isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {session.isActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </div>

                          {session.isActive && (
                            <button
                              type="button"
                              disabled={
                                endingSessionId === session.id
                              }
                              onClick={() =>
                                handleEndSession(session.id)
                              }
                              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              title="End session"
                            >
                              {endingSessionId ===
                              session.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <LogOut className="size-4" />
                              )}
                            </button>
                          )}
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              IP Address
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {session.ipAddress}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Device
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {getDeviceType(
                                session.userAgent
                              )}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {getBrowserName(
                                session.userAgent
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Login At
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {formatDate(session.loginAt)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Logout At
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                              {formatDate(session.logoutAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            User Agent
                          </p>

                          <p className="mt-1 break-all text-xs leading-5 text-slate-500">
                            {session.userAgent}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}