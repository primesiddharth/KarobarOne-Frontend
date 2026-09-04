"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getCategories,
  deleteCategory,
} from "@/lib/api/services-engine";

import type { ServiceCategory } from "@/types/services-engine";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tenantId = "default-tenant";

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories(tenantId);
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/platform-admin-portal/service-engine"
              className="text-sm font-medium text-blue-600"
            >
              ← Service Engine
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-950">
              Categories
            </h1>

            <p className="mt-2 text-slate-500">
              Create and manage service categories.
            </p>
          </div>

          <Link
            href="/platform-admin-portal/service-engine/categories/new"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Category
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-white p-8 text-slate-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-4xl">📁</div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No categories found
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first service category.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Name
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Type
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {category.categoryName}
                      </td>

                      <td className="px-6 py-5 text-slate-500">
                        {category.categorySlug}
                      </td>

                      <td className="px-6 py-5 text-slate-500">
                        {category.categoryType || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-4">
                          <Link
                            href={`/platform-admin-portal/service-engine/categories/${category.id}`}
                            className="font-medium text-blue-600"
                          >
                            View / Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(category.id)}
                            className="font-medium text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}