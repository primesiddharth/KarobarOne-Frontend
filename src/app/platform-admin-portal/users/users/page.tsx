"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users as UsersIcon,
  X,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/lib/api/users";

import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "@/types/users";

export default function UsersPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);

  const limit = 20;

  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState<CreateUserPayload>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    whatsappMobile: "",
    password: "",
  });

  const [editForm, setEditForm] = useState<UpdateUserPayload>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    whatsappMobile: "",
    isActive: true,
  });

  // ============================================
  // LOAD USERS
  // ============================================

  async function loadUsers() {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getUsers(
        {
          skip,
          limit,
        },
        token
      );

      setUsers(data);
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

  useEffect(() => {
    if (!authLoading) {
      loadUsers();
    }
  }, [token, authLoading, skip]);

  // ============================================
  // CREATE USER
  // ============================================

  function openCreateModal() {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      whatsappMobile: "",
      password: "",
    });

    setError("");
    setShowCreate(true);
  }

  async function handleCreateUser(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!token) {
      setError("Please login to access Users.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createUser(form, token);

      setShowCreate(false);
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create user."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================
  // EDIT USER
  // ============================================

  function openEditModal(user: User) {
    setEditingUser(user);

    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      whatsappMobile: user.whatsappMobile,
      isActive: user.isActive,
    });

    setError("");
  }

  async function handleUpdateUser(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!token || !editingUser) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateUser(
        editingUser.id,
        editForm,
        token
      );

      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================
  // DELETE USER
  // ============================================

  async function handleDeleteUser(user: User) {
    if (!token) {
      setError("Please login to access Users.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(user.id);
      setError("");

      await deleteUser(user.id, token);

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ============================================
  // SEARCH
  // ============================================

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.firstName?.toLowerCase().includes(value) ||
      user.lastName?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.mobile?.toLowerCase().includes(value)
    );
  });

  // ============================================
  // AUTH LOADING
  // ============================================

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="size-7 animate-spin text-[#5b4ef9]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/platform-admin-portal/users"
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
            >
              <ArrowLeft className="size-5" />
            </a>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Users & Access
              </p>

              <h1 className="mt-1 text-xl font-semibold text-slate-950">
                Users
              </h1>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5b4ef9] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4c40e8]"
          >
            <Plus className="size-4" />
            Create User
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* INTRO */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#5b4ef9]/10">
                <UsersIcon className="size-6 text-[#5b4ef9]" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  User Management
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create, view, update and manage platform users.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              {users.length} Users
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button onClick={() => setError("")}>
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* USERS */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* TOOLBAR */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                All Users
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage registered users.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
              />
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="size-7 animate-spin text-[#5b4ef9]" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100">
                <UserPlus className="size-6 text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try a different search."
                  : "Create your first user."}
              </p>

              {!search && (
                <button
                  onClick={openCreateModal}
                  className="mt-4 rounded-xl bg-[#5b4ef9] px-4 py-2 text-sm font-medium text-white"
                >
                  Create User
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {user.id}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {user.email}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {user.mobile || "No mobile"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              user.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {user.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openEditModal(user)
                              }
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-[#5b4ef9]/30 hover:text-[#5b4ef9]"
                              title="Edit user"
                            >
                              <Edit className="size-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteUser(user)
                              }
                              disabled={
                                deletingId === user.id
                              }
                              className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              title="Delete user"
                            >
                              {deletingId === user.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.firstName} {user.lastName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {user.mobile || "No mobile"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600"
                      >
                        <Edit className="size-4" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteUser(user)
                        }
                        disabled={deletingId === user.id}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-100 px-4 py-2 text-sm font-medium text-red-500"
                      >
                        {deletingId === user.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                <button
                  disabled={skip === 0}
                  onClick={() =>
                    setSkip(Math.max(0, skip - limit))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-500">
                  Page {Math.floor(skip / limit) + 1}
                </span>

                <button
                  disabled={users.length < limit}
                  onClick={() => setSkip(skip + limit)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      {/* ============================================
          CREATE USER MODAL
          ============================================ */}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Create User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new platform user.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateUser}
              className="space-y-4 p-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  value={form.firstName}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      firstName: value,
                    })
                  }
                  required
                />

                <Input
                  label="Last Name"
                  value={form.lastName}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      lastName: value,
                    })
                  }
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm({
                    ...form,
                    email: value,
                  })
                }
                required
              />

              <Input
                label="Mobile"
                value={form.mobile}
                onChange={(value) =>
                  setForm({
                    ...form,
                    mobile: value,
                  })
                }
                required
              />

              <Input
                label="WhatsApp Mobile"
                value={form.whatsappMobile}
                onChange={(value) =>
                  setForm({
                    ...form,
                    whatsappMobile: value,
                  })
                }
              />

              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(value) =>
                  setForm({
                    ...form,
                    password: value,
                  })
                }
                required
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5b4ef9] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="size-4 animate-spin" />
                  )}

                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
          EDIT USER MODAL
          ============================================ */}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Edit User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update user information.
                </p>
              </div>

              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateUser}
              className="space-y-4 p-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  value={editForm.firstName || ""}
                  onChange={(value) =>
                    setEditForm({
                      ...editForm,
                      firstName: value,
                    })
                  }
                />

                <Input
                  label="Last Name"
                  value={editForm.lastName || ""}
                  onChange={(value) =>
                    setEditForm({
                      ...editForm,
                      lastName: value,
                    })
                  }
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={editForm.email || ""}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    email: value,
                  })
                }
              />

              <Input
                label="Mobile"
                value={editForm.mobile || ""}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    mobile: value,
                  })
                }
              />

              <Input
                label="WhatsApp Mobile"
                value={editForm.whatsappMobile || ""}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    whatsappMobile: value,
                  })
                }
              />

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <input
                  type="checkbox"
                  checked={editForm.isActive ?? true}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isActive: e.target.checked,
                    })
                  }
                  className="size-4 accent-[#5b4ef9]"
                />

                <span className="text-sm font-medium text-slate-700">
                  Active User
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5b4ef9] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="size-4 animate-spin" />
                  )}

                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// INPUT
// ============================================

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5b4ef9] focus:ring-2 focus:ring-[#5b4ef9]/10"
      />
    </label>
  );
}