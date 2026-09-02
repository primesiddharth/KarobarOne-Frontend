"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Package, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { orderApi, orderItemApi, paymentApi } from "@/lib/api/commerce";
import { ApiError } from "@/lib/api-client";
import { Order, OrderItem } from "@/types/commerce";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

function OrderDetailContent() {
  const { token } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const load = useCallback(() => {
    if (!token || !orderId) return;
    Promise.all([
      orderApi.getById(orderId, token),
      orderItemApi.listByOrder(orderId, token),
    ])
      .then(([o, i]) => {
        setOrder(o);
        setItems(i);
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, orderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(newStatus: string) {
    if (!token || !order) return;
    setIsSaving(true);
    try {
      const updated = await orderApi.update(orderId, { order_status: newStatus }, token);
      setOrder(updated);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRefund() {
    if (!token || !order?.payment_id) return;
    if (!confirm("Issue a full refund for this order's payment?")) return;
    setIsRefunding(true);
    try {
      await paymentApi.refund({ payment_id: order.payment_id }, token);
      alert("Refund initiated.");
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setIsRefunding(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading order...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/orders?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">{order?.order_number}</h1>
        <p className="text-gray-500 mb-6">Payment: {order?.payment_status}</p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <label className="block text-sm text-gray-700 mb-2">Order Status</label>
          <select
            value={order?.order_status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <h2 className="font-semibold text-gray-900 mb-3">Items</h2>
        {items.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 mb-6">
            <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No items found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                <p className="text-sm text-gray-900">Product: {item.product_id}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × ₹{item.unit_price}
                </p>
              </div>
            ))}
          </div>
        )}

        {order?.payment_id && (
          <button
            onClick={handleRefund}
            disabled={isRefunding}
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            {isRefunding ? "Processing..." : "Refund Payment"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}