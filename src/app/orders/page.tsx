"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { orderApi } from "@/lib/api/commerce";
import { ApiError } from "@/lib/api-client";
import { Order } from "@/types/commerce";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function OrderListContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    orderApi
      .list(token)
      .then((all) => setOrders(all.filter((o) => !storeId || o.store_id === storeId)))
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, storeId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Orders</h1>
        <p className="text-gray-500 mb-8">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}?tenantId=${tenantId}&storeId=${storeId}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-500">
                    Payment: {order.payment_status}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    STATUS_STYLES[order.order_status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.order_status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>}>
      <OrderListContent />
    </Suspense>
  );
}