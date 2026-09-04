"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Layers3,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { mediaApi } from "@/lib/api/media";
import {
  MediaVariant,
  MediaVariantCreatePayload,
  MediaVariantUpdatePayload,
} from "@/types/media";

function VariantsContent() {
  const searchParams = useSearchParams();
  const mediaFileId = searchParams.get("mediaFileId");

  const [variants, setVariants] = useState<MediaVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<MediaVariant | null>(null);

  const [form, setForm] = useState({
    mediaFileId: mediaFileId || "",
    variantName: "",
    variantType: "",
    width: "",
    height: "",
    url: "",
    storagePath: "",
    mimeType: "",
    fileSize: "",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const loadVariants = async () => {
    if (!mediaFileId) {
      setVariants([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await mediaApi.listVariants(mediaFileId, token);

      setVariants(response.items || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to load variants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVariants();
  }, [mediaFileId]);

  const openCreateModal = () => {
    setEditingVariant(null);

    setForm({
      mediaFileId: mediaFileId || "",
      variantName: "",
      variantType: "",
      width: "",
      height: "",
      url: "",
      storagePath: "",
      mimeType: "",
      fileSize: "",
    });

    setShowModal(true);
  };

  const openEditModal = (variant: MediaVariant) => {
    setEditingVariant(variant);

    setForm({
      mediaFileId: variant.mediaFileId || "",
      variantName: variant.variantName || "",
      variantType: variant.variantType || "",
      width: variant.width?.toString() || "",
      height: variant.height?.toString() || "",
      url: variant.url || "",
      storagePath: variant.storagePath || "",
      mimeType: variant.mimeType || "",
      fileSize: variant.fileSize?.toString() || "",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      if (editingVariant) {
        const data: MediaVariantUpdatePayload = {
          variantName: form.variantName || undefined,
          variantType: form.variantType || undefined,
          width: form.width ? Number(form.width) : undefined,
          height: form.height ? Number(form.height) : undefined,
          url: form.url || undefined,
          storagePath: form.storagePath || undefined,
          mimeType: form.mimeType || undefined,
          fileSize: form.fileSize ? Number(form.fileSize) : undefined,
        };

        await mediaApi.updateVariant(
          editingVariant.id,
          data,
          token
        );
      } else {
        const data: MediaVariantCreatePayload = {
          mediaFileId: form.mediaFileId,
          variantName: form.variantName || undefined,
          variantType: form.variantType || undefined,
          width: form.width ? Number(form.width) : undefined,
          height: form.height ? Number(form.height) : undefined,
          url: form.url || undefined,
          storagePath: form.storagePath || undefined,
          mimeType: form.mimeType || undefined,
          fileSize: form.fileSize ? Number(form.fileSize) : undefined,
        };

        await mediaApi.createVariant(data, token);
      }

      setShowModal(false);
      await loadVariants();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to save variant"
      );
    }
  };

  const handleDelete = async (variantId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await mediaApi.deleteVariant(variantId, token);

      await loadVariants();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to delete variant"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="border-b bg-white px-8 py-7">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <Layers3 className="h-7 w-7 text-indigo-600" />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
                Content
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Media Variants
              </h1>

              <p className="mt-1 text-slate-500">
                Manage resized and optimized media variants.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadVariants}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              Add Variant
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-7 py-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                All Variants
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {variants.length}{" "}
                {variants.length === 1 ? "variant" : "variants"} found
              </p>
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                placeholder="Search variants..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {error && (
            <div className="mx-7 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center text-slate-500">
              Loading variants...
            </div>
          ) : variants.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <Layers3 className="h-8 w-8 text-indigo-500" />
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                No variants found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a variant to get started.
              </p>

              <button
                onClick={openCreateModal}
                className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-7 py-4">Variant</th>
                    <th className="px-7 py-4">Type</th>
                    <th className="px-7 py-4">Dimensions</th>
                    <th className="px-7 py-4">MIME Type</th>
                    <th className="px-7 py-4">URL</th>
                    <th className="px-7 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {variants.map((variant) => (
                    <tr
                      key={variant.id}
                      className="border-b border-slate-50 transition hover:bg-slate-50"
                    >
                      <td className="px-7 py-5">
                        <div className="font-medium text-slate-900">
                          {variant.variantName || "Unnamed variant"}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {variant.id}
                        </div>
                      </td>

                      <td className="px-7 py-5">
                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                          {variant.variantType || "—"}
                        </span>
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-600">
                        {variant.width && variant.height
                          ? `${variant.width} × ${variant.height}`
                          : "—"}
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-600">
                        {variant.mimeType || "—"}
                      </td>

                      <td className="max-w-[250px] px-7 py-5">
                        {variant.url ? (
                          <a
                            href={variant.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-sm text-indigo-600 hover:underline"
                          >
                            {variant.url}
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-7 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(variant)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(variant.id)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-7 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingVariant ? "Edit Variant" : "Add Variant"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingVariant
                    ? "Update variant details."
                    : "Create a new media variant."}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-7">
              {!editingVariant && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Media File ID
                  </label>

                  <input
                    value={form.mediaFileId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mediaFileId: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="Media file UUID"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Variant Name
                  </label>

                  <input
                    value={form.variantName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        variantName: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="thumbnail"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Variant Type
                  </label>

                  <input
                    value={form.variantType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        variantType: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="thumbnail / medium / large"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Width
                  </label>

                  <input
                    type="number"
                    value={form.width}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        width: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="800"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Height
                  </label>

                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        height: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  URL
                </label>

                <input
                  value={form.url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      url: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Storage Path
                </label>

                <input
                  value={form.storagePath}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      storagePath: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="uploads/variants/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    MIME Type
                  </label>

                  <input
                    value={form.mimeType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mimeType: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="image/jpeg"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    File Size
                  </label>

                  <input
                    type="number"
                    value={form.fileSize}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fileSize: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="102400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {editingVariant ? "Update Variant" : "Create Variant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VariantsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500">
          Loading media variants...
        </div>
      }
    >
      <VariantsContent />
    </Suspense>
  );
}