"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Pencil,
  X,
  Save,
  RefreshCw,
  FileText,
  Eye,
} from "lucide-react";

import {
  listWebsiteAIContent,
  getWebsiteAIContent,
  createWebsiteAIContent,
  updateWebsiteAIContent,
} from "@/lib/api/websites";

import type {
  WebsiteAIContentResponse,
  WebsiteAIContentCreate,
  WebsiteAIContentUpdate,
    JsonValue,
} from "@/types/websites";

export default function WebsiteAIContentPage() {
  const [contents, setContents] = useState<WebsiteAIContentResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [storeId, setStoreId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] =
    useState<WebsiteAIContentResponse | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    storeId: "",
    contentType: "",
    content: "",
    metadata: "",
    status: "draft",
  });

  /*
   * Load content whenever Store ID changes.
   */
  useEffect(() => {
    if (!storeId.trim()) {
      setContents([]);
      return;
    }

    loadContent(storeId);
  }, [storeId]);

  async function loadContent(id = storeId) {
    if (!id.trim()) {
      setError("Please enter a Store ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await listWebsiteAIContent(id.trim());

      setContents(result);
    } catch (err) {
      console.error(err);
      setError("Unable to load AI content.");
      setContents([]);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      storeId: storeId,
      contentType: "",
      content: "",
      metadata: "",
      status: "draft",
    });

    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setShowModal(true);
  }

  async function openEdit(id: string) {
    try {
      setError("");
      setSuccess("");

      const item = await getWebsiteAIContent(id);

      setForm({
        storeId: item.storeId,
        contentType: item.contentType,
        content: item.content || "",
        metadata:
          item.metadata !== null &&
          typeof item.metadata === "object"
            ? JSON.stringify(item.metadata, null, 2)
            : "",
        status: item.status,
      });

      setEditingId(item.id);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError("Unable to load content details.");
    }
  }

  async function handleView(id: string) {
    try {
      setError("");
      setSuccess("");

      const item = await getWebsiteAIContent(id);

      setViewItem(item);
    } catch (err) {
      console.error(err);
      setError("Unable to load content.");
    }
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  async function handleSave() {
    try {
      setError("");
      setSuccess("");

      if (!form.storeId.trim()) {
        setError("Store ID is required.");
        return;
      }

      if (!form.contentType.trim()) {
        setError("Content type is required.");
        return;
      }

      let metadata: JsonValue = {};

      if (form.metadata.trim()) {
        try {
          metadata = JSON.parse(form.metadata);
        } catch {
          setError("Metadata must be valid JSON.");
          return;
        }
      }

      if (editingId) {
        const data: WebsiteAIContentUpdate = {
          content: form.content || null,
          metadata,
          status: form.status || null,
        };

        await updateWebsiteAIContent(editingId, data);

        setSuccess("AI content updated successfully.");
      } else {
        const data: WebsiteAIContentCreate = {
          storeId: form.storeId.trim(),
          contentType: form.contentType.trim(),
          content: form.content || null,
          metadata,
        };

        await createWebsiteAIContent(data);

        setSuccess("AI content created successfully.");
      }

      setShowModal(false);
      setEditingId(null);

      await loadContent(form.storeId);
    } catch (err) {
      console.error(err);
      setError("Unable to save AI content.");
    }
  }

  const filteredContents = contents.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.contentType.toLowerCase().includes(query) ||
      (item.content || "").toLowerCase().includes(query) ||
      item.storeId.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = contents.filter(
    (item) => item.status.toLowerCase() === "published"
  ).length;

  const draftCount = contents.filter(
    (item) => item.status.toLowerCase() === "draft"
  ).length;

  const pendingCount = contents.filter(
    (item) => item.status.toLowerCase() === "pending"
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f9fc] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Sparkles size={17} />
              Website Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Website AI Content
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Manage AI-generated website content, metadata and content
              status.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => loadContent()}
              disabled={loading || !storeId.trim()}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Plus size={17} />
              Create Content
            </button>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* STORE ID */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="mb-2">
            <label className="text-sm font-semibold text-gray-800">
              Store ID
            </label>

            <p className="mt-1 text-xs text-gray-400">
              Enter a store ID to load its AI content.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="Enter store UUID"
              className="flex-1 rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
            />

            <button
              onClick={() => loadContent()}
              disabled={loading || !storeId.trim()}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Load Content
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText size={20} />}
            label="Total Content"
            value={contents.length}
          />

          <StatCard
            icon={<Sparkles size={20} />}
            label="AI Content"
            value={contents.length}
          />

          <StatCard
            icon={<Eye size={20} />}
            label="Published"
            value={publishedCount}
          />

          <StatCard
            icon={<FileText size={20} />}
            label="Drafts"
            value={draftCount + pendingCount}
          />
        </div>

        {/* SEARCH / FILTER */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content, store or content type..."
                className="w-full rounded-xl border border-blue-100 bg-blue-50/20 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-300"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                AI Content Library
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Generated content available for this store.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {filteredContents.length} Items
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <RefreshCw
                size={24}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading AI content...
              </p>
            </div>
          ) : !storeId.trim() ? (
            <EmptyState
              title="Enter a Store ID"
              description="Enter a store ID above to load AI-generated content."
            />
          ) : filteredContents.length === 0 ? (
            <EmptyState
              title="No AI content found"
              description="Create your first AI content record for this store."
              action={
                <button
                  onClick={openCreate}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create Content
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-blue-100 bg-blue-50/50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Content Type
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Store ID
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Content
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContents.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Sparkles size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.contentType}
                            </p>

                            <p className="mt-1 max-w-[180px] truncate text-xs text-gray-400">
                              {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
                          {item.storeId}
                        </span>
                      </td>

                      <td className="max-w-[300px] px-6 py-5">
                        <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                          {item.content || "No content available"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleView(item.id)}
                            className="rounded-lg border border-blue-100 p-2 text-blue-600 transition hover:bg-blue-50"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => openEdit(item.id)}
                            className="rounded-lg border border-blue-100 p-2 text-blue-600 transition hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-blue-100 bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  {editingId ? "Edit AI Content" : "Create AI Content"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingId
                    ? "Update the existing AI content."
                    : "Create a new AI content record."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">

              <Input
                label="Store ID"
                value={form.storeId}
                disabled={Boolean(editingId)}
                placeholder="Enter store UUID"
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    storeId: value,
                  }))
                }
              />

              <Input
                label="Content Type"
                value={form.contentType}
                disabled={Boolean(editingId)}
                placeholder="homepage, about, services..."
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    contentType: value,
                  }))
                }
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Content
                </label>

                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Enter AI-generated website content..."
                  className="w-full resize-none rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Metadata
                </label>

                <textarea
                  rows={6}
                  value={form.metadata}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      metadata: e.target.value,
                    }))
                  }
                  placeholder={`{
  "tone": "professional",
  "language": "en"
}`}
                  className="w-full resize-none rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 font-mono text-sm leading-6 outline-none transition focus:border-blue-300 focus:bg-white"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Metadata must be valid JSON.
                </p>
              </div>

              {editingId && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none focus:border-blue-300"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-blue-100 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={16} />
                {editingId ? "Update Content" : "Create Content"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-blue-100 bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Sparkles size={17} />
                  </div>

                  <h2 className="text-xl font-bold text-gray-950">
                    {viewItem.contentType}
                  </h2>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  AI-generated website content
                </p>
              </div>

              <button
                onClick={() => setViewItem(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-blue-50"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <InfoBox
                  label="Store ID"
                  value={viewItem.storeId}
                />

                <InfoBox
                  label="Status"
                  value={viewItem.status}
                />

                <InfoBox
                  label="Created"
                  value={formatDate(viewItem.createdAt)}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Content
                </p>

                <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                    {viewItem.content || "No content available."}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Metadata
                </p>

                <pre className="overflow-x-auto rounded-xl border border-blue-100 bg-gray-950 p-5 text-xs leading-6 text-gray-200">
                  {JSON.stringify(viewItem.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end border-t border-blue-100 px-6 py-4">
              <button
                onClick={() => setViewItem(null)}
                className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-4 text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-gray-950">{value}</p>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  let className = "bg-gray-100 text-gray-600";

  if (normalized === "published") {
    className = "bg-green-50 text-green-700";
  } else if (normalized === "pending") {
    className = "bg-amber-50 text-amber-700";
  } else if (normalized === "draft") {
    className = "bg-blue-50 text-blue-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${className}`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  value,
  placeholder,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-blue-100 px-4 py-3 text-sm outline-none transition focus:border-blue-300 ${
          disabled
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-blue-50/20 focus:bg-white"
        }`}
      />
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
        <Sparkles size={21} className="text-blue-600" />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      {action}
    </div>
  );
}

/* ============================================================
   DATE
============================================================ */

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}