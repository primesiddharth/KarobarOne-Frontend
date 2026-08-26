"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, Check, X, FolderTree } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { categoryApi } from "@/lib/api/catalog";
import { ApiError } from "@/lib/api-client";
import { Category } from "@/types/catalog";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function CategoriesPageContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const loadCategories = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await categoryApi.list(token);
      setCategories(result);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !tenantId || !newName.trim()) return;

    setError(null);
    setIsCreating(true);
    try {
      const created = await categoryApi.create(
        { tenantId, name: newName.trim(), slug: slugify(newName) },
        token
      );
      setCategories((prev) => [...prev, created]);
      setNewName("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(categoryId: string) {
    if (!token) return;
    if (!confirm("Delete this category?")) return;
    setBusyId(categoryId);
    try {
      await categoryApi.remove(categoryId, token);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditName(category.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function saveEdit(categoryId: string) {
    if (!token || !editName.trim()) return;
    setBusyId(categoryId);
    try {
      const updated = await categoryApi.update(
        categoryId,
        { name: editName.trim(), slug: slugify(editName) },
        token
      );
      setCategories((prev) => prev.map((c) => (c.id === categoryId ? updated : c)));
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
          Back to Products
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Categories</h1>
        <p className="text-gray-500 mb-6">Organize your products into categories.</p>

        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30 focus:border-[#5b4ef9]"
          />
          <button
            type="submit"
            disabled={isCreating || !newName.trim()}
            className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
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
          <div className="text-center py-16 text-gray-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FolderTree className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No categories yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                {editingId === category.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="flex-1 px-3 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none mr-3"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => saveEdit(category.id)}
                        disabled={busyId === category.id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#5b4ef9]/10 flex items-center justify-center">
                        <FolderTree className="w-4 h-4 text-[#5b4ef9]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-400">{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={busyId === category.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <CategoriesPageContent />
    </Suspense>
  );
}
