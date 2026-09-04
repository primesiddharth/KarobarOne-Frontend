"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Store as StoreIcon,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  grantStoreStaffPermission,
  getStoreStaffPermissions,
  revokeStoreStaffPermission,
} from "@/lib/api/users";

import { storeApi } from "@/lib/api/store";

import type {
  StoreStaffPermission,
} from "@/types/users";

import type { Store } from "@/types/store";

export default function StorePermissionsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [permissions, setPermissions] = useState<
    StoreStaffPermission[]
  >([]);

  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const [permissionId, setPermissionId] = useState("");

  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingPermissions, setLoadingPermissions] =
    useState(false);
  const [saving, setSaving] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD STORES
  // ============================================================

  useEffect(() => {
    async function loadStores() {
      try {
        setLoadingStores(true);
        setError("");

        /*
         * tenantId is optional in storeApi.list().
         * Passing undefined loads the available stores.
         *
         * Replace the token source below with the same
         * authentication/token source already used in your app.
         */
        const data = await storeApi.list(undefined, "");

        setStores(data);

        if (data.length > 0) {
          setSelectedStoreId(data[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load stores."
        );
      } finally {
        setLoadingStores(false);
      }
    }

    loadStores();
  }, []);

  // ============================================================
  // LOAD STORE STAFF PERMISSIONS
  // ============================================================

  useEffect(() => {
    if (!selectedUserId || !selectedStoreId) {
      setPermissions([]);
      return;
    }

    async function loadPermissions() {
      try {
        setLoadingPermissions(true);
        setError("");
        setSuccess("");

        const data = await getStoreStaffPermissions(
          selectedUserId,
          selectedStoreId
        );

        setPermissions(data);
      } catch (err) {
        setPermissions([]);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load store permissions."
        );
      } finally {
        setLoadingPermissions(false);
      }
    }

    loadPermissions();
  }, [selectedUserId, selectedStoreId]);

  // ============================================================
  // GRANT PERMISSION
  // ============================================================

  async function handleGrantPermission() {
    if (!selectedUserId) {
      setError("Please enter/select a user.");
      return;
    }

    if (!selectedStoreId) {
      setError("Please select a store.");
      return;
    }

    if (!permissionId.trim()) {
      setError("Please enter a permission ID.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const newPermission = await grantStoreStaffPermission(
        selectedUserId,
        {
          storeId: selectedStoreId,
          permissionId: permissionId.trim(),
          grantedBy: selectedUserId,
        }
      );

      setPermissions((current) => [
        ...current,
        newPermission,
      ]);

      setPermissionId("");

      setSuccess("Store permission granted successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to grant store permission."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // REVOKE PERMISSION
  // ============================================================

  async function handleRevokePermission(
    recordId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this permission?"
    );

    if (!confirmed) return;

    try {
      setRevokingId(recordId);
      setError("");
      setSuccess("");

      await revokeStoreStaffPermission(
        selectedUserId,
        recordId
      );

      setPermissions((current) =>
        current.filter(
          (permission) => permission.id !== recordId
        )
      );

      setSuccess("Store permission revoked successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to revoke store permission."
      );
    } finally {
      setRevokingId(null);
    }
  }

  // ============================================================
  // SELECTED STORE
  // ============================================================

  const selectedStore = stores.find(
    (store) => store.id === selectedStoreId
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (loadingStores) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="size-5 animate-spin text-[#5b4ef9]" />
            Loading stores...
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
                Store Staff Permissions
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
                <ShieldCheck className="size-6 text-[#5b4ef9]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Store access
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Store staff permissions
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Grant and revoke store-level permissions for
                  individual users.
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

          {/* Controls */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* User ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  User ID
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={selectedUserId}
                    onChange={(event) =>
                      setSelectedUserId(event.target.value)
                    }
                    placeholder="Enter user ID"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  The user whose store access you want to manage.
                </p>
              </div>

              {/* Store */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Store
                </label>

                <div className="relative">
                  <StoreIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                  <select
                    value={selectedStoreId}
                    onChange={(event) =>
                      setSelectedStoreId(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                  >
                    {stores.length === 0 && (
                      <option value="">
                        No stores available
                      </option>
                    )}

                    {stores.map((store) => (
                      <option
                        key={store.id}
                        value={store.id}
                      >
                        {store.storeName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStore && (
                  <p className="mt-2 text-xs text-slate-400">
                    {selectedStore.storeSlug}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Grant Permission */}
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900">
                Grant Permission
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a store-level permission to the selected user.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                value={permissionId}
                onChange={(event) =>
                  setPermissionId(event.target.value)
                }
                placeholder="Enter permission ID"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
              />

              <button
                type="button"
                disabled={saving}
                onClick={handleGrantPermission}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4ef9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4d40e8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                Grant Permission
              </button>
            </div>
          </section>

          {/* Permissions */}
          <section className="mt-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Assigned access
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  Store Permissions
                </h2>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {permissions.length}{" "}
                {permissions.length === 1
                  ? "permission"
                  : "permissions"}
              </span>
            </div>

            {loadingPermissions ? (
              <div className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-12 text-sm text-slate-500 shadow-sm">
                <Loader2 className="size-5 animate-spin text-[#5b4ef9]" />
                Loading permissions...
              </div>
            ) : permissions.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <ShieldCheck className="mx-auto size-8 text-slate-400" />

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No permissions assigned
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  This user has no store-level permissions for
                  the selected store.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Permission ID
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Store ID
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Granted By
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Created At
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {permissions.map((permission) => (
                        <tr
                          key={permission.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 items-center justify-center rounded-xl bg-[#5b4ef9]/10">
                                <ShieldCheck className="size-4 text-[#5b4ef9]" />
                              </div>

                              <span className="text-sm font-medium text-slate-800">
                                {permission.permissionId}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600">
                              {permission.storeId}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600">
                              {permission.grantedBy}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-500">
                              {new Date(
                                permission.createdAt
                              ).toLocaleString()}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              disabled={
                                revokingId === permission.id
                              }
                              onClick={() =>
                                handleRevokePermission(
                                  permission.id
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {revokingId === permission.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}

                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}