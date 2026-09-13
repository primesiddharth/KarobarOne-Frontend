"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Truck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { shippingPartnerApi } from "@/lib/api/shipping";
import { ApiError } from "@/lib/api-client";
import { ShippingPartner } from "@/types/shipping";

function PartnersContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [partners, setPartners] = useState<ShippingPartner[]>([]);
  const [partnerName, setPartnerName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    shippingPartnerApi
      .list(token)
      .then(setPartners)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !partnerName.trim() || !partnerCode.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const created = await shippingPartnerApi.create(
        { partner_code: partnerCode.trim(), partner_name: partnerName.trim() },
        token
      );
      setPartners((prev) => [...prev, created]);
      setPartnerName("");
      setPartnerCode("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    setDeletingId(id);
    try {
      await shippingPartnerApi.remove(id, token);
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/shipping/profiles?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shipping Profiles
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Shipping Partners</h1>
        <p className="text-gray-500 mb-6">Couriers you use to deliver orders.</p>

        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 mb-6">
          <input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Partner name (e.g. Shiprocket)" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          <input value={partnerCode} onChange={(e) => setPartnerCode(e.target.value)} placeholder="Code (e.g. SHIPROCKET)" className="w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          <button type="submit" disabled={isCreating} className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</p>}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No shipping partners yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {partners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-gray-900">{partner.partner_name}</p>
                  <p className="text-xs text-gray-500">{partner.partner_code}</p>
                </div>
                <button onClick={() => handleDelete(partner.id)} disabled={deletingId === partner.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PartnersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <PartnersContent />
    </Suspense>
  );
}