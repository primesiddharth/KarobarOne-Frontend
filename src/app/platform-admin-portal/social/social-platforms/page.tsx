"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/context/auth-context";

import {
  listSocialPlatforms,
  deleteSocialPlatform,
} from "@/lib/api/social";

import type { SocialPlatformResponse } from "@/types/social";

export default function SocialPlatformsPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [platforms, setPlatforms] = useState<
    SocialPlatformResponse[]
  >([]);

  const [activeOnly, setActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPlatforms() {
    if (!token) {
      setPlatforms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await listSocialPlatforms(
        activeOnly,
        token
      );

      setPlatforms(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load social platforms.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;

    loadPlatforms();
  }, [token, authLoading, activeOnly]);

  async function handleDelete(id: string) {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this social platform?"
    );

    if (!confirmed) return;

    try {
      await deleteSocialPlatform(id, token);

      setPlatforms((prev) =>
        prev.filter((item) => item.id !== id)
      );

      alert("Social platform deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete social platform.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/platform-admin-portal/social"
          className="text-sm font-medium text-blue-600"
        >
          ← Social Management
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">
              Social Platforms
            </h1>

            <p className="mt-2 text-slate-500">
              Manage supported social media platforms.
            </p>
          </div>

          <Link
            href="/platform-admin-portal/social/social-platforms/new"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Add Platform
          </Link>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            id="activeOnly"
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="h-4 w-4"
          />

          <label
            htmlFor="activeOnly"
            className="text-sm font-semibold text-slate-700"
          >
            Show active platforms only
          </label>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-slate-500">
              Loading platforms...
            </div>
          ) : platforms.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No social platforms found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Code
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Platform Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Base URL
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {platforms.map((platform) => (
                    <tr
                      key={platform.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-sm text-slate-700">
                          {platform.platformCode}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold text-slate-900">
                        {platform.platformName}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {platform.baseUrl || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            platform.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {platform.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/platform-admin-portal/social/social-platforms/${platform.id}`}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(platform.id)
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
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
          )}
        </div>
      </div>
    </main>
  );
}