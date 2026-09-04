"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

import { createSocialLink } from "@/lib/api/social";

export default function NewSocialLinkPage() {
  const router = useRouter();

  const { token } = useAuth();

  const [storeId, setStoreId] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!token) {
      setError("Authentication required.");
      return;
    }

    if (!storeId || !platformId || !profileUrl) {
      setError(
        "Store ID, Platform ID and Profile URL are required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createSocialLink(
        {
          storeId,
          platformId,
          profileUrl,
          isActive,
        },
        token
      );

      alert("Social link created successfully.");

      router.push(
        "/platform-admin-portal/social/social-links"
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to create social link.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/platform-admin-portal/social/social-links"
          className="text-sm font-medium text-blue-600"
        >
          ← Social Links
        </Link>

        <div className="mt-5">
          <h1 className="text-4xl font-bold text-slate-950">
            Add Social Link
          </h1>

          <p className="mt-2 text-slate-500">
            Create a social media profile mapping for a store.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Store ID *
            </label>

            <input
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="Store UUID"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Platform ID *
            </label>

            <input
              value={platformId}
              onChange={(e) => setPlatformId(e.target.value)}
              placeholder="Social platform UUID"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Profile URL *
            </label>

            <input
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://instagram.com/yourprofile"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              maxLength={255}
              required
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold text-slate-700">
              Active
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/platform-admin-portal/social/social-links"
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Social Link"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}