"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  getCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/services-engine";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategory(id);

        setCategoryName(data.categoryName);
        setCategorySlug(data.categorySlug);
        setCategoryType(data.categoryType || "");
        setIsActive(data.isActive);
      } catch (err) {
        console.error(err);
        setError("Failed to load category.");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateCategory(id, {
        categoryName,
        categorySlug,
        categoryType: categoryType || null,
        isActive,
      });

      alert("Category updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);

      router.push("/platform-admin-portal/service-engine/categories");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
          Loading category...
        </div>
      </main>
    );
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

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">
              Edit Category
            </h1>

            <p className="mt-2 text-slate-500">
              Update category information.
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        <form
          onSubmit={handleUpdate}
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
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category Slug *
              </label>

              <input
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category Type
              </label>

              <input
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Status
              </label>

              <select
                value={isActive ? "true" : "false"}
                onChange={(e) => setIsActive(e.target.value === "true")}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}