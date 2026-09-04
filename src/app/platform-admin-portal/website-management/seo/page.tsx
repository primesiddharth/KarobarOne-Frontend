"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Sparkles,
  FileSearch,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

import {
  listSeoMetadata,
  createSeoMetadata,
  updateSeoMetadata,
  deleteSeoMetadata,
  calculateSeoScore,
  generateAiSeoSuggestions,
  auditSeo,
  calculateKeywordDensity,
} from "@/lib/api/websites";

import type {
  SeoMetadataResponse,
  SeoMetadataCreate,
  SeoMetadataUpdate,
  SeoScoreResponse,
  AiSeoSuggestionResponse,
  SeoAuditResponse,
  KeywordDensityResponse,
} from "@/types/websites";

export default function SeoMetadataPage() {
  const [metadata, setMetadata] = useState<SeoMetadataResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [score, setScore] = useState<SeoScoreResponse | null>(null);
  const [suggestions, setSuggestions] =
    useState<AiSeoSuggestionResponse | null>(null);
  const [audit, setAudit] = useState<SeoAuditResponse | null>(null);
  const [keywordResult, setKeywordResult] =
    useState<KeywordDensityResponse | null>(null);

  const [form, setForm] = useState({
    tenantId: "",
    entityType: "",
    entityId: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    slug: "",
    robotsIndex: true,
    robotsFollow: true,
  });

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadMetadata();
  }, []);

  async function loadMetadata() {
    try {
      setLoading(true);
      setError("");

      const result = await listSeoMetadata();
      setMetadata(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load SEO metadata.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      tenantId: "",
      entityType: "",
      entityId: "",
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      slug: "",
      robotsIndex: true,
      robotsFollow: true,
    });

    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(item: SeoMetadataResponse) {
    setForm({
      tenantId: item.tenantId,
      entityType: item.entityType,
      entityId: item.entityId,
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      canonicalUrl: item.canonicalUrl || "",
      slug: item.slug,
      robotsIndex: item.robotsIndex,
      robotsFollow: item.robotsFollow,
    });

    setEditingId(item.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  async function handleSave() {
    try {
      setError("");
      setSuccess("");

      if (!form.tenantId || !form.entityType || !form.entityId) {
        setError("Tenant ID, Entity Type and Entity ID are required.");
        return;
      }

      if (!form.slug) {
        setError("Slug is required.");
        return;
      }

      if (editingId) {
        const data: SeoMetadataUpdate = {
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
          canonicalUrl: form.canonicalUrl || null,
          slug: form.slug || null,
          robotsIndex: form.robotsIndex,
          robotsFollow: form.robotsFollow,
        };

        await updateSeoMetadata(editingId, data);

        setSuccess("SEO metadata updated successfully.");
      } else {
        const data: SeoMetadataCreate = {
          tenantId: form.tenantId,
          entityType: form.entityType,
          entityId: form.entityId,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
          canonicalUrl: form.canonicalUrl || null,
          slug: form.slug,
          robotsIndex: form.robotsIndex,
          robotsFollow: form.robotsFollow,
        };

        await createSeoMetadata(data);

        setSuccess("SEO metadata created successfully.");
      }

      closeForm();
      await loadMetadata();
    } catch (err) {
      console.error(err);
      setError("Failed to save SEO metadata.");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this SEO metadata?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteSeoMetadata(id);

      setSuccess("SEO metadata deleted successfully.");

      await loadMetadata();
    } catch (err) {
      console.error(err);
      setError("Failed to delete SEO metadata.");
    }
  }

  async function handleScore() {
    try {
      setError("");

      const result = await calculateSeoScore({
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        canonicalUrl: form.canonicalUrl || null,
        slug: form.slug || null,
        robotsIndex: form.robotsIndex,
        robotsFollow: form.robotsFollow,
      });

      setScore(result);
    } catch (err) {
      console.error(err);
      setError("Failed to calculate SEO score.");
    }
  }

  async function handleSuggestions() {
    try {
      setError("");

      const result = await generateAiSeoSuggestions({
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        content: form.metaDescription || null,
      });

      setSuggestions(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI suggestions.");
    }
  }

  async function handleAudit() {
    try {
      setError("");

      const result = await auditSeo({
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        canonicalUrl: form.canonicalUrl || null,
        slug: form.slug || null,
        content: form.metaDescription || null,
        robotsIndex: form.robotsIndex,
        robotsFollow: form.robotsFollow,
      });

      setAudit(result);
    } catch (err) {
      console.error(err);
      setError("Failed to run SEO audit.");
    }
  }

  async function handleKeywordDensity() {
    try {
      setError("");

      if (!form.metaDescription || !keyword.trim()) {
        setError("Enter content and target keyword first.");
        return;
      }

      const result = await calculateKeywordDensity({
        content: form.metaDescription,
        targetKeyword: keyword,
      });

      setKeywordResult(result);
    } catch (err) {
      console.error(err);
      setError("Failed to calculate keyword density.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <Search size={16} />
              Website Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              SEO Metadata
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Manage metadata, optimize SEO performance and analyze website
              content.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadMetadata}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-blue-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <Plus size={17} />
              Add Metadata
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Tools */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ToolCard
            icon={<BarChart3 size={21} />}
            title="SEO Score"
            description="Calculate your current SEO score."
            onClick={handleScore}
          />

          <ToolCard
            icon={<Sparkles size={21} />}
            title="AI Suggestions"
            description="Generate improved SEO title and description."
            onClick={handleSuggestions}
          />

          <ToolCard
            icon={<FileSearch size={21} />}
            title="SEO Audit"
            description="Analyze SEO issues and recommendations."
            onClick={handleAudit}
          />

          <ToolCard
            icon={<Search size={21} />}
            title="Keyword Density"
            description="Analyze target keyword usage."
            onClick={handleKeywordDensity}
          />
        </div>

        {/* Keyword */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-950">
            Keyword Density
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter a target keyword and use your metadata description as the
            content source.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Target keyword"
              className="flex-1 rounded-xl border border-blue-100 bg-blue-50/30 px-4 py-3 text-sm outline-none focus:border-blue-300"
            />

            <button
              onClick={handleKeywordDensity}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Analyze Keyword
            </button>
          </div>

          {keywordResult && (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <ResultBox label="Keyword" value={keywordResult.keyword} />
              <ResultBox label="Count" value={String(keywordResult.count)} />
              <ResultBox
                label="Total Words"
                value={String(keywordResult.totalWords)}
              />
              <ResultBox
                label="Density"
                value={`${keywordResult.density}%`}
              />
            </div>
          )}
        </div>

        {/* Score / AI / Audit */}
        {(score || suggestions || audit) && (
          <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-3">

            {score && (
              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  SEO Score
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {score.seoScore}
                  </span>

                  <span className="mb-1 text-gray-500">/ 100</span>
                </div>

                <div className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  Grade {score.grade}
                </div>

                {score.suggestions?.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-gray-800">
                      Suggestions
                    </p>

                    <ul className="space-y-2">
                      {score.suggestions.map((item, index) => (
                        <li
                          key={index}
                          className="rounded-lg bg-blue-50/60 px-3 py-2 text-xs text-gray-600"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {suggestions && (
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-600" />

                  <h3 className="font-bold text-gray-950">
                    AI Suggestions
                  </h3>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Improved Title
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {suggestions.improvedTitle}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Improved Description
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-700">
                      {suggestions.improvedDescription}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Keywords
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestions.keywords.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {audit && (
              <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <FileSearch size={18} className="text-amber-600" />

                  <h3 className="font-bold text-gray-950">
                    SEO Audit
                  </h3>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <ResultBox
                    label="Score"
                    value={String(audit.seoScore)}
                  />

                  <ResultBox label="Grade" value={audit.grade} />

                  <ResultBox
                    label="Title Length"
                    value={String(audit.titleLength)}
                  />

                  <ResultBox
                    label="Description"
                    value={String(audit.descriptionLength)}
                  />

                  <ResultBox
                    label="Words"
                    value={String(audit.wordCount)}
                  />

                  <ResultBox
                    label="Density"
                    value={`${audit.keywordDensity}%`}
                  />
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-gray-800">
                    Issues
                  </p>

                  {audit.issues.length === 0 ? (
                    <p className="text-sm text-green-600">
                      No major issues found.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {audit.issues.map((item, index) => (
                        <li
                          key={index}
                          className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-gray-600"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metadata table */}
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                SEO Metadata
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage metadata records for your website entities.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {metadata.length} Records
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              Loading SEO metadata...
            </div>
          ) : metadata.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Search size={20} className="text-blue-600" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No SEO metadata found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create your first SEO metadata record.
              </p>

              <button
                onClick={openCreate}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Metadata
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-blue-100 bg-blue-50/50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Entity
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Meta Title
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Score
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Robots
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {metadata.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">
                          {item.entityType}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.entityId}
                        </p>
                      </td>

                      <td className="max-w-[260px] px-6 py-5 text-sm text-gray-700">
                        {item.metaTitle || "—"}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        /{item.slug}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {item.seoScore ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.robotsIndex
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            Index
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.robotsFollow
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            Follow
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="rounded-lg border border-blue-100 p-2 text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-blue-100 bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  {editingId ? "Edit SEO Metadata" : "Create SEO Metadata"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure search engine metadata for this entity.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">

              {!editingId && (
                <>
                  <Input
                    label="Tenant ID"
                    value={form.tenantId}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        tenantId: value,
                      }))
                    }
                    placeholder="Tenant UUID"
                  />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                      label="Entity Type"
                      value={form.entityType}
                      onChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          entityType: value,
                        }))
                      }
                      placeholder="website"
                    />

                    <Input
                      label="Entity ID"
                      value={form.entityId}
                      onChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          entityId: value,
                        }))
                      }
                      placeholder="Entity UUID"
                    />
                  </div>
                </>
              )}

              <Input
                label="Meta Title"
                value={form.metaTitle}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    metaTitle: value,
                  }))
                }
                placeholder="Your website title"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Meta Description
                </label>

                <textarea
                  value={form.metaDescription}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Describe your website..."
                  className="w-full resize-none rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none focus:border-blue-300"
                />
              </div>

              <Input
                label="Canonical URL"
                value={form.canonicalUrl}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    canonicalUrl: value,
                  }))
                }
                placeholder="https://example.com/page"
              />

              <Input
                label="Slug"
                value={form.slug}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: value,
                  }))
                }
                placeholder="my-business"
              />

              <div className="flex flex-wrap gap-6 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.robotsIndex}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        robotsIndex: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-blue-600"
                  />
                  Allow indexing
                </label>

                <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.robotsFollow}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        robotsFollow: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-blue-600"
                  />
                  Allow following
                </label>
              </div>

              {/* Quick SEO actions */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  SEO Tools
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleScore}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
                  >
                    Calculate Score
                  </button>

                  <button
                    onClick={handleSuggestions}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-purple-700 shadow-sm ring-1 ring-purple-100 hover:bg-purple-50"
                  >
                    AI Suggestions
                  </button>

                  <button
                    onClick={handleAudit}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-amber-700 shadow-sm ring-1 ring-amber-100 hover:bg-amber-50"
                  >
                    Run Audit
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-blue-100 px-6 py-4">
              <button
                onClick={closeForm}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={16} />
                {editingId ? "Update Metadata" : "Create Metadata"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   TOOL CARD
============================================================ */

function ToolCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-gray-950">{title}</h3>

      <p className="mt-1 text-sm leading-5 text-gray-500">
        {description}
      </p>

      <div className="mt-4 text-xs font-semibold text-blue-600">
        Run tool →
      </div>
    </button>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
      />
    </div>
  );
}

/* ============================================================
   RESULT BOX
============================================================ */

function ResultBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}