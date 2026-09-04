"use client";

import Link from "next/link";
import {
  Image as ImageIcon,
  FileImage,
  Tags,
  Layers3,
  UploadCloud,
  ArrowRight,
  RefreshCw,
  Plus,
} from "lucide-react";

const modules = [
  {
    title: "Media Files",
    description: "Upload, view, manage and organize your media files.",
    href: "/platform-admin-portal/media/files",
    icon: FileImage,
    action: "Manage Files",
  },
  {
    title: "Media Metadata",
    description: "Manage titles, descriptions, captions, tags and image details.",
    href: "/platform-admin-portal/media/metadata",
    icon: Tags,
    action: "Manage Metadata",
  },
  {
    title: "Media Variants",
    description: "Manage resized and optimized versions of your media files.",
    href: "/platform-admin-portal/media/variants",
    icon: Layers3,
    action: "Manage Variants",
  },
  {
    title: "Upload Logs",
    description: "Track upload history, status and upload errors.",
    href: "/platform-admin-portal/media/upload-logs",
    icon: UploadCloud,
    action: "View Upload Logs",
  },
];

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                <ImageIcon className="h-7 w-7 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
                  Content
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  Media Library
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage files, metadata, variants and upload history.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <Link
                href="/media/files"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Upload Media
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Overview */}
        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Media Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a section to manage your media content.
            </p>
          </div>

          {/* Module Cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.title}
                  href={module.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition group-hover:bg-indigo-100">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>

                    <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-900">
                      {module.title}
                    </h3>

                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                      {module.description}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-6 text-sm font-semibold text-indigo-600">
                    {module.action}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Library Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick overview of your media library.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Files */}
            <Link
              href="/media/files"
              className="rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-100 hover:bg-indigo-50/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <FileImage className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Total Files</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    —
                  </p>
                </div>
              </div>
            </Link>

            {/* Metadata */}
            <Link
              href="/media/metadata"
              className="rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-100 hover:bg-indigo-50/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Tags className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Metadata</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    —
                  </p>
                </div>
              </div>
            </Link>

            {/* Variants */}
            <Link
              href="/media/variants"
              className="rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-100 hover:bg-indigo-50/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Layers3 className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Variants</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    —
                  </p>
                </div>
              </div>
            </Link>

            {/* Upload Logs */}
            <Link
              href="/media/upload-logs"
              className="rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-100 hover:bg-indigo-50/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <UploadCloud className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Upload Logs</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    —
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Workflow */}
        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Media Workflow
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Upload your media files first, then add metadata and manage
                variants. Upload logs help you track the status of every
                upload.
              </p>
            </div>

            <Link
              href="/media/files"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Go to Media Files
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}