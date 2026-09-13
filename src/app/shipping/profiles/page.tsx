"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Truck, Globe, Layers } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { shippingProfileApi, shippingRateApi, shippingZoneApi } from "@/lib/api/shipping";
import { ApiError } from "@/lib/api-client";
import { ShippingProfile, ShippingRate, ShippingZone } from "@/types/shipping";

function ProfilesContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [profiles, setProfiles] = useState<ShippingProfile[]>([]);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [profileName, setProfileName] = useState("");
  const [threshold, setThreshold] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [rateZoneId, setRateZoneId] = useState("");
  const [rateMinWeight, setRateMinWeight] = useState("");
  const [rateMaxWeight, setRateMaxWeight] = useState("");
  const [rateCharge, setRateCharge] = useState("");

  const load = useCallback(() => {
    if (!token) return;
    Promise.all([shippingProfileApi.list(token), shippingZoneApi.list(token)])
      .then(([p, z]) => {
        setProfiles(p);
        setZones(z);
      })
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
    if (!token || !tenantId || !profileName.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const created = await shippingProfileApi.create(
        {
          tenant_id: tenantId,
          profile_name: profileName.trim(),
          free_shipping_threshold: threshold ? parseFloat(threshold) : null,
        },
        token
      );
      setProfiles((prev) => [...prev, created]);
      setProfileName("");
      setThreshold("");
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
      await shippingProfileApi.remove(id, token);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleExpand(profileId: string) {
    if (expandedId === profileId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(profileId);
    if (!token) return;
    try {
      const result = await shippingRateApi.listByProfile(profileId, token);
      setRates(result);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    }
  }

  async function handleAddRate(profileId: string) {
    if (!token || !rateZoneId || !rateMinWeight || !rateMaxWeight || !rateCharge) return;
    try {
      const created = await shippingRateApi.create(
        {
          shipping_profile_id: profileId,
          shipping_zone_id: rateZoneId,
          minimum_weight: parseFloat(rateMinWeight),
          maximum_weight: parseFloat(rateMaxWeight),
          shipping_charge: parseFloat(rateCharge),
        },
        token
      );
      setRates((prev) => [...prev, created]);
      setRateZoneId("");
      setRateMinWeight("");
      setRateMaxWeight("");
      setRateCharge("");
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  }

  async function handleRemoveRate(rateId: string) {
    if (!token) return;
    try {
      await shippingRateApi.remove(rateId, token);
      setRates((prev) => prev.filter((r) => r.id !== rateId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  }

  function zoneName(id: string) {
    return zones.find((z) => z.id === id)?.zone_name || id;
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

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Shipping Profiles</h1>
          <div className="flex gap-2">
            <Link
              href={`/shipping/zones?tenantId=${tenantId}&storeId=${storeId}`}
              className="inline-flex items-center gap-1.5 text-sm text-[#5b4ef9] hover:bg-[#5b4ef9]/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              Zones
            </Link>
            <Link
              href={`/shipping/partners?tenantId=${tenantId}&storeId=${storeId}`}
              className="inline-flex items-center gap-1.5 text-sm text-[#5b4ef9] hover:bg-[#5b4ef9]/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Truck className="w-4 h-4" />
              Partners
            </Link>
          </div>
        </div>
        <p className="text-gray-500 mb-6">
          Group shipping rates by weight and zone. Click a profile to manage its rates.
        </p>

        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 mb-6">
          <input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Profile name (e.g. Standard)" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          <input value={threshold} onChange={(e) => setThreshold(e.target.value)} type="number" placeholder="Free shipping over ₹" className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          <button type="submit" disabled={isCreating} className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</p>}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No shipping profiles yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <button onClick={() => toggleExpand(profile.id)} className="flex items-center gap-3 flex-1 text-left">
                    <div className="w-8 h-8 rounded-lg bg-[#5b4ef9]/10 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-[#5b4ef9]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{profile.profile_name}</p>
                      {profile.free_shipping_threshold && (
                        <p className="text-xs text-gray-400">Free shipping over ₹{profile.free_shipping_threshold}</p>
                      )}
                    </div>
                  </button>
                  <button onClick={() => handleDelete(profile.id)} disabled={deletingId === profile.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {expandedId === profile.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-2">RATES BY ZONE</p>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      <select value={rateZoneId} onChange={(e) => setRateZoneId(e.target.value)} className="col-span-2 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30">
                        <option value="">Zone</option>
                        {zones.map((z) => (
                          <option key={z.id} value={z.id}>{z.zone_name}</option>
                        ))}
                      </select>
                      <input value={rateMinWeight} onChange={(e) => setRateMinWeight(e.target.value)} placeholder="Min kg" type="number" className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
                      <input value={rateMaxWeight} onChange={(e) => setRateMaxWeight(e.target.value)} placeholder="Max kg" type="number" className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
                      <div className="flex gap-1">
                        <input value={rateCharge} onChange={(e) => setRateCharge(e.target.value)} placeholder="₹" type="number" className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
                        <button onClick={() => handleAddRate(profile.id)} className="bg-[#5b4ef9] text-white px-2 rounded-lg shrink-0">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {rates.length === 0 ? (
                      <p className="text-xs text-gray-400">No rates yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {rates.map((rate) => (
                          <div key={rate.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 text-xs">
                            <span>{zoneName(rate.shipping_zone_id)}: {rate.minimum_weight}-{rate.maximum_weight}kg → ₹{rate.shipping_charge}</span>
                            <button onClick={() => handleRemoveRate(rate.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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

export default function ProfilesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <ProfilesContent />
    </Suspense>
  );
}