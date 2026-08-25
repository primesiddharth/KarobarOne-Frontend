"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Layers,
  Tags,
  ImageIcon,
  Upload,
  Star,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { productApi } from "@/lib/api/catalog";
import {
  variantApi,
  attributeApi,
  imageApi,
} from "@/lib/api/catalog-extras";
import { ApiError } from "@/lib/api-client";
import { Product } from "@/types/catalog";
import {
  Variant,
  Attribute,
  AttributeMapping,
  ProductImage,
} from "@/types/catalog-extras";

const TABS = [
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "variants", label: "Variants", icon: Layers },
  { id: "attributes", label: "Attributes", icon: Tags },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProductDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.productId as string;
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [tab, setTab] = useState<TabId>("images");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !productId) return;
    productApi
      .getById(productId, token)
      .then(setProduct)
      .finally(() => setIsLoading(false));
  }, [token, productId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href={`/catalog/products?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {isLoading ? "Loading..." : product?.name || "Product"}
        </h1>
        <p className="text-gray-500 mb-6">
          Manage images, variants, and custom attributes for this product.
        </p>

        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-[#5b4ef9] text-[#5b4ef9]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "images" && <ImagesTab productId={productId} token={token} />}
        {tab === "variants" && <VariantsTab productId={productId} token={token} />}
        {tab === "attributes" && (
          <AttributesTab productId={productId} tenantId={tenantId} token={token} />
        )}
      </div>
    </div>
  );
}

// ---------------- Images Tab ----------------
function ImagesTab({ productId, token }: { productId: string; token: string | null }) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    imageApi
      .listByProduct(productId, token)
      .then(setImages)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, productId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setError(null);
    setIsUploading(true);
    try {
      const uploaded = await imageApi.upload(file, productId, token);
      setImages((prev) => [...prev, uploaded]);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Upload failed.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(imageId: string) {
    if (!token) return;
    try {
      await imageApi.remove(imageId, token);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-8 cursor-pointer hover:border-[#5b4ef9] hover:bg-[#5b4ef9]/5 transition-colors">
        <Upload className="w-5 h-5 text-gray-400" />
        <span className="text-gray-500 text-sm">
          {isUploading ? "Uploading..." : "Click to upload an image"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden aspect-square"
            >
              <img
                src={img.url}
                alt={img.altText || ""}
                className="w-full h-full object-cover"
              />
              {img.isPrimary && (
                <span className="absolute top-2 left-2 bg-[#5b4ef9] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Primary
                </span>
              )}
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Variants Tab ----------------
function VariantsTab({ productId, token }: { productId: string; token: string | null }) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSku, setEditSku] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editInventory, setEditInventory] = useState("");

  const load = useCallback(() => {
    if (!token) return;
    variantApi
      .listByProduct(productId, token)
      .then(setVariants)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, productId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !sku || !price) return;

    setError(null);
    setIsCreating(true);
    try {
      const created = await variantApi.create(
        {
          productId,
          sku,
          price: parseFloat(price),
          inventory: inventory ? parseInt(inventory, 10) : 0,
        },
        token
      );
      setVariants((prev) => [...prev, created]);
      setSku("");
      setPrice("");
      setInventory("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(variantId: string) {
    if (!token) return;
    try {
      await variantApi.remove(variantId, token);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  }

  function startEdit(v: Variant) {
    setEditingId(v.id);
    setEditSku(v.sku);
    setEditPrice(String(v.price));
    setEditInventory(String(v.inventory));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(variantId: string) {
    if (!token || !editSku || !editPrice) return;
    setBusyId(variantId);
    try {
      const updated = await variantApi.update(
        variantId,
        {
          sku: editSku,
          price: parseFloat(editPrice),
          inventory: editInventory ? parseInt(editInventory, 10) : 0,
        },
        token
      );
      setVariants((prev) => prev.map((v) => (v.id === variantId ? updated : v)));
      setEditingId(null);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleCreate}
        className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-3"
      >
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="SKU (e.g. SHIRT-RED-M)"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          step="0.01"
          placeholder="Price"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        />
        <div className="flex gap-2">
          <input
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            type="number"
            placeholder="Stock"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <button
            type="submit"
            disabled={isCreating || !sku || !price}
            className="bg-[#5b4ef9] text-white px-3 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading variants...</p>
      ) : variants.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No variants yet — add sizes, colors, etc. above.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {variants.map((v) =>
            editingId === v.id ? (
              <div key={v.id} className="px-5 py-3.5 grid grid-cols-3 gap-2 items-center">
                <input
                  value={editSku}
                  onChange={(e) => setEditSku(e.target.value)}
                  autoFocus
                  className="px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                />
                <input
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  type="number"
                  step="0.01"
                  className="px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                />
                <div className="flex items-center gap-1">
                  <input
                    value={editInventory}
                    onChange={(e) => setEditInventory(e.target.value)}
                    type="number"
                    className="w-16 px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => saveEdit(v.id)}
                    disabled={busyId === v.id}
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
              <div key={v.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-gray-900">{v.sku}</p>
                  <p className="text-sm text-gray-500">
                    ₹{v.price} · {v.inventory} in stock
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(v)}
                    className="p-2 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  );
}

// ---------------- Attributes Tab ----------------
function AttributesTab({
  productId,
  tenantId,
  token,
}: {
  productId: string;
  tenantId: string;
  token: string | null;
}) {
  const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
  const [mappings, setMappings] = useState<AttributeMapping[]>([]);
  const [selectedAttributeId, setSelectedAttributeId] = useState("");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    Promise.all([
      attributeApi.list(token),
      attributeApi.getMappingsForProduct(productId, token),
    ])
      .then(([attrs, maps]) => {
        setAllAttributes(attrs);
        setMappings(maps);
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, productId]);

  useEffect(() => {
    load();
  }, [load]);

  function attributeName(id: string) {
    return allAttributes.find((a) => a.id === id)?.name || "Unknown";
  }

  async function handleAddMapping(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !selectedAttributeId || !value) return;

    setError(null);
    setIsSaving(true);
    try {
      const created = await attributeApi.mapToProduct(
        productId,
        { attributeId: selectedAttributeId, value },
        token
      );
      setMappings((prev) => [...prev, created]);
      setSelectedAttributeId("");
      setValue("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveMapping(mappingId: string) {
    if (!token) return;
    try {
      await attributeApi.removeMapping(mappingId, token);
      setMappings((prev) => prev.filter((m) => m.id !== mappingId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleAddMapping}
        className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3"
      >
        <select
          value={selectedAttributeId}
          onChange={(e) => setSelectedAttributeId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        >
          <option value="">
            {allAttributes.length === 0 ? "No attributes defined yet" : "Select attribute"}
          </option>
          {allAttributes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value (e.g. Cotton)"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        />
        <button
          type="submit"
          disabled={isSaving || !selectedAttributeId || !value}
          className="bg-[#5b4ef9] text-white px-4 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      <p className="text-xs text-gray-400">
        Attributes are defined at the tenant level. To create a new one (not just
        assign a value), do it via your attributes list first.
      </p>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading attributes...</p>
      ) : mappings.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No attributes assigned yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {mappings.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3.5">
              <p className="text-sm">
                <span className="font-medium text-gray-900">{attributeName(m.attributeId)}:</span>{" "}
                <span className="text-gray-600">{m.value}</span>
              </p>
              <button
                onClick={() => handleRemoveMapping(m.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}