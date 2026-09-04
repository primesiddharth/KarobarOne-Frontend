"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

import {
  getSocialPlatform,
  updateSocialPlatform,
  deleteSocialPlatform,
} from "@/lib/api/social";

export default function SocialPlatformDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { token, isLoading: authLoading } = useAuth();

  const id = params.id as string;

  const [platformCode, setPlatformCode] = useState("");
  const [platformName, setPlatformName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [iconMediaId, setIconMediaId] = useState("");
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

        const data = await getSocialPlatform(id, token);

        setPlatformCode(data.platformCode);
        setPlatformName(data.platformName);
        setBaseUrl(data.baseUrl || "");
        setIconMediaId(data.iconMediaId || "");
        setIsActive(data.isActive);
      } catch (err) {
        console.error(err);
        setError("Failed to load social platform.");
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

      await updateSocialPlatform(
        id,
        {
          platformName,
          baseUrl: baseUrl || null,
          iconMediaId: iconMediaId || null,
          isActive,
        },
        token
      );

      alert("Social platform updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update social platform.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this social platform?"
    );

    if (!confirmed) return;

    try {
      await deleteSocialPlatform(id, token);

      alert("Social platform deleted successfully.");

      router.push(
        "/platform-admin-portal/social/social-platforms"
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete social platform.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
          Loading social platform...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/platform-admin-portal/social/social-platforms"
          className="text-sm font-medium text-blue-600"
        >
          ← Social Platforms
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">
              Edit Social Platform
            </h1>

            <p className="mt-2 text-slate-500">
              Update platform configuration.
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
              Platform Code
            </label>

            <input
              value={platformCode}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
            />

            <p className="mt-1 text-xs text-slate-400">
              Platform code cannot be changed because it is not
              part of the PATCH request schema.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Platform Name
            </label>

            <input
              value={platformName}
              onChange={(e) =>
                setPlatformName(e.target.value)
              }
              maxLength={100}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Base URL
            </label>

            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              maxLength={255}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Icon Media ID
            </label>

            <input
              value={iconMediaId}
              onChange={(e) =>
                setIconMediaId(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
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