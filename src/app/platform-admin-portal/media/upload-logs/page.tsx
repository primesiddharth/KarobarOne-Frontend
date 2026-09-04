"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  FileClock,
  CheckCircle2,
  XCircle,
  Clock3,
  Eye,
} from "lucide-react";

import { mediaApi } from "@/lib/api/media";
import type {
  MediaUploadLog,
  MediaUploadLogCreatePayload,
  MediaUploadLogUpdatePayload,
} from "@/types/media";

export default function UploadLogsPage() {
  const [logs, setLogs] = useState<MediaUploadLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mediaFileId, setMediaFileId] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedLog, setSelectedLog] =
    useState<MediaUploadLog | null>(null);

  const [editingLog, setEditingLog] =
    useState<MediaUploadLog | null>(null);

  const [form, setForm] =
    useState<MediaUploadLogCreatePayload>({
      mediaFileId: "",
      uploadStatus: "",
      errorMessage: "",
      fileName: "",
      fileSize: undefined,
    });

  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () => {
    if (typeof window === "undefined") return "";

    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  /* =====================================================
     LOAD LOGS
  ===================================================== */

  const loadLogs = async () => {
    if (!mediaFileId.trim()) {
      setError("Please enter a Media File ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await mediaApi.listUploadLogs(
        mediaFileId.trim(),
        token
      );

      setLogs(response.items || []);
    } catch (err) {
      console.error("Failed to load upload logs:", err);

      setLogs([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load upload logs."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setForm({
      mediaFileId: mediaFileId,
      uploadStatus: "",
      errorMessage: "",
      fileName: "",
      fileSize: undefined,
    });

    setEditingLog(null);
  };

  /* =====================================================
     ADD
  ===================================================== */

  const openAddModal = () => {
    setError("");
    setSuccess("");

    setEditingLog(null);

    setForm({
      mediaFileId: mediaFileId,
      uploadStatus: "",
      errorMessage: "",
      fileName: "",
      fileSize: undefined,
    });

    setShowModal(true);
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const openEditModal = (log: MediaUploadLog) => {
    setError("");
    setSuccess("");

    setEditingLog(log);

    setForm({
      mediaFileId: log.mediaFileId,
      uploadStatus: log.uploadStatus || "",
      errorMessage: log.errorMessage || "",
      fileName: log.fileName || "",
      fileSize: log.fileSize,
    });

    setShowModal(true);
  };

  /* =====================================================
     VIEW
  ===================================================== */

  const openViewModal = (log: MediaUploadLog) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      if (!form.mediaFileId.trim()) {
        throw new Error("Media File ID is required.");
      }

      if (editingLog) {
        const updateData: MediaUploadLogUpdatePayload = {
          uploadStatus:
            form.uploadStatus?.trim() || undefined,

          errorMessage:
            form.errorMessage?.trim() || undefined,

          fileName:
            form.fileName?.trim() || undefined,

          fileSize: form.fileSize,
        };

        const updated = await mediaApi.updateUploadLog(
          editingLog.id,
          updateData,
          token
        );

        setLogs((prev) =>
          prev.map((item) =>
            item.id === editingLog.id ? updated : item
          )
        );

        setSuccess("Upload log updated successfully.");
      } else {
        const createData: MediaUploadLogCreatePayload = {
          mediaFileId: form.mediaFileId.trim(),

          uploadStatus:
            form.uploadStatus?.trim() || undefined,

          errorMessage:
            form.errorMessage?.trim() || undefined,

          fileName:
            form.fileName?.trim() || undefined,

          fileSize: form.fileSize,
        };

        const created = await mediaApi.createUploadLog(
          createData,
          token
        );

        setLogs((prev) => [created, ...prev]);

        setMediaFileId(form.mediaFileId.trim());

        setSuccess("Upload log created successfully.");
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save upload log:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save upload log."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (log: MediaUploadLog) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this upload log?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      await mediaApi.deleteUploadLog(log.id, token);

      setLogs((prev) =>
        prev.filter((item) => item.id !== log.id)
      );

      setSuccess("Upload log deleted successfully.");
    } catch (err) {
      console.error("Failed to delete upload log:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete upload log."
      );
    }
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredLogs = logs.filter((log) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return [
      log.id,
      log.mediaFileId,
      log.uploadStatus,
      log.errorMessage,
      log.fileName,
    ]
      .filter(Boolean)
      .some((item) =>
        String(item).toLowerCase().includes(value)
      );
  });

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatus = (status?: string) => {
    const value = status?.toLowerCase();

    if (
      value === "success" ||
      value === "uploaded" ||
      value === "completed"
    ) {
      return {
        icon: CheckCircle2,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    }

    if (
      value === "failed" ||
      value === "error"
    ) {
      return {
        icon: XCircle,
        className:
          "border-red-200 bg-red-50 text-red-700",
      };
    }

    return {
      icon: Clock3,
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    };
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#f8f9fc] px-6 py-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <FileClock className="h-7 w-7 text-indigo-600" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
              Media
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Upload Logs
            </h1>

            <p className="mt-1 text-slate-500">
              Track media upload activity and status.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadLogs}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-5 w-5 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />

            Add Upload Log
          </button>
        </div>
      </div>

      {/* MESSAGES */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="rounded-lg p-1 hover:bg-red-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
            className="rounded-lg p-1 hover:bg-emerald-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* SEARCH BY MEDIA FILE */}

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="font-bold text-slate-900">
            Find Upload Logs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Load upload history for a specific media file.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={mediaFileId}
              onChange={(e) =>
                setMediaFileId(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadLogs();
                }
              }}
              placeholder="Enter Media File ID"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button
            onClick={loadLogs}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            <Search className="h-5 w-5" />

            Load Logs
          </button>
        </div>
      </div>

      {/* TABLE CARD */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Upload Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredLogs.length} log
              {filteredLogs.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search logs..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500">
              <RefreshCw className="h-5 w-5 animate-spin" />

              Loading upload logs...
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileClock className="h-8 w-8 text-slate-400" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              No upload logs found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Enter a Media File ID above to load its upload
              history.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />

              Add Upload Log
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    File
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Media File ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Size
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => {
                  const status = getStatus(
                    log.uploadStatus
                  );

                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100 hover:bg-slate-50/60"
                    >
                      {/* FILE */}

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {log.fileName || "Unknown file"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {log.id}
                        </p>
                      </td>

                      {/* MEDIA FILE ID */}

                      <td className="px-6 py-5">
                        <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          {log.mediaFileId}
                        </code>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-4 w-4" />

                          {log.uploadStatus ||
                            "Unknown"}
                        </span>
                      </td>

                      {/* SIZE */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {log.fileSize
                          ? `${(
                              log.fileSize / 1024
                            ).toFixed(1)} KB`
                          : "—"}
                      </td>

                      {/* CREATED */}

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {log.createdAt
                          ? new Date(
                              log.createdAt
                            ).toLocaleString()
                          : "—"}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openViewModal(log)
                            }
                            title="View"
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(log)
                            }
                            title="Edit"
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(log)
                            }
                            title="Delete"
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingLog
                    ? "Edit Upload Log"
                    : "Add Upload Log"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingLog
                    ? "Update upload log details."
                    : "Create a media upload log."}
                </p>
              </div>

              <button
                onClick={() => {
                  if (!saving) {
                    setShowModal(false);
                    resetForm();
                  }
                }}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* MEDIA FILE ID */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Media File ID
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  value={form.mediaFileId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      mediaFileId: e.target.value,
                    }))
                  }
                  disabled={!!editingLog}
                  placeholder="Enter Media File ID"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* FILE NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  File Name
                </label>

                <input
                  value={form.fileName || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fileName: e.target.value,
                    }))
                  }
                  placeholder="e.g. product-image.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Upload Status
                </label>

                <select
                  value={form.uploadStatus || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      uploadStatus: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">
                    Select status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="uploading">
                    Uploading
                  </option>

                  <option value="uploaded">
                    Uploaded
                  </option>

                  <option value="success">
                    Success
                  </option>

                  <option value="failed">
                    Failed
                  </option>

                  <option value="error">
                    Error
                  </option>
                </select>
              </div>

              {/* FILE SIZE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  File Size (bytes)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.fileSize ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fileSize: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="102400"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* ERROR */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Error Message
                </label>

                <textarea
                  rows={4}
                  value={form.errorMessage || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      errorMessage: e.target.value,
                    }))
                  }
                  placeholder="Enter error message if upload failed..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      setShowModal(false);
                      resetForm();
                    }
                  }}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingLog
                    ? "Update Log"
                    : "Create Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {showViewModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Upload Log Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete information for this upload log.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Log ID
                </p>

                <p className="mt-2 break-all font-mono text-sm text-slate-800">
                  {selectedLog.id}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Media File ID
                </p>

                <p className="mt-2 break-all font-mono text-sm text-slate-800">
                  {selectedLog.mediaFileId}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  File Name
                </p>

                <p className="mt-2 text-sm text-slate-800">
                  {selectedLog.fileName || "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedLog.uploadStatus ||
                    "Unknown"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  File Size
                </p>

                <p className="mt-2 text-sm text-slate-800">
                  {selectedLog.fileSize
                    ? `${selectedLog.fileSize.toLocaleString()} bytes`
                    : "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Created At
                </p>

                <p className="mt-2 text-sm text-slate-800">
                  {selectedLog.createdAt
                    ? new Date(
                        selectedLog.createdAt
                      ).toLocaleString()
                    : "—"}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Error Message
                </p>

                <p className="mt-2 text-sm text-red-700">
                  {selectedLog.errorMessage ||
                    "No error"}
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-4">
              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800"
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