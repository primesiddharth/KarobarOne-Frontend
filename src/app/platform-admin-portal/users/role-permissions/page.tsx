"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

import {
  getRoles,
  getPermissions,
  getRolePermissions,
  grantRolePermission,
  revokeRolePermission,
} from "@/lib/api/users";

import type {
  Role,
  Permission,
  RolePermission,
} from "@/types/users";

export default function RolePermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);

  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD ROLES + PERMISSIONS
  // ============================================================

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const [rolesData, permissionsData] = await Promise.all([
          getRoles(),
          getPermissions(),
        ]);

        setRoles(rolesData);
        setPermissions(permissionsData);

        if (rolesData.length > 0) {
          setSelectedRoleId(rolesData[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load roles and permissions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // ============================================================
  // LOAD ROLE PERMISSIONS
  // ============================================================

  useEffect(() => {
    if (!selectedRoleId) {
      setRolePermissions([]);
      return;
    }

    async function loadRolePermissions() {
      try {
        setLoadingPermissions(true);
        setError("");

        const data = await getRolePermissions(selectedRoleId);

        setRolePermissions(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load role permissions."
        );
      } finally {
        setLoadingPermissions(false);
      }
    }

    loadRolePermissions();
  }, [selectedRoleId]);

  // ============================================================
  // GRANT PERMISSION
  // ============================================================

  async function handleGrantPermission() {
    if (!selectedRoleId || !selectedPermissionId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const created = await grantRolePermission(selectedRoleId, {
        permissionId: selectedPermissionId,
      });

      setRolePermissions((current) => [...current, created]);

      setSelectedPermissionId("");
      setShowGrantModal(false);
      setSuccess("Permission granted successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to grant permission."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // REVOKE PERMISSION
  // ============================================================

  async function handleRevokePermission(mappingId: string) {
    if (!selectedRoleId) return;

    const confirmed = window.confirm(
      "Are you sure you want to revoke this permission?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await revokeRolePermission(selectedRoleId, mappingId);

      setRolePermissions((current) =>
        current.filter((item) => item.id !== mappingId)
      );

      setSuccess("Permission revoked successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to revoke permission."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  const selectedRole = roles.find(
    (role) => role.id === selectedRoleId
  );

  const assignedPermissionIds = new Set(
    rolePermissions.map((item) => item.permissionId)
  );

  const availablePermissions = permissions.filter(
    (permission) => !assignedPermissionIds.has(permission.id)
  );

  function getPermission(permissionId: string) {
    return permissions.find(
      (permission) => permission.id === permissionId
    );
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
            Loading roles and permissions...
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
                Role Permissions
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
                  <Shield className="size-6 text-[#5b4ef9]" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Access control
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Manage role permissions
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Grant or revoke permissions assigned to each platform
                    role.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGrantModal(true)}
                disabled={
                  !selectedRoleId ||
                  availablePermissions.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4ef9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4d40e8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="size-4" />
                Grant Permission
              </button>
            </div>
          </section>

          {/* Alerts */}
          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <X className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <Check className="mt-0.5 size-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Role selector */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3">
              <label
                htmlFor="role"
                className="text-sm font-semibold text-slate-900"
              >
                Select Role
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Choose a role to view and manage its permissions.
              </p>
            </div>

            <select
              id="role"
              value={selectedRoleId}
              onChange={(event) =>
                setSelectedRoleId(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10 sm:max-w-md"
            >
              {roles.length === 0 && (
                <option value="">No roles available</option>
              )}

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                  {role.roleCode ? ` (${role.roleCode})` : ""}
                </option>
              ))}
            </select>
          </section>

          {/* Selected role */}
          {selectedRole && (
            <section className="mt-6">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Selected role
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-950">
                    {selectedRole.roleName}
                  </h2>

                  {selectedRole.description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedRole.description}
                    </p>
                  )}
                </div>

                <div className="text-sm text-slate-500">
                  {rolePermissions.length} permission
                  {rolePermissions.length === 1 ? "" : "s"} assigned
                </div>
              </div>

              {/* Permission list */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {loadingPermissions ? (
                  <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
                    <Loader2 className="size-5 animate-spin text-[#5b4ef9]" />
                    Loading permissions...
                  </div>
                ) : rolePermissions.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Shield className="size-6 text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                      No permissions assigned
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Grant a permission to this role to get started.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowGrantModal(true)}
                      disabled={availablePermissions.length === 0}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5b4ef9] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="size-4" />
                      Grant Permission
                    </button>
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
                              Mapping ID
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {rolePermissions.map((mapping) => {
                            const permission = getPermission(
                              mapping.permissionId
                            );

                            return (
                              <tr
                                key={mapping.id}
                                className="transition hover:bg-slate-50"
                              >
                                <td className="px-6 py-4">
                                  <div className="font-medium text-slate-900">
                                    {permission?.permissionName ??
                                      mapping.permissionId}
                                  </div>

                                  {permission?.description && (
                                    <div className="mt-1 max-w-md text-sm text-slate-500">
                                      {permission.description}
                                    </div>
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700">
                                    {permission?.permissionCode ?? "—"}
                                  </code>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {mapping.id}
                                </td>

                                <td className="px-6 py-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRevokePermission(
                                        mapping.id
                                      )
                                    }
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Trash2 className="size-4" />
                                    Revoke
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile */}
                    <div className="divide-y divide-slate-100 md:hidden">
                      {rolePermissions.map((mapping) => {
                        const permission = getPermission(
                          mapping.permissionId
                        );

                        return (
                          <div
                            key={mapping.id}
                            className="p-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900">
                                  {permission?.permissionName ??
                                    mapping.permissionId}
                                </h3>

                                {permission?.permissionCode && (
                                  <code className="mt-2 inline-block rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700">
                                    {permission.permissionCode}
                                  </code>
                                )}

                                {permission?.description && (
                                  <p className="mt-2 text-sm leading-5 text-slate-500">
                                    {permission.description}
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRevokePermission(
                                    mapping.id
                                  )
                                }
                                disabled={saving}
                                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Revoke permission"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Grant Permission Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Role access
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  Grant Permission
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Select a permission to assign to{" "}
                  <span className="font-medium text-slate-700">
                    {selectedRole?.roleName}
                  </span>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowGrantModal(false);
                  setSelectedPermissionId("");
                }}
                className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6">
              {availablePermissions.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    All permissions are already assigned.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    There are no additional permissions to grant.
                  </p>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="permission"
                    className="text-sm font-semibold text-slate-900"
                  >
                    Permission
                  </label>

                  <select
                    id="permission"
                    value={selectedPermissionId}
                    onChange={(event) =>
                      setSelectedPermissionId(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                  >
                    <option value="">
                      Select a permission
                    </option>

                    {availablePermissions.map((permission) => (
                      <option
                        key={permission.id}
                        value={permission.id}
                      >
                        {permission.permissionName}
                        {permission.permissionCode
                          ? ` (${permission.permissionCode})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowGrantModal(false);
                  setSelectedPermissionId("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              {availablePermissions.length > 0 && (
                <button
                  type="button"
                  onClick={handleGrantPermission}
                  disabled={
                    saving || !selectedPermissionId
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4ef9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d40e8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="size-4 animate-spin" />
                  )}

                  Grant Permission
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}