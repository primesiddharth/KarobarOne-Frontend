"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

import { createSocialPlatform } from "@/lib/api/social";

export default function NewSocialPlatformPage() {
  const router = useRouter();

  const { token } = useAuth();

  const [platformCode, setPlatformCode] = useState("");
  const [platformName, setPlatformName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [iconMediaId, setIconMediaId] = useState("");
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

    if (!platformCode || !platformName) {
      setError(
        "Platform Code and Platform Name are required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createSocialPlatform(
        {
          platformCode,
          platformName,
          baseUrl: baseUrl || null,
          iconMediaId: iconMediaId || null,
          isActive,
        },
        token
      );

      alert("Social platform created successfully.");

      router.push(
        "/platform-admin-portal/social/social-platforms"
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to create social platform.");
    } finally {
      setSaving(false);
    }
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

        <div className="mt-5">
          <h1 className="text-4xl font-bold text-slate-950">
            Add Social Platform
          </h1>

          <p className="mt-2 text-slate-500">
            Register a new supported social media platform.
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
              Platform Code *
            </label>

            <input
              value={platformCode}
              onChange={(e) =>
                setPlatformCode(e.target.value)
              }
              placeholder="INSTAGRAM"
              maxLength={50}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Platform Name *
            </label>

            <input
              value={platformName}
              onChange={(e) =>
                setPlatformName(e.target.value)
              }
              placeholder="Instagram"
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
              placeholder="https://instagram.com/"
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
              placeholder="Media UUID"
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

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/platform-admin-portal/social/social-platforms"
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Platform"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}