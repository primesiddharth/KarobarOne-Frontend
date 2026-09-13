"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Globe } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { shippingZoneApi } from "@/lib/api/shipping";
import { ApiError } from "@/lib/api-client";
import { ShippingZone } from "@/types/shipping";

function ZonesContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [zoneName, setZoneName] = useState("");
  const [zoneCode, setZoneCode] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    shippingZoneApi
      .list(token)
      .then(setZones)
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
    if (!token || !tenantId || !zoneName.trim() || !zoneCode.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const created = await shippingZoneApi.create(
        { tenant_id: tenantId, zone_name: zoneName, zone_code: zoneCode, country, state, city },
        token
      );
      setZones((prev) => [...prev, created]);
      setZoneName("");
      setZoneCode("");
      setState("");
      setCity("");
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
      await shippingZoneApi.remove(id, token);
      setZones((prev) => prev.filter((z) => z.id !== id));
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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Shipping Zones</h1>
        <p className="text-gray-500 mb-6">Define regions to apply different shipping rates.</p>

        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <input value={zoneName} onChange={(e) => setZoneName(e.target.value)} placeholder="Zone name (e.g. North India)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            <input value={zoneCode} onChange={(e) => setZoneCode(e.target.value)} placeholder="Zone code (e.g. NORTH)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          </div>
          <button type="submit" disabled={isCreating} className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" />
            Add Zone
          </button>
        </form>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</p>}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading zones...</div>
        ) : zones.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No zones yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-gray-900">{zone.zone_name}</p>
                  <p className="text-xs text-gray-500">{zone.city}, {zone.state}, {zone.country}</p>
                </div>
                <button onClick={() => handleDelete(zone.id)} disabled={deletingId === zone.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
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

export default function ZonesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <ZonesContent />
    </Suspense>
  );
}