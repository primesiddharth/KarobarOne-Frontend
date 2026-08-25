"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, Check, X, Truck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { shippingProfileApi } from "@/lib/api/catalog-extras";
import { ApiError } from "@/lib/api-client";
import { ShippingProfile } from "@/types/catalog-extras";

export default function ShippingProfilesPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [profiles, setProfiles] = useState<ShippingProfile[]>([]);
  const [name, setName] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState("");
  const [charges, setCharges] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDelivery, setEditDelivery] = useState("");
  const [editCharges, setEditCharges] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await shippingProfileApi.list(token);
      setProfiles(result);
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
    if (!token || !tenantId || !name.trim() || !deliveryEstimate.trim()) return;

    setError(null);
    setIsCreating(true);
    try {
      const created = await shippingProfileApi.create(
        {
          tenantId,
          name: name.trim(),
          deliveryEstimate: deliveryEstimate.trim(),
          charges: charges ? parseFloat(charges) : 0,
        },
        token
      );
      setProfiles((prev) => [...prev, created]);
      setName("");
      setDeliveryEstimate("");
      setCharges("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(profileId: string) {
    if (!token) return;
    if (!confirm("Delete this shipping profile?")) return;
    setBusyId(profileId);
    try {
      await shippingProfileApi.remove(profileId, token);
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(profile: ShippingProfile) {
    setEditingId(profile.id);
    setEditName(profile.name);
    setEditDelivery(profile.deliveryEstimate);
    setEditCharges(String(profile.charges));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(profileId: string) {
    if (!token || !editName.trim() || !editDelivery.trim()) return;
    setBusyId(profileId);
    try {
      const updated = await shippingProfileApi.update(
        profileId,
        {
          name: editName.trim(),
          deliveryEstimate: editDelivery.trim(),
          charges: editCharges ? parseFloat(editCharges) : 0,
        },
        token
      );
      setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Shipping Profiles</h1>
        <p className="text-gray-500 mb-6">
          Define delivery estimates and charges to assign to your products.
        </p>

        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-3 mb-6"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Profile name"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <input
            value={deliveryEstimate}
            onChange={(e) => setDeliveryEstimate(e.target.value)}
            placeholder="e.g. 3-5 business days"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <div className="flex gap-2">
            <input
              value={charges}
              onChange={(e) => setCharges(e.target.value)}
              type="number"
              step="0.01"
              placeholder="Charges (₹)"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
            />
            <button
              type="submit"
              disabled={isCreating || !name.trim() || !deliveryEstimate.trim()}
              className="bg-[#5b4ef9] text-white px-3 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading shipping profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No shipping profiles yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                {editingId === profile.id ? (
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                    />
                    <input
                      value={editDelivery}
                      onChange={(e) => setEditDelivery(e.target.value)}
                      className="px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        value={editCharges}
                        onChange={(e) => setEditCharges(e.target.value)}
                        type="number"
                        step="0.01"
                        className="w-20 px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => saveEdit(profile.id)}
                        disabled={busyId === profile.id}
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
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#5b4ef9]/10 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-[#5b4ef9]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{profile.name}</p>
                        <p className="text-xs text-gray-400">
                          {profile.deliveryEstimate} · ₹{profile.charges}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(profile)}
                        className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        disabled={busyId === profile.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}