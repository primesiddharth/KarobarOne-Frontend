"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/context/auth-context";

import {
  listSocialLinks,
  deleteSocialLink,
} from "@/lib/api/social";

import type { SocialLinkResponse } from "@/types/social";

export default function SocialLinksPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [links, setLinks] = useState<SocialLinkResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLinks() {
    if (!token) {
      setLinks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await listSocialLinks(undefined, token);

      setLinks(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load social links.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;

    loadLinks();
  }, [token, authLoading]);

  async function handleDelete(id: string) {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this social link?"
    );

    if (!confirmed) return;

    try {
      await deleteSocialLink(id, token);

      setLinks((prev) => prev.filter((item) => item.id !== id));

      alert("Social link deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete social link.");
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
              Social Links
            </h1>

            <p className="mt-2 text-slate-500">
              Manage social media links mapped to stores.
            </p>
          </div>

          <Link
            href="/platform-admin-portal/social/social-links/new"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Add Social Link
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-slate-500">
              Loading social links...
            </div>
          ) : links.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                No social links found.
              </p>

              <Link
                href="/platform-admin-portal/social/social-links/new"
                className="mt-4 inline-block font-semibold text-blue-600"
              >
                Create your first social link →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Store ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Platform ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Profile URL
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
                  {links.map((link) => (
                    <tr
                      key={link.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 text-sm text-slate-700">
                        {link.storeId}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {link.platformId}
                      </td>

                      <td className="max-w-[300px] truncate px-6 py-5 text-sm text-blue-600">
                        {link.profileUrl}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            link.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {link.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/platform-admin-portal/social/social-links/${link.id}`}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(link.id)}
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