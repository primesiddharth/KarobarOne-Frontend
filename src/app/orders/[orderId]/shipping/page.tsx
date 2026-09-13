"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Truck, MapPin, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { shipmentApi, shippingPartnerApi, shiprocketApi } from "@/lib/api/shipping";
import { ApiError } from "@/lib/api-client";
import { Shipment, ShippingPartner } from "@/types/shipping";

function ShipmentTrackerContent() {
  const { token } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [partners, setPartners] = useState<ShippingPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [partnerId, setPartnerId] = useState("");
  const [shipmentNumber, setShipmentNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [pickupPincode, setPickupPincode] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [weight, setWeight] = useState("");
  const [serviceabilityResult, setServiceabilityResult] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const [trackAwb, setTrackAwb] = useState("");
  const [trackResult, setTrackResult] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const load = useCallback(() => {
    if (!token || !orderId) return;
    Promise.all([shipmentApi.listByOrder(orderId, token), shippingPartnerApi.list(token)])
      .then(([s, p]) => {
        setShipments(s);
        setPartners(p);
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, orderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateShipment(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !partnerId || !shipmentNumber.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const created = await shipmentApi.create(
        {
          order_id: orderId,
          shipping_partner_id: partnerId,
          shipment_number: shipmentNumber.trim(),
          tracking_number: trackingNumber.trim() || null,
        },
        token
      );
      setShipments((prev) => [...prev, created]);
      setShipmentNumber("");
      setTrackingNumber("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleCheckServiceability() {
    if (!token || !pickupPincode || !deliveryPincode || !weight) return;
    setIsChecking(true);
    setServiceabilityResult(null);
    try {
      const result = await shiprocketApi.checkServiceability(
        {
          pickup_postcode: pickupPincode,
          delivery_postcode: deliveryPincode,
          weight: parseFloat(weight),
          cod: 0,
        },
        token
      );
      setServiceabilityResult(JSON.stringify(result));
    } catch (err) {
      if (err instanceof ApiError) setServiceabilityResult(`Error: ${err.message}`);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleTrack() {
    if (!token || !trackAwb.trim()) return;
    setIsTracking(true);
    setTrackResult(null);
    try {
      const result = await shiprocketApi.track(trackAwb.trim(), token);
      setTrackResult(JSON.stringify(result));
    } catch (err) {
      if (err instanceof ApiError) setTrackResult(`Error: ${err.message}`);
    } finally {
      setIsTracking(false);
    }
  }

  function partnerName(id: string) {
    return partners.find((p) => p.id === id)?.partner_name || id;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/orders/${orderId}?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Shipping</h1>
        <p className="text-gray-500 mb-6">Create and track shipments for this order.</p>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</p>}

        {/* Create shipment */}
        <form onSubmit={handleCreateShipment} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-700">New Shipment</p>
          <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30">
            <option value="">Select courier partner</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>{p.partner_name}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input value={shipmentNumber} onChange={(e) => setShipmentNumber(e.target.value)} placeholder="Shipment number" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Tracking number (AWB)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          </div>
          <button type="submit" disabled={isCreating} className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" />
            Create Shipment
          </button>
        </form>

        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading shipments...</div>
        ) : shipments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 mb-6">
            <Truck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No shipments yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden mb-6">
            {shipments.map((s) => (
              <div key={s.id} className="px-5 py-3.5">
                <p className="text-sm font-medium text-gray-900">{partnerName(s.shipping_partner_id)} — {s.shipment_number}</p>
                <p className="text-xs text-gray-500">
                  {s.tracking_number ? `AWB: ${s.tracking_number}` : "No tracking number yet"} · {s.shipment_status}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Serviceability check */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#5b4ef9]" />
            Check Serviceability
          </p>
          <div className="grid grid-cols-3 gap-3">
            <input value={pickupPincode} onChange={(e) => setPickupPincode(e.target.value)} placeholder="Pickup pincode" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            <input value={deliveryPincode} onChange={(e) => setDeliveryPincode(e.target.value)} placeholder="Delivery pincode" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" type="number" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          </div>
          <button onClick={handleCheckServiceability} disabled={isChecking} className="bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
            {isChecking ? "Checking..." : "Check"}
          </button>
          {serviceabilityResult && (
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto max-h-32">{serviceabilityResult}</pre>
          )}
        </div>

        {/* Track shipment */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#5b4ef9]" />
            Track Shipment
          </p>
          <div className="flex gap-2">
            <input value={trackAwb} onChange={(e) => setTrackAwb(e.target.value)} placeholder="Enter AWB code" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            <button onClick={handleTrack} disabled={isTracking} className="bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
              {isTracking ? "Tracking..." : "Track"}
            </button>
          </div>
          {trackResult && (
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto max-h-32">{trackResult}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShipmentTrackerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <ShipmentTrackerContent />
    </Suspense>
  );
}