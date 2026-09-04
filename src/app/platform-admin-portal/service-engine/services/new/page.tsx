"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  createService,
  getCategories,
} from "@/lib/api/services-engine";

import type { ServiceCategory } from "@/types/services-engine";

export default function NewServicePage() {
  const router = useRouter();

  const tenantId = "default-tenant";

  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [serviceName, setServiceName] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [serviceType, setServiceType] = useState("PHYSICAL");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState("");
  const [duration, setDuration] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaSlug, setMetaSlug] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories(tenantId);
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setServiceName(value);

    if (!serviceSlug) {
      setServiceSlug(generateSlug(value));
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !serviceName.trim() ||
      !serviceSlug.trim() ||
      !categoryId ||
      !pricing ||
      !duration
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createService({
        tenantId,
        categoryId,
        serviceName: serviceName.trim(),
        serviceSlug: serviceSlug.trim(),
        serviceType,
        description: description.trim() || null,
        pricing,
        duration: Number(duration),
        metaTitle: metaTitle.trim() || null,
        metaDescription: metaDescription.trim() || null,
        metaSlug: metaSlug.trim() || null,
      });

      router.push(
        "/platform-admin-portal/service-engine/services"
      );

      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to create service.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/platform-admin-portal/service-engine/services"
          className="text-sm font-medium text-blue-600"
        >
          ← Services
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-slate-950">
          Create Service
        </h1>

        <p className="mt-2 text-slate-500">
          Add a new service to the service engine.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Service Name *
              </label>

              <input
                value={serviceName}
                onChange={(e) =>
                  handleNameChange(e.target.value)
                }
                placeholder="e.g. Haircut"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Service Slug *
              </label>

              <input
                value={serviceSlug}
                onChange={(e) =>
                  setServiceSlug(e.target.value)
                }
                placeholder="haircut"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category *
              </label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                disabled={loadingCategories}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Service Type *
              </label>

              <select
                value={serviceType}
                onChange={(e) =>
                  setServiceType(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="PHYSICAL">Physical</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Pricing *
              </label>

              <input
                type="number"
                min="0"
                value={pricing}
                onChange={(e) =>
                  setPricing(e.target.value)
                }
                placeholder="500"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Duration (minutes) *
              </label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
                placeholder="60"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              placeholder="Describe the service..."
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="mt-8 border-t pt-8">
            <h2 className="text-lg font-bold text-slate-900">
              SEO Information
            </h2>

            <div className="mt-5 grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Meta Title
                </label>

                <input
                  value={metaTitle}
                  onChange={(e) =>
                    setMetaTitle(e.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Meta Slug
                </label>

                <input
                  value={metaSlug}
                  onChange={(e) =>
                    setMetaSlug(e.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Meta Description
                </label>

                <textarea
                  value={metaDescription}
                  onChange={(e) =>
                    setMetaDescription(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/platform-admin-portal/service-engine/services"
              className="rounded-xl border px-5 py-3 font-semibold"
            >
              Cancel
            </Link>

            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}