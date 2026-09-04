"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  KeyRound,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";

import {
  createPermission,
  getPermission,
  getPermissions,
} from "@/lib/api/users";

import type {
  CreatePermissionPayload,
  Permission,
} from "@/types/users";

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<
    Permission[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const [form, setForm] = useState<CreatePermissionPayload>({
    permissionName: "",
    permissionCode: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD PERMISSIONS
  // ============================================================

  async function loadPermissions() {
    try {
      setLoading(true);
      setError("");

      const data = await getPermissions();

      setPermissions(data);
      setFilteredPermissions(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load permissions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPermissions();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      setFilteredPermissions(permissions);
      return;
    }

    const filtered = permissions.filter((permission) => {
      return (
        permission.permissionName.toLowerCase().includes(query) ||
        permission.permissionCode.toLowerCase().includes(query) ||
        permission.description.toLowerCase().includes(query)
      );
    });

    setFilteredPermissions(filtered);
  }, [search, permissions]);

  // ============================================================
  // CREATE PERMISSION
  // ============================================================

  async function handleCreatePermission(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.permissionName.trim()) {
      setError("Permission name is required.");
      return;
    }

    if (!form.permissionCode.trim()) {
      setError("Permission code is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const created = await createPermission({
        permissionName: form.permissionName.trim(),
        permissionCode: form.permissionCode.trim(),
        description: form.description.trim(),
      });

      setPermissions((current) => [created, ...current]);

      setForm({
        permissionName: "",
        permissionCode: "",
        description: "",
      });

      setShowCreateModal(false);
      setSuccess("Permission created successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create permission."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // VIEW PERMISSION
  // ============================================================

  async function handleViewPermission(permissionId: string) {
    try {
      setError("");

      const permission = await getPermission(permissionId);

      setSelectedPermission(permission);
      setShowDetailsModal(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load permission details."
      );
    }
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
            Loading permissions...
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
                Permissions
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
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#5b4ef9]/10">
                  <KeyRound className="size-6 text-[#5b4ef9]" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Access control
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Permission manager
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Manage the permissions available for roles and
                    platform access.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowCreateModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4ef9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4d40e8]"
              >
                <Plus className="size-4" />
                Create Permission
              </button>
            </div>
          </section>

          {/* Alerts */}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Search + Stats */}
          <section className="mt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Permission library
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  All permissions
                </h2>
              </div>

              <div className="text-sm text-slate-500">
                {permissions.length} permission
                {permissions.length === 1 ? "" : "s"}
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search permissions..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
              />
            </div>
          </section>

          {/* Permission list */}
          <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {filteredPermissions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                  <KeyRound className="size-6 text-slate-400" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {search
                    ? "No permissions found"
                    : "No permissions available"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {search
                    ? "Try a different search term."
                    : "Create your first permission to get started."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Permission
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Code
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Description
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredPermissions.map((permission) => (
                        <tr
                          key={permission.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">
                              {permission.permissionName}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700">
                              {permission.permissionCode}
                            </code>
                          </td>

                          <td className="max-w-md px-6 py-4 text-sm text-slate-500">
                            {permission.description || "—"}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                handleViewPermission(permission.id)
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
                            >
                              <Eye className="size-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {filteredPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900">
                            {permission.permissionName}
                          </h3>

                          <code className="mt-2 inline-block rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700">
                            {permission.permissionCode}
                          </code>

                          {permission.description && (
                            <p className="mt-2 text-sm leading-5 text-slate-500">
                              {permission.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleViewPermission(permission.id)
                          }
                          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
                          title="View permission"
                        >
                          <Eye className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* ========================================================
          CREATE MODAL
      ======================================================== */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Access control
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  Create Permission
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreatePermission}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="permissionName"
                  className="text-sm font-semibold text-slate-900"
                >
                  Permission Name
                </label>

                <input
                  id="permissionName"
                  type="text"
                  value={form.permissionName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      permissionName: event.target.value,
                    }))
                  }
                  placeholder="Manage Users"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="permissionCode"
                  className="text-sm font-semibold text-slate-900"
                >
                  Permission Code
                </label>

                <input
                  id="permissionCode"
                  type="text"
                  value={form.permissionCode}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      permissionCode: event.target.value,
                    }))
                  }
                  placeholder="users.manage"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-slate-900"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe what this permission allows."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4ef9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d40e8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Create Permission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DETAILS MODAL
      ======================================================== */}

      {showDetailsModal && selectedPermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Permission details
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {selectedPermission.permissionName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPermission(null);
                }}
                className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Permission ID
                </p>

                <p className="mt-1 break-all text-sm text-slate-800">
                  {selectedPermission.id}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Permission Code
                </p>

                <code className="mt-1 block text-sm text-slate-800">
                  {selectedPermission.permissionCode}
                </code>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {selectedPermission.description || "No description"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Created At
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {new Date(
                    selectedPermission.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPermission(null);
                }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}