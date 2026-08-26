"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Pencil, Trash2, Package, Layers } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { productApi, categoryApi } from "@/lib/api/catalog";
import { ApiError } from "@/lib/api-client";
import { Product, Category } from "@/types/catalog";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-red-100 text-red-700",
};

function ProductListPageContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryNameById = (id: string | null) =>
    categories.find((c) => c.id === id)?.name || "Uncategorized";

  const loadProducts = useCallback(async () => {
    if (!token || !tenantId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await productApi.search(
        {
          tenantId,
          storeId: storeId || undefined,
          categoryId: categoryFilter || undefined,
          search: search || undefined,
        },
        token
      );
      setProducts(result.data);
      setTotal(result.total);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [token, tenantId, storeId, categoryFilter, search]);

  useEffect(() => {
    if (!token) return;
    categoryApi.list(token).then(setCategories).catch(() => {});
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleDelete(productId: string) {
    if (!token) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(productId);
    try {
      await productApi.remove(productId, token);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setTotal((t) => t - 1);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">
              {total} product{total !== 1 ? "s" : ""} in your catalog
            </p>
          </div>
          <Link
            href={`/catalog/add-product?tenantId=${tenantId}&storeId=${storeId}`}
            className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#4a3ee0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30 focus:border-[#5b4ef9]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No products yet.</p>
            <Link
              href={`/catalog/add-product?tenantId=${tenantId}&storeId=${storeId}`}
              className="text-[#5b4ef9] font-medium hover:underline mt-2 inline-block"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#5b4ef9]/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-[#5b4ef9]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {categoryNameById(product.categoryId)}
                      {product.sku ? ` · SKU: ${product.sku}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[product.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.status}
                  </span>
                  <Link
                    href={`/catalog/products/${product.id}?tenantId=${tenantId}&storeId=${storeId}`}
                    title="Manage images, variants, attributes"
                    className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/catalog/products/${product.id}/edit?tenantId=${tenantId}&storeId=${storeId}`}
                    title="Edit product details"
                    className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default function ProductListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <ProductListPageContent />
    </Suspense>
  );
}
