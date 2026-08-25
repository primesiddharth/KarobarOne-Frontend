"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, Check, X, Tags } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { attributeApi } from "@/lib/api/catalog-extras";
import { ApiError } from "@/lib/api-client";
import { Attribute } from "@/types/catalog-extras";

const TYPE_OPTIONS = ["text", "number", "boolean", "select"];

function codify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "");
}

export default function AttributesPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("text");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("text");

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await attributeApi.list(token);
      setAttributes(result);
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
    if (!token || !tenantId || !name.trim()) return;

    setError(null);
    setIsCreating(true);
    try {
      const created = await attributeApi.create(
        { tenantId, name: name.trim(), code: codify(name), type },
        token
      );
      setAttributes((prev) => [...prev, created]);
      setName("");
      setType("text");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(attributeId: string) {
    if (!token) return;
    if (!confirm("Delete this attribute? Any values assigned to products will also be removed.")) return;
    setBusyId(attributeId);
    try {
      await attributeApi.remove(attributeId, token);
      setAttributes((prev) => prev.filter((a) => a.id !== attributeId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(attribute: Attribute) {
    setEditingId(attribute.id);
    setEditName(attribute.name);
    setEditType(attribute.type);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(attributeId: string) {
    if (!token || !editName.trim()) return;
    setBusyId(attributeId);
    try {
      const updated = await attributeApi.update(
        attributeId,
        { name: editName.trim(), type: editType },
        token
      );
      setAttributes((prev) => prev.map((a) => (a.id === attributeId ? updated : a)));
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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Attributes</h1>
        <p className="text-gray-500 mb-6">
          Define custom attribute types (e.g. Material, Weight) to assign to individual products.
        </p>

        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 mb-6"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Material"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isCreating || !name.trim()}
            className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
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
          <div className="text-center py-16 text-gray-400">Loading attributes...</div>
        ) : attributes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Tags className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No attributes yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {attributes.map((attribute) =>
              editingId === attribute.id ? (
                <div key={attribute.id} className="px-5 py-3.5 flex items-center gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className="flex-1 px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                  />
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                  >
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => saveEdit(attribute.id)}
                    disabled={busyId === attribute.id}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  key={attribute.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5b4ef9]/10 flex items-center justify-center">
                      <Tags className="w-4 h-4 text-[#5b4ef9]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{attribute.name}</p>
                      <p className="text-xs text-gray-400">
                        {attribute.code} · {attribute.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(attribute)}
                      className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(attribute.id)}
                      disabled={busyId === attribute.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
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