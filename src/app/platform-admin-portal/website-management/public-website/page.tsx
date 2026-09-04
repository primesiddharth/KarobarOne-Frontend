"use client";

import { useState } from "react";
import {
  Globe2,
  Search,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import {
  getPublicWebsite,
  getWebsiteByDomain,
} from "@/lib/api/websites";

import type { WebsiteResponse } from "@/types/websites";

export default function PublicWebsitePage() {
  const [slug, setSlug] = useState("");
  const [host, setHost] = useState("");

  const [website, setWebsite] = useState<WebsiteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolver, setResolver] = useState<"slug" | "domain" | null>(
    null
  );

  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function resolveBySlug() {
    setError("");
    setWebsite(null);
    setResolver("slug");

    if (!slug.trim()) {
      setError("Website slug is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await getPublicWebsite(slug.trim());

      setWebsite(response);
    } catch (err) {
      console.error(err);
      setError("Unable to resolve website by slug.");
    } finally {
      setLoading(false);
    }
  }

  async function resolveByDomain() {
    setError("");
    setWebsite(null);
    setResolver("domain");

    if (!host.trim()) {
      setError("Domain or host is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await getWebsiteByDomain(host.trim());

      setWebsite(response);
    } catch (err) {
      console.error(err);
      setError("Unable to resolve website by domain.");
    } finally {
      setLoading(false);
    }
  }

  async function copyWebsiteData() {
    if (!website) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(website, null, 2)
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy website data.");
    }
  }

  function getPublicUrl() {
    if (!website) return null;

    if (website.domain) {
      return `https://${website.domain}`;
    }

    if (website.slug) {
      return `/company/${website.slug}`;
    }

    return null;
  }

  const publicUrl = getPublicUrl();

  return (
    <main className="min-h-screen bg-[#f6f9fc] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Globe2 size={17} />
            Website Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Public Website
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Resolve and inspect a public storefront using its
            domain or website slug.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* SLUG RESOLVER */}
          <section className="rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="border-b border-blue-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Search size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-950">
                    Resolve by Slug
                  </h2>

                  <p className="text-xs text-gray-500">
                    Find a public website using its slug
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Website Slug
                </label>

                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. my-business"
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={resolveBySlug}
                disabled={loading && resolver === "slug"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && resolver === "slug" ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Resolving...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Resolve Website
                  </>
                )}
              </button>
            </div>
          </section>

          {/* DOMAIN RESOLVER */}
          <section className="rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="border-b border-blue-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Globe2 size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-950">
                    Resolve by Domain
                  </h2>

                  <p className="text-xs text-gray-500">
                    Find a public website using its host
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Domain / Host
                </label>

                <input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="e.g. example.com"
                  className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                />

                <p className="mt-2 text-xs text-gray-400">
                  The value is sent as the request Host header.
                </p>
              </div>

              <button
                type="button"
                onClick={resolveByDomain}
                disabled={loading && resolver === "domain"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && resolver === "domain" ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Resolving...
                  </>
                ) : (
                  <>
                    <Globe2 size={18} />
                    Resolve Domain
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* RESULT */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
            <div>
              <h2 className="font-bold text-gray-950">
                Website Result
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Resolved public website information
              </p>
            </div>

            {website && (
              <button
                type="button"
                onClick={copyWebsiteData}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy Data
                  </>
                )}
              </button>
            )}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Loader2
                    size={25}
                    className="animate-spin"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  Resolving website...
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Fetching public website information.
                </p>
              </div>
            ) : website ? (
              <div className="space-y-5">

                {/* WEBSITE SUMMARY */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                    <p className="text-xs font-medium text-gray-500">
                      Company
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      {website.companyName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                    <p className="text-xs font-medium text-gray-500">
                      Slug
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      {website.slug}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                    <p className="text-xs font-medium text-gray-500">
                      Status
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      {website.status}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                    <p className="text-xs font-medium text-gray-500">
                      Business Type
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      {website.businessType}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                    <p className="text-xs font-medium text-gray-500">
                      Theme
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      {website.theme || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                    <p className="text-xs font-medium text-gray-500">
                      Domain
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      {website.domain || "Not connected"}
                    </p>
                  </div>
                </div>

                {/* PUBLIC URL */}
                {publicUrl && (
                  <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Public URL
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-blue-700">
                        {publicUrl}
                      </p>
                    </div>

                    {website.domain && (
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        <ExternalLink size={15} />
                        Open Website
                      </a>
                    )}
                  </div>
                )}

                {/* RAW RESPONSE */}
                <details className="rounded-xl border border-blue-100">
                  <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-gray-700">
                    View API Response
                  </summary>

                  <pre className="overflow-x-auto border-t border-blue-100 bg-gray-50 p-5 text-xs leading-6 text-gray-600">
                    {JSON.stringify(website, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                  <Globe2 size={24} />
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  No website resolved yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Enter a website slug or domain above to resolve
                  the public storefront.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* INFO */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex gap-3">
            <Globe2
              size={19}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Public Storefront Resolver
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800/70">
                Resolve a public website by its slug or domain.
                This module does not create, update, delete, or
                publish websites.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}