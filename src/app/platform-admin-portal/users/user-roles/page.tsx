"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  assignUserRole,
  getRoles,
  getUserRoles,
  getUsers,
  revokeUserRole,
} from "@/lib/api/users";

import type {
  CreateUserRolePayload,
  Role,
  User,
  UserRole,
} from "@/types/users";

export default function UserRolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const [selectedUserId, setSelectedUserId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [assignedBy, setAssignedBy] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD USERS + ROLES
  // ============================================================

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getRoles(),
        ]);

        setUsers(usersData);
        setRoles(rolesData);

        if (usersData.length > 0) {
          setSelectedUserId(usersData[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load users and roles."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // ============================================================
  // LOAD USER ROLES
  // ============================================================

  useEffect(() => {
    if (!selectedUserId) {
      setUserRoles([]);
      return;
    }

    async function loadUserRoles() {
      try {
        setLoadingRoles(true);
        setError("");

        const data = await getUserRoles(selectedUserId);

        setUserRoles(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load user roles."
        );
      } finally {
        setLoadingRoles(false);
      }
    }

    loadUserRoles();
  }, [selectedUserId]);

  // ============================================================
  // ASSIGN ROLE
  // ============================================================

  async function handleAssignRole(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }

    if (!selectedRoleId) {
      setError("Please select a role.");
      return;
    }

    if (!tenantId.trim()) {
      setError("Tenant ID is required.");
      return;
    }

    if (!assignedBy.trim()) {
      setError("Assigned By is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: CreateUserRolePayload = {
        roleId: selectedRoleId,
        tenantId: tenantId.trim(),
        assignedBy: assignedBy.trim(),
      };

      const created = await assignUserRole(
        selectedUserId,
        payload
      );

      setUserRoles((current) => [...current, created]);

      setSelectedRoleId("");
      setTenantId("");
      setAssignedBy("");

      setShowAssignModal(false);

      setSuccess("Role assigned successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to assign role."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // REVOKE ROLE
  // ============================================================

  async function handleRevokeRole(mappingId: string) {
    if (!selectedUserId) return;

    const confirmed = window.confirm(
      "Are you sure you want to revoke this role?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await revokeUserRole(
        selectedUserId,
        mappingId
      );

      setUserRoles((current) =>
        current.filter((item) => item.id !== mappingId)
      );

      setSuccess("Role revoked successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to revoke role."
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

  const assignedRoleIds = new Set(
    userRoles.map((item) => item.roleId)
  );

  const availableRoles = roles.filter(
    (role) => !assignedRoleIds.has(role.id)
  );

  function getRole(roleId: string) {
    return roles.find((role) => role.id === roleId);
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
            Loading users and roles...
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
                User Roles
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
                  <ShieldCheck className="size-6 text-[#5b4ef9]" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Access control
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Manage user roles
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Assign roles to users and revoke existing role
                    assignments.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowAssignModal(true);
                }}
                disabled={
                  !selectedUserId ||
                  availableRoles.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b4ef9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4d40e8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="size-4" />
                Assign Role
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
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <Check className="size-4" />
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
                  Choose a user to manage their assigned roles.
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

          {/* Selected user */}
          {selectedUser && (
            <section className="mt-6">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
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

                <div className="text-sm text-slate-500">
                  {userRoles.length} role
                  {userRoles.length === 1 ? "" : "s"} assigned
                </div>
              </div>

              {/* Roles list */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {loadingRoles ? (
                  <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
                    <Loader2 className="size-5 animate-spin text-[#5b4ef9]" />
                    Loading user roles...
                  </div>
                ) : userRoles.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                      <ShieldCheck className="size-6 text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                      No roles assigned
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Assign a role to this user to get started.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAssignModal(true)
                      }
                      disabled={availableRoles.length === 0}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5b4ef9] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="size-4" />
                      Assign Role
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
                              Role
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Tenant ID
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Assigned By
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Assigned At
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {userRoles.map((mapping) => {
                            const role = getRole(mapping.roleId);

                            return (
                              <tr
                                key={mapping.id}
                                className="transition hover:bg-slate-50"
                              >
                                <td className="px-6 py-4">
                                  <div className="font-medium text-slate-900">
                                    {role?.roleName ??
                                      mapping.roleId}
                                  </div>

                                  {role?.roleCode && (
                                    <code className="mt-1 inline-block rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                      {role.roleCode}
                                    </code>
                                  )}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {mapping.tenantId}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {mapping.assignedBy}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {new Date(
                                    mapping.assignedAt
                                  ).toLocaleString()}
                                </td>

                                <td className="px-6 py-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRevokeRole(
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
                      {userRoles.map((mapping) => {
                        const role = getRole(mapping.roleId);

                        return (
                          <div
                            key={mapping.id}
                            className="p-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900">
                                  {role?.roleName ??
                                    mapping.roleId}
                                </h3>

                                {role?.roleCode && (
                                  <code className="mt-2 inline-block rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                    {role.roleCode}
                                  </code>
                                )}

                                <div className="mt-4 space-y-2 text-sm">
                                  <p className="text-slate-500">
                                    <span className="font-medium text-slate-700">
                                      Tenant:
                                    </span>{" "}
                                    {mapping.tenantId}
                                  </p>

                                  <p className="text-slate-500">
                                    <span className="font-medium text-slate-700">
                                      Assigned by:
                                    </span>{" "}
                                    {mapping.assignedBy}
                                  </p>

                                  <p className="text-slate-500">
                                    <span className="font-medium text-slate-700">
                                      Assigned:
                                    </span>{" "}
                                    {new Date(
                                      mapping.assignedAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRevokeRole(
                                    mapping.id
                                  )
                                }
                                disabled={saving}
                                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Revoke role"
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

      {/* ========================================================
          ASSIGN ROLE MODAL
      ======================================================== */}

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  User access
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  Assign Role
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Assign a role to{" "}
                  <span className="font-medium text-slate-700">
                    {selectedUser?.firstName}{" "}
                    {selectedUser?.lastName}
                  </span>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedRoleId("");
                  setTenantId("");
                  setAssignedBy("");
                }}
                className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleAssignRole}
              className="mt-6 space-y-5"
            >
              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="text-sm font-semibold text-slate-900"
                >
                  Role
                </label>

                <select
                  id="role"
                  value={selectedRoleId}
                  onChange={(event) =>
                    setSelectedRoleId(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                >
                  <option value="">
                    Select a role
                  </option>

                  {availableRoles.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.roleName}
                      {role.roleCode
                        ? ` (${role.roleCode})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tenant ID */}
              <div>
                <label
                  htmlFor="tenantId"
                  className="text-sm font-semibold text-slate-900"
                >
                  Tenant ID
                </label>

                <input
                  id="tenantId"
                  type="text"
                  value={tenantId}
                  onChange={(event) =>
                    setTenantId(event.target.value)
                  }
                  placeholder="Enter tenant ID"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                />
              </div>

              {/* Assigned By */}
              <div>
                <label
                  htmlFor="assignedBy"
                  className="text-sm font-semibold text-slate-900"
                >
                  Assigned By
                </label>

                <input
                  id="assignedBy"
                  type="text"
                  value={assignedBy}
                  onChange={(event) =>
                    setAssignedBy(event.target.value)
                  }
                  placeholder="Enter assigner ID"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedRoleId("");
                    setTenantId("");
                    setAssignedBy("");
                  }}
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

                  Assign Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}