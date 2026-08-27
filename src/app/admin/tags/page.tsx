"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, Check, X, Tag as TagIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getUserIdFromToken } from "@/lib/jwt";
import { tagApi } from "@/lib/api/system-logs";
import { ApiError } from "@/lib/api-client";
import { Tag } from "@/types/system-logs";

function TagsContent() {
  const { token } = useAuth();
  const userId = getUserIdFromToken(token);
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState("");
  const [tagType, setTagType] = useState("PRODUCT");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await tagApi.list(token);
      setTags(result);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !tagName.trim()) return;
    setError(null);
    setIsCreating(true);
    try {
      const created = await tagApi.create(
        { tenantId, storeId, tagName: tagName.trim(), tagType, createdBy: userId },
        token
      );
      setTags((prev) => [...prev, created]);
      setTagName("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(tagId: string) {
    if (!token) return;
    if (!confirm("Delete this tag?")) return;
    setBusyId(tagId);
    try {
      await tagApi.remove(tagId, token);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id);
    setEditName(tag.tagName);
  }

  async function saveEdit(tagId: string) {
    if (!token || !editName.trim()) return;
    setBusyId(tagId);
    try {
      const updated = await tagApi.update(tagId, { tagName: editName.trim() }, token);
      setTags((prev) => prev.map((t) => (t.id === tagId ? updated : t)));
      setEditingId(null);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/catalog/products?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tags</h1>
        <p className="text-gray-500 mb-6">
          Create tags to organize products, customers, or other entities.
        </p>

        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 mb-6">
          <input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Tag name (e.g. Summer Sale)"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <select
            value={tagType}
            onChange={(e) => setTagType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          >
            <option value="PRODUCT">Product</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ORDER">Order</option>
          </select>
          <button
            type="submit"
            disabled={isCreating || !tagName.trim()}
            className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <TagIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tags yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {tags.map((tag) =>
              editingId === tag.id ? (
                <div key={tag.id} className="flex items-center gap-2 px-5 py-3.5">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className="flex-1 px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                  />
                  <button onClick={() => saveEdit(tag.id)} disabled={busyId === tag.id} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div key={tag.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: tag.colorCode || "#5b4ef9" }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{tag.tagName}</p>
                      <p className="text-xs text-gray-400">{tag.tagType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(tag)} className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(tag.id)} disabled={busyId === tag.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TagsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <TagsContent />
    </Suspense>
  );
}