"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

import { mediaApi } from "@/lib/api/media";
import type {
  MediaMetadata,
  MediaMetadataCreatePayload,
  MediaMetadataUpdatePayload,
} from "@/types/media";

export default function MediaMetadataPage() {
  const [metadata, setMetadata] = useState<MediaMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editingMetadata, setEditingMetadata] =
    useState<MediaMetadata | null>(null);

  const [form, setForm] = useState<MediaMetadataCreatePayload>({
    mediaFileId: "",
    title: "",
    altText: "",
    caption: "",
    description: "",
    tags: "",
    width: undefined,
    height: undefined,
  });

  const getToken = () => {
    if (typeof window === "undefined") return "";

    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  /* =========================
     FETCH METADATA
  ========================= */

  const loadMetadata = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await mediaApi.listMetadata(token);

      setMetadata(response.items || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load media metadata."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  /* =========================
     SEARCH
  ========================= */

  const filteredMetadata = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return metadata;

    return metadata.filter((item) =>
      [
        item.title,
        item.altText,
        item.caption,
        item.description,
        item.tags,
        item.mediaFileId,
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(value))
    );
  }, [metadata, search]);

  /* =========================
     FORM
  ========================= */

  const resetForm = () => {
    setForm({
      mediaFileId: "",
      title: "",
      altText: "",
      caption: "",
      description: "",
      tags: "",
      width: undefined,
      height: undefined,
    });

    setEditingMetadata(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: MediaMetadata) => {
    setEditingMetadata(item);

    setForm({
      mediaFileId: item.mediaFileId,
      title: item.title || "",
      altText: item.altText || "",
      caption: item.caption || "",
      description: item.description || "",
      tags: item.tags || "",
      width: item.width,
      height: item.height,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const updateField = (
    field: keyof MediaMetadataCreatePayload,
    value: string | number | undefined
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      if (!form.mediaFileId.trim()) {
        throw new Error("Media File ID is required.");
      }

      if (editingMetadata) {
        const updateData: MediaMetadataUpdatePayload = {
          title: form.title || undefined,
          altText: form.altText || undefined,
          caption: form.caption || undefined,
          description: form.description || undefined,
          tags: form.tags || undefined,
          width: form.width,
          height: form.height,
        };

        await mediaApi.updateMetadata(
          editingMetadata.id,
          updateData,
          token
        );
      } else {
        const createData: MediaMetadataCreatePayload = {
          mediaFileId: form.mediaFileId.trim(),
          title: form.title || undefined,
          altText: form.altText || undefined,
          caption: form.caption || undefined,
          description: form.description || undefined,
          tags: form.tags || undefined,
          width: form.width,
          height: form.height,
        };

        await mediaApi.createMetadata(createData, token);
      }

      setShowModal(false);
      resetForm();

      await loadMetadata();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save metadata."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (item: MediaMetadata) => {
    const confirmed = window.confirm(
      `Delete metadata "${item.title || item.id}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      await mediaApi.deleteMetadata(item.id, token);

      await loadMetadata();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete metadata."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] px-6 py-8">
      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <FileText className="h-7 w-7 text-indigo-600" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
              Content
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Media Metadata
            </h1>

            <p className="mt-1 text-slate-500">
              Manage titles, descriptions, captions and image metadata.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadMetadata}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Add Metadata
          </button>
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="rounded-lg p-1 hover:bg-red-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>

          <p className="text-sm text-slate-500">Total Metadata</p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {metadata.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
            <ImageIcon className="h-5 w-5 text-purple-600" />
          </div>

          <p className="text-sm text-slate-500">With Alt Text</p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {metadata.filter((item) => item.altText).length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>

          <p className="text-sm text-slate-500">With Description</p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {metadata.filter((item) => item.description).length}
          </p>
        </div>
      </div>

      {/* ================= MAIN CARD ================= */}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* TOP BAR */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              All Metadata
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredMetadata.length} metadata record
              {filteredMetadata.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search metadata..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Loading metadata...
              </div>
            </div>
          ) : filteredMetadata.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No metadata found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                Add metadata to your media files to manage titles,
                captions, descriptions and accessibility information.
              </p>

              <button
                onClick={openAddModal}
                className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5" />
                Add Metadata
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Metadata
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Media File ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Alt Text
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Dimensions
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Updated
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMetadata.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.title || "Untitled"}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                          {item.description || item.caption || "No description"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {item.mediaFileId}
                      </code>
                    </td>

                    <td className="px-6 py-5">
                      {item.altText ? (
                        <span className="text-sm text-slate-700">
                          {item.altText}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not added
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      {item.width && item.height ? (
                        <span className="text-sm font-medium text-slate-700">
                          {item.width} × {item.height}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-500">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString()
                          : new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit metadata"
                          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          title="Delete metadata"
                          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingMetadata
                    ? "Edit Metadata"
                    : "Add Media Metadata"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingMetadata
                    ? "Update metadata information."
                    : "Add metadata for a media file."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* MEDIA FILE ID */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Media File ID
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  value={form.mediaFileId}
                  onChange={(e) =>
                    updateField("mediaFileId", e.target.value)
                  }
                  disabled={!!editingMetadata}
                  placeholder="Enter Media File UUID"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-1 text-xs text-slate-400">
                  UUID of the parent media file.
                </p>
              </div>

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  value={form.title || ""}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  placeholder="e.g. Product Hero Image"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* ALT TEXT */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Alt Text
                </label>

                <input
                  value={form.altText || ""}
                  onChange={(e) =>
                    updateField("altText", e.target.value)
                  }
                  placeholder="Describe the image for accessibility"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* CAPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Caption
                </label>

                <input
                  value={form.caption || ""}
                  onChange={(e) =>
                    updateField("caption", e.target.value)
                  }
                  placeholder="Image caption"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={form.description || ""}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Describe this media file..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* TAGS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tags
                </label>

                <input
                  value={form.tags || ""}
                  onChange={(e) =>
                    updateField("tags", e.target.value)
                  }
                  placeholder="product, banner, summer"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* DIMENSIONS */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Width
                  </label>

                  <input
                    type="number"
                    value={form.width ?? ""}
                    onChange={(e) =>
                      updateField(
                        "width",
                        e.target.value
                          ? Number(e.target.value)
                          : undefined
                      )
                    }
                    placeholder="1920"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Height
                  </label>

                  <input
                    type="number"
                    value={form.height ?? ""}
                    onChange={(e) =>
                      updateField(
                        "height",
                        e.target.value
                          ? Number(e.target.value)
                          : undefined
                      )
                    }
                    placeholder="1080"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingMetadata
                    ? "Update Metadata"
                    : "Create Metadata"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}