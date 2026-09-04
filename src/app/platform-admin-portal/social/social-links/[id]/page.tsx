"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

import {
  getSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "@/lib/api/social";

export default function SocialLinkDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { token, isLoading: authLoading } = useAuth();

  const id = params.id as string;

  const [storeId, setStoreId] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !token || !id) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getSocialLink(id, token);

        setStoreId(data.storeId);
        setPlatformId(data.platformId);
        setProfileUrl(data.profileUrl);
        setIsActive(data.isActive);
      } catch (err) {
        console.error(err);
        setError("Failed to load social link.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, token, authLoading]);

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!token) return;

    try {
      setSaving(true);
      setError("");

      await updateSocialLink(
        id,
        {
          profileUrl,
          isActive,
        },
        token
      );

      alert("Social link updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update social link.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this social link?"
    );

    if (!confirmed) return;

    try {
      await deleteSocialLink(id, token);

      alert("Social link deleted successfully.");

      router.push(
        "/platform-admin-portal/social/social-links"
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete social link.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
          Loading social link...
        </div>
      </main>
    );
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

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">
              Edit Social Link
            </h1>

            <p className="mt-2 text-slate-500">
              Update profile URL or active state.
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleUpdate}
          className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Store ID
            </label>

            <input
              value={storeId}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Platform ID
            </label>

            <input
              value={platformId}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Profile URL
            </label>

            <input
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              maxLength={255}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}