"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  ShieldOff,
  UserRound,
} from "lucide-react";

import {
  getUserSecuritySettings,
  getUsers,
  updateUserSecuritySettings,
} from "@/lib/api/users";

import type {
  User,
  UserSecuritySettings,
} from "@/types/users";

export default function SecurityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [settings, setSettings] =
    useState<UserSecuritySettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [saving, setSaving] = useState(false);

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
  // LOAD SECURITY SETTINGS
  // ============================================================

  useEffect(() => {
    if (!selectedUserId) {
      setSettings(null);
      return;
    }

    async function loadSecuritySettings() {
      try {
        setLoadingSettings(true);
        setError("");
        setSuccess("");

        const data = await getUserSecuritySettings(
          selectedUserId
        );

        setSettings(data);
      } catch (err) {
        setSettings(null);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load security settings."
        );
      } finally {
        setLoadingSettings(false);
      }
    }

    loadSecuritySettings();
  }, [selectedUserId]);

  // ============================================================
  // UPDATE 2FA
  // ============================================================

  async function handleTwoFactorChange(
    enabled: boolean
  ) {
    if (!selectedUserId || !settings) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateUserSecuritySettings(
        selectedUserId,
        {
          twoFactorEnabled: enabled,
        }
      );

      setSettings(updated);

      setSuccess(
        enabled
          ? "Two-factor authentication enabled successfully."
          : "Two-factor authentication disabled successfully."
      );

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update security settings."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  const selectedUser = users.find(
    (user) => user.id === selectedUserId
  );

  function formatDate(value: string | null) {
    if (!value) return "Never";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
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
                Security
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
                <LockKeyhole className="size-6 text-[#5b4ef9]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Account protection
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  User security settings
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Review account security information and manage
                  two-factor authentication for users.
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
                  Choose a user to view their security settings.
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

          {/* Security content */}
          {selectedUser && (
            <section className="mt-6">
              {/* User summary */}
              <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Selected user
                </p>

                <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      {selectedUser.firstName}{" "}
                      {selectedUser.lastName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedUser.email}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400">
                    User ID: {selectedUser.id}
                  </p>
                </div>
              </div>

              {loadingSettings ? (
                <div className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-12 text-sm text-slate-500 shadow-sm">
                  <Loader2 className="size-5 animate-spin text-[#5b4ef9]" />
                  Loading security settings...
                </div>
              ) : settings ? (
                <div className="space-y-5">
                  {/* 2FA */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                            settings.twoFactorEnabled
                              ? "bg-emerald-50"
                              : "bg-slate-100"
                          }`}
                        >
                          {settings.twoFactorEnabled ? (
                            <ShieldCheck className="size-5 text-emerald-600" />
                          ) : (
                            <ShieldOff className="size-5 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Two-factor authentication
                          </h3>

                          <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
                            Add an additional authentication layer
                            to protect this user account.
                          </p>

                          <div className="mt-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                settings.twoFactorEnabled
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {settings.twoFactorEnabled
                                ? "Enabled"
                                : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          handleTwoFactorChange(
                            !settings.twoFactorEnabled
                          )
                        }
                        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          settings.twoFactorEnabled
                            ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                            : "bg-[#5b4ef9] text-white hover:bg-[#4d40e8]"
                        }`}
                      >
                        {saving && (
                          <Loader2 className="size-4 animate-spin" />
                        )}

                        {settings.twoFactorEnabled
                          ? "Disable 2FA"
                          : "Enable 2FA"}
                      </button>
                    </div>
                  </div>

                  {/* Security stats */}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Failed login count */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Failed login attempts
                      </p>

                      <p className="mt-3 text-3xl font-semibold text-slate-950">
                        {settings.failedLoginCount}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Recorded failed login attempts
                      </p>
                    </div>

                    {/* Account locked */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Account lock
                      </p>

                      <p
                        className={`mt-3 text-lg font-semibold ${
                          settings.accountLockedUntil
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {settings.accountLockedUntil
                          ? "Locked"
                          : "Not locked"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {settings.accountLockedUntil
                          ? `Until ${formatDate(
                              settings.accountLockedUntil
                            )}`
                          : "No active account lock"}
                      </p>
                    </div>

                    {/* Password changed */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Password changed
                      </p>

                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        {formatDate(
                          settings.passwordChangedAt
                        )}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Last password change
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Security record
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Security Settings ID
                        </p>

                        <p className="mt-1 break-all text-sm text-slate-700">
                          {settings.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          User ID
                        </p>

                        <p className="mt-1 break-all text-sm text-slate-700">
                          {settings.userId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Created At
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(settings.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Updated At
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {formatDate(settings.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <LockKeyhole className="mx-auto size-8 text-slate-400" />

                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    Security settings unavailable
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    No security settings could be loaded for this
                    user.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}