"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createCategory } from "@/lib/api/services-engine";

export default function NewCategoryPage() {
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryType, setCategoryType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tenantId = "default-tenant";

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setCategoryName(value);

    if (!categorySlug) {
      setCategorySlug(generateSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!categoryName.trim() || !categorySlug.trim()) {
      setError("Category name and slug are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCategory({
        tenantId,
        categoryName: categoryName.trim(),
        categorySlug: categorySlug.trim(),
        categoryType: categoryType.trim() || null,
      });

      router.push("/platform-admin-portal/service-engine/categories");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to create category.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/platform-admin-portal/service-engine/categories"
          className="text-sm font-medium text-blue-600"
        >
          ← Categories
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-slate-950">
          Create Category
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category Name *
              </label>

              <input
                value={categoryName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Hair & Beauty"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category Slug *
              </label>

              <input
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                placeholder="hair-beauty"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category Type
              </label>

              <input
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
                placeholder="e.g. SERVICE"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/platform-admin-portal/service-engine/categories"
              className="rounded-xl border px-5 py-3 font-semibold"
            >
              Cancel
            </Link>

            <button
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}