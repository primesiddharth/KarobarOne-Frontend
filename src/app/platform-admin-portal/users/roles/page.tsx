"use client";

import { useEffect, useState } from "react";

type Role = {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
};

type RoleForm = {
  roleName: string;
  roleCode: string;
  description: string;
  isSystemRole: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const initialForm: RoleForm = {
  roleName: "",
  roleCode: "",
  description: "",
  isSystemRole: false,
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [form, setForm] = useState<RoleForm>(initialForm);
  const [error, setError] = useState("");

  // -----------------------------
  // GET /api/v1/roles/
  // -----------------------------
  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/v1/roles/`);

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();

      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // -----------------------------
  // Open Create Modal
  // -----------------------------
  const openCreateModal = () => {
    setEditingRole(null);
    setForm(initialForm);
    setError("");
    setModalOpen(true);
  };

  // -----------------------------
  // Open Edit Modal
  // -----------------------------
  const openEditModal = (role: Role) => {
    setEditingRole(role);

    setForm({
      roleName: role.roleName || "",
      roleCode: role.roleCode || "",
      description: role.description || "",
      isSystemRole: role.isSystemRole || false,
    });

    setError("");
    setModalOpen(true);
  };

  // -----------------------------
  // Close Modal
  // -----------------------------
  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingRole(null);
    setForm(initialForm);
    setError("");
  };

  // -----------------------------
  // Form Change
  // -----------------------------
  const handleChange = (
    field: keyof RoleForm,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // -----------------------------
  // POST /api/v1/roles/
  // PATCH /api/v1/roles/{roleId}
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.roleName.trim()) {
      setError("Role name is required.");
      return;
    }

    if (!form.roleCode.trim()) {
      setError("Role code is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEdit = Boolean(editingRole);

      const url = isEdit
        ? `${API_BASE_URL}/api/v1/roles/${editingRole?.id}`
        : `${API_BASE_URL}/api/v1/roles/`;

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleName: form.roleName.trim(),
          roleCode: form.roleCode.trim(),
          description: form.description.trim(),
          isSystemRole: form.isSystemRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save role");
      }

      closeModal();
      await fetchRoles();
    } catch (err) {
      console.error(err);
      setError(
        editingRole
          ? "Unable to update role."
          : "Unable to create role."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // DELETE /api/v1/roles/{roleId}
  // -----------------------------
  const handleDelete = async (role: Role) => {
    if (role.isSystemRole) {
      alert("System roles cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${role.roleName}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/roles/${role.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete role");
      }

      await fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Unable to delete role.");
    }
  };

  // -----------------------------
  // Date formatter
  // -----------------------------
  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Roles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage platform roles and access levels.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Create Role
        </button>
      </div>

      {/* Error */}
      {error && !modalOpen && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role Code
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  System Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created At
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Loading roles...
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <div className="text-sm font-medium text-gray-700">
                      No roles found
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Create your first role to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr
                    key={role.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Role Name */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {role.roleName}
                      </div>
                    </td>

                    {/* Role Code */}
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                        {role.roleCode}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="max-w-[280px] px-6 py-4">
                      <span className="line-clamp-2 text-sm text-gray-600">
                        {role.description || "—"}
                      </span>
                    </td>

                    {/* System Role */}
                    <td className="px-6 py-4">
                      {role.isSystemRole ? (
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          System
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          Custom
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(role.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(role)}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(role)}
                          disabled={role.isSystemRole}
                          className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                            role.isSystemRole
                              ? "cursor-not-allowed border-gray-100 text-gray-300"
                              : "border-red-200 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingRole ? "Edit Role" : "Create Role"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingRole
                    ? "Update role information."
                    : "Create a new platform role."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-6 py-6">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Role Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Role Name
                  </label>

                  <input
                    type="text"
                    value={form.roleName}
                    onChange={(e) =>
                      handleChange("roleName", e.target.value)
                    }
                    placeholder="e.g. Store Manager"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Role Code */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Role Code
                  </label>

                  <input
                    type="text"
                    value={form.roleCode}
                    onChange={(e) =>
                      handleChange("roleCode", e.target.value)
                    }
                    placeholder="e.g. STORE_MANAGER"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Describe what this role can access..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* System Role */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isSystemRole}
                    onChange={(e) =>
                      handleChange(
                        "isSystemRole",
                        e.target.checked
                      )
                    }
                    disabled={editingRole?.isSystemRole}
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      System Role
                    </div>

                    <p className="text-xs text-gray-500">
                      System roles are protected from deletion.
                    </p>
                  </div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingRole
                    ? "Update Role"
                    : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}