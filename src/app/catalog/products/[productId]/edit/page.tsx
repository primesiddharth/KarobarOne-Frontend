"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { productApi, categoryApi, brandApi } from "@/lib/api/catalog";
import { ApiError } from "@/lib/api-client";
import { Category, Brand } from "@/types/catalog";

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function EditProductPageContent() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.productId as string;
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !productId) return;

    Promise.all([
      productApi.getById(productId, token),
      categoryApi.list(token),
      brandApi.list(token),
    ])
      .then(([product, cats, brs]) => {
        setName(product.name);
        setDescription(product.description || "");
        setSku(product.sku || "");
        setStatus(product.status);
        setCategoryId(product.categoryId || "");
        setBrandId(product.brandId || "");
        setCategories(cats);
        setBrands(brs);
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
        else setError("Failed to load product.");
      })
      .finally(() => setIsLoading(false));
  }, [token, productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setIsSaving(true);

    try {
      await productApi.update(
        productId,
        {
          name,
          description: description || null,
          sku: sku || null,
          status,
          categoryId: categoryId || null,
          brandId: brandId || null,
        },
        token
      );
      router.push(`/catalog/products?tenantId=${tenantId}&storeId=${storeId}`);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-lg mx-auto">
        <Link
          href={`/catalog/products?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#5b4ef9]/10 p-2 rounded-lg">
              <Pencil className="w-5 h-5 text-[#5b4ef9]" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1.5 text-sm">Product Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30 focus:border-[#5b4ef9]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5 text-sm">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30 focus:border-[#5b4ef9]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">SKU</label>
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30 focus:border-[#5b4ef9]"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5 text-sm">Brand</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
                >
                  <option value="">None</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#5b4ef9] text-white py-3 rounded-lg font-semibold hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <EditProductPageContent />
    </Suspense>
  );
}
