"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, Check, X, Tag, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { brandApi } from "@/lib/api/catalog";
import { ApiError } from "@/lib/api-client";
import { Brand } from "@/types/catalog";

export default function BrandsPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const loadBrands = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await brandApi.list(token);
      setBrands(result);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !tenantId || !newName.trim()) return;

    setError(null);
    setIsCreating(true);
    try {
      const created = await brandApi.create({ tenantId, name: newName.trim() }, token);
      setBrands((prev) => [...prev, created]);
      setNewName("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(brandId: string) {
    if (!token) return;
    if (!confirm("Delete this brand?")) return;
    setBusyId(brandId);
    try {
      await brandApi.remove(brandId, token);
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRequestApproval(brandId: string) {
    if (!token) return;
    setBusyId(brandId);
    try {
      await brandApi.requestApproval(brandId, token);
      alert("Approval requested.");
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(brand: Brand) {
    setEditingId(brand.id);
    setEditName(brand.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function saveEdit(brandId: string) {
    if (!token || !editName.trim()) return;
    setBusyId(brandId);
    try {
      const updated = await brandApi.update(brandId, { name: editName.trim() }, token);
      setBrands((prev) => prev.map((b) => (b.id === brandId ? updated : b)));
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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Brands</h1>
        <p className="text-gray-500 mb-6">Manage the brands you carry.</p>

        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New brand name"
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
          <div className="text-center py-16 text-gray-400">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No brands yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                {editingId === brand.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="flex-1 px-3 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none mr-3"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => saveEdit(brand.id)}
                        disabled={busyId === brand.id}
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
                        <Tag className="w-4 h-4 text-[#5b4ef9]" />
                      </div>
                      <p className="font-medium text-gray-900">{brand.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRequestApproval(brand.id)}
                        disabled={busyId === brand.id}
                        title="Request approval"
                        className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEdit(brand)}
                        className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        disabled={busyId === brand.id}
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