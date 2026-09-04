"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Upload,
} from "lucide-react";

import { mediaApi } from "@/lib/api/media";
import type { MediaFile } from "@/types/media";

export default function MediaFilesPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [menuId, setMenuId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    fileName: "",
    originalFileName: "",
    mimeType: "",
    fileSize: "",
    storageProvider: "",
    storagePath: "",
    publicUrl: "",
    uploadStatus: "uploaded",
    checksum: "",
  });

  const getToken = () => {
    if (typeof window === "undefined") return "";

    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  const loadFiles = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        console.error("Access token not found");
        setFiles([]);
        return;
      }

      const response = await mediaApi.listFiles(token, undefined, 0, 100);

      setFiles(response.items || []);
    } catch (error) {
      console.error("Failed to load media files:", error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !search ||
        file.fileName?.toLowerCase().includes(searchValue) ||
        file.originalFileName?.toLowerCase().includes(searchValue) ||
        file.mimeType?.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "all" ||
        file.uploadStatus?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [files, search, status]);

  const handleDelete = async (file: MediaFile) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${file.fileName || file.originalFileName}"?`
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      await mediaApi.deleteFile(file.id, token, true);

      setMenuId(null);
      await loadFiles();
    } catch (error) {
      console.error("Failed to delete media file:", error);
      alert("Failed to delete media file.");
    }
  };

  const handleCreate = async () => {
    if (!form.fileName.trim()) {
      alert("File name is required.");
      return;
    }

    try {
      setCreating(true);

      const token = getToken();

      await mediaApi.createFile(
        {
          fileName: form.fileName,
          originalFileName: form.originalFileName || form.fileName,
          mimeType: form.mimeType || undefined,
          fileSize: form.fileSize
            ? Number(form.fileSize)
            : undefined,
          storageProvider: form.storageProvider || undefined,
          storagePath: form.storagePath || undefined,
          publicUrl: form.publicUrl || undefined,
          uploadStatus: form.uploadStatus || undefined,
          checksum: form.checksum || undefined,
        },
        token
      );

      setShowCreate(false);

      setForm({
        fileName: "",
        originalFileName: "",
        mimeType: "",
        fileSize: "",
        storageProvider: "",
        storagePath: "",
        publicUrl: "",
        uploadStatus: "uploaded",
        checksum: "",
      });

      await loadFiles();
    } catch (error) {
      console.error("Failed to create media file:", error);
      alert("Failed to create media file.");
    } finally {
      setCreating(false);
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "—";

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusStyle = (uploadStatus?: string) => {
    const value = uploadStatus?.toLowerCase();

    if (value === "uploaded" || value === "success" || value === "completed") {
      return {
        className: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle2 size={14} />,
      };
    }

    if (value === "failed" || value === "error") {
      return {
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle size={14} />,
      };
    }

    return {
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: <Upload size={14} />,
    };
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <div className="border-b bg-white px-8 py-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-[#6254e8]">
              <ImageIcon size={17} />
              Media
            </div>

            <h1 className="text-3xl font-semibold text-gray-900">
              Media Files
            </h1>

            <p className="mt-2 text-gray-500">
              Manage uploaded media files and their storage information.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadFiles}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl bg-[#5b4bea] px-5 py-3 font-medium text-white shadow-sm transition hover:bg-[#4d3ed8]"
            >
              <Plus size={19} />
              Add Media
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Files</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {files.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Active Files</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {files.filter((file) => file.isActive !== false).length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Uploaded</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {
                files.filter(
                  (file) =>
                    file.uploadStatus?.toLowerCase() === "uploaded"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-gray-100 p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  All Media Files
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredFiles.length} files found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search media..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-[#6254e8] focus:bg-white sm:w-[280px]"
                  />
                </div>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-600 outline-none focus:border-[#6254e8]"
                >
                  <option value="all">All Status</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex items-center gap-3 text-gray-500">
                <RefreshCw size={20} className="animate-spin" />
                Loading media files...
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-2xl bg-[#efedff] p-5 text-[#6254e8]">
                <ImageIcon size={35} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                No media files found
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                {search
                  ? "Try changing your search or status filter."
                  : "Add your first media file to get started."}
              </p>

              {!search && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-[#5b4bea] px-5 py-3 font-medium text-white"
                >
                  <Plus size={18} />
                  Add Media
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-medium">File</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Size</th>
                    <th className="px-6 py-4 font-medium">Storage</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Active</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFiles.map((file) => {
                    const statusStyle = getStatusStyle(file.uploadStatus);

                    return (
                      <tr
                        key={file.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50/70"
                      >
                        {/* File */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#efedff] text-[#6254e8]">
                              {file.publicUrl &&
                              file.mimeType?.startsWith("image/") ? (
                                <img
                                  src={file.publicUrl}
                                  alt={file.fileName || "Media"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageIcon size={22} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate font-medium text-gray-900">
                                {file.fileName ||
                                  file.originalFileName ||
                                  "Untitled"}
                              </p>

                              <p className="mt-1 max-w-[260px] truncate text-xs text-gray-400">
                                {file.originalFileName || "No original name"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {file.mimeType || "—"}
                        </td>

                        {/* Size */}
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {formatFileSize(file.fileSize)}
                        </td>

                        {/* Storage */}
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {file.storageProvider || "—"}
                            </p>

                            <p className="mt-1 max-w-[180px] truncate text-xs text-gray-400">
                              {file.storagePath || "No path"}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyle.className}`}
                          >
                            {statusStyle.icon}
                            {file.uploadStatus || "Unknown"}
                          </span>
                        </td>

                        {/* Active */}
                        <td className="px-6 py-5">
                          {file.isActive !== false ? (
                            <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
                              <CheckCircle2 size={16} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                              <XCircle size={16} />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="relative px-6 py-5 text-right">
                          <button
                            onClick={() =>
                              setMenuId(
                                menuId === file.id ? null : file.id
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <MoreVertical size={19} />
                          </button>

                          {menuId === file.id && (
                            <div className="absolute right-6 top-14 z-20 w-44 rounded-xl border border-gray-200 bg-white py-2 text-left shadow-xl">
                              <button
                                onClick={() => {
                                  setSelectedFile(file);
                                  setShowDetails(true);
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye size={16} />
                                View Details
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedFile(file);
                                  setShowDetails(true);
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(file)}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Media File Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete information about this media file.
                </p>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <Detail
                label="File Name"
                value={selectedFile.fileName}
              />

              <Detail
                label="Original File Name"
                value={selectedFile.originalFileName}
              />

              <Detail
                label="MIME Type"
                value={selectedFile.mimeType}
              />

              <Detail
                label="File Size"
                value={formatFileSize(selectedFile.fileSize)}
              />

              <Detail
                label="Storage Provider"
                value={selectedFile.storageProvider}
              />

              <Detail
                label="Storage Path"
                value={selectedFile.storagePath}
              />

              <Detail
                label="Upload Status"
                value={selectedFile.uploadStatus}
              />

              <Detail
                label="Checksum"
                value={selectedFile.checksum}
              />

              <Detail
                label="Created At"
                value={selectedFile.createdAt}
              />

              <Detail
                label="Updated At"
                value={selectedFile.updatedAt}
              />

              <div className="sm:col-span-2">
                <Detail
                  label="Public URL"
                  value={selectedFile.publicUrl}
                />
              </div>
            </div>

            <div className="flex justify-end border-t px-6 py-4">
              <button
                onClick={() => setShowDetails(false)}
                className="rounded-xl bg-gray-100 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b px-6 py-5">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Media File
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create a media file record.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <Input
                label="File Name *"
                value={form.fileName}
                onChange={(value) =>
                  setForm({ ...form, fileName: value })
                }
              />

              <Input
                label="Original File Name"
                value={form.originalFileName}
                onChange={(value) =>
                  setForm({ ...form, originalFileName: value })
                }
              />

              <Input
                label="MIME Type"
                placeholder="image/jpeg"
                value={form.mimeType}
                onChange={(value) =>
                  setForm({ ...form, mimeType: value })
                }
              />

              <Input
                label="File Size"
                placeholder="102400"
                value={form.fileSize}
                onChange={(value) =>
                  setForm({ ...form, fileSize: value })
                }
              />

              <Input
                label="Storage Provider"
                placeholder="s3"
                value={form.storageProvider}
                onChange={(value) =>
                  setForm({ ...form, storageProvider: value })
                }
              />

              <Input
                label="Storage Path"
                value={form.storagePath}
                onChange={(value) =>
                  setForm({ ...form, storagePath: value })
                }
              />

              <div className="sm:col-span-2">
                <Input
                  label="Public URL"
                  value={form.publicUrl}
                  onChange={(value) =>
                    setForm({ ...form, publicUrl: value })
                  }
                />
              </div>

              <Input
                label="Checksum"
                value={form.checksum}
                onChange={(value) =>
                  setForm({ ...form, checksum: value })
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload Status
                </label>

                <select
                  value={form.uploadStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      uploadStatus: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#6254e8]"
                >
                  <option value="uploaded">Uploaded</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 rounded-xl bg-[#5b4bea] px-5 py-3 font-medium text-white disabled:opacity-60"
              >
                {creating && (
                  <RefreshCw size={17} className="animate-spin" />
                )}
                Create File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="break-all text-sm text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6254e8]"
      />
    </div>
  );
}