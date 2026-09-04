"use client";

import { useState } from "react";
import {
  Globe,
  Plus,
  Search,
  Pencil,
  Send,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import {
  createWebsite,
  getWebsite,
  updateWebsite,
  submitWebsite,
  previewWebsite,
} from "@/lib/api/websites";

import type {
  WebsiteCreate,
  WebsiteUpdate,
  WebsiteResponse,
  WebsitePreviewResponse,
} from "@/types/websites";

type Mode = "create" | "get" | "update" | "submit" | "preview";

export default function WebsitesPage() {
  const [mode, setMode] = useState<Mode>("create");

  const [websiteId, setWebsiteId] = useState("");
  const [slug, setSlug] = useState("");

  const [form, setForm] = useState<WebsiteCreate>({
    tenantId: "",
    companyName: "",
    businessType: "",
    theme: "",
    plan: "",
    domain: "",
  });

  const [website, setWebsite] = useState<WebsiteResponse | null>(
    null
  );

  const [preview, setPreview] =
    useState<WebsitePreviewResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function updateField(
    field: keyof WebsiteCreate,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleCreate() {
    clearMessages();

    if (!form.tenantId.trim()) {
      setError("Tenant ID is required.");
      return;
    }

    if (!form.companyName.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!form.businessType.trim()) {
      setError("Business type is required.");
      return;
    }

    try {
      setLoading(true);

      const data: WebsiteCreate = {
        tenantId: form.tenantId.trim(),
        companyName: form.companyName.trim(),
        businessType: form.businessType.trim(),
        theme: form.theme?.trim() || null,
        plan: form.plan?.trim() || undefined,
        domain: form.domain?.trim() || null,
      };

      const response = await createWebsite(data);

      setWebsite(response);
      setWebsiteId(response.id);

      setSuccess("Website created successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to create website.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGet() {
    clearMessages();

    if (!websiteId.trim()) {
      setError("Website ID is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await getWebsite(websiteId.trim());

      setWebsite(response);
      setSuccess("Website fetched successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch website.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    clearMessages();

    if (!websiteId.trim()) {
      setError("Website ID is required.");
      return;
    }

    try {
      setLoading(true);

      const data: WebsiteUpdate = {
        companyName: form.companyName.trim() || null,
        businessType: form.businessType.trim() || null,
        theme: form.theme?.trim() || null,
        plan: form.plan?.trim() || null,
        domain: form.domain?.trim() || null,
      };

      const response = await updateWebsite(
        websiteId.trim(),
        data
      );

      setWebsite(response);
      setSuccess("Website updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to update website.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    clearMessages();

    if (!websiteId.trim()) {
      setError("Website ID is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await submitWebsite({
        websiteId: websiteId.trim(),
      });

      setWebsite(response);
      setSuccess("Website submitted successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to submit website.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePreview() {
    clearMessages();

    if (!slug.trim()) {
      setError("Website slug is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await previewWebsite(slug.trim());

      setPreview(response);
      setSuccess("Website preview loaded.");
    } catch (err) {
      console.error(err);
      setError("Unable to load website preview.");
    } finally {
      setLoading(false);
    }
  }

  function selectMode(nextMode: Mode) {
    clearMessages();
    setMode(nextMode);
    setWebsite(null);
    setPreview(null);
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Globe size={17} />
            Website Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Websites
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Create, manage, submit and preview websites.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {/* TABS */}
        <div className="mb-6 overflow-x-auto rounded-2xl border border-blue-100 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-1">
            <TabButton
              active={mode === "create"}
              onClick={() => selectMode("create")}
              icon={<Plus size={16} />}
              label="Create"
            />

            <TabButton
              active={mode === "get"}
              onClick={() => selectMode("get")}
              icon={<Search size={16} />}
              label="Get Website"
            />

            <TabButton
              active={mode === "update"}
              onClick={() => selectMode("update")}
              icon={<Pencil size={16} />}
              label="Update"
            />

            <TabButton
              active={mode === "submit"}
              onClick={() => selectMode("submit")}
              icon={<Send size={16} />}
              label="Submit"
            />

            <TabButton
              active={mode === "preview"}
              onClick={() => selectMode("preview")}
              icon={<Eye size={16} />}
              label="Preview"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* FORM */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-blue-100 bg-white shadow-sm">

              <div className="border-b border-blue-100 px-6 py-5">
                <h2 className="font-bold text-gray-950">
                  {mode === "create" && "Create Website"}
                  {mode === "get" && "Get Website"}
                  {mode === "update" && "Update Website"}
                  {mode === "submit" && "Submit Website"}
                  {mode === "preview" && "Website Preview"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {mode === "create" &&
                    "Create a new website for a tenant."}

                  {mode === "get" &&
                    "Fetch an existing website by ID."}

                  {mode === "update" &&
                    "Update website information."}

                  {mode === "submit" &&
                    "Submit a website for processing."}

                  {mode === "preview" &&
                    "Preview a website using its slug."}
                </p>
              </div>

              <div className="space-y-5 px-6 py-6">

                {/* WEBSITE ID */}
                {(mode === "get" ||
                  mode === "update" ||
                  mode === "submit") && (
                  <InputField
                    label="Website ID"
                    value={websiteId}
                    onChange={setWebsiteId}
                    placeholder="Enter website UUID"
                  />
                )}

                {/* SLUG */}
                {mode === "preview" && (
                  <InputField
                    label="Website Slug"
                    value={slug}
                    onChange={setSlug}
                    placeholder="e.g. my-business"
                  />
                )}

                {/* CREATE / UPDATE FIELDS */}
                {(mode === "create" || mode === "update") && (
                  <>
                    {mode === "create" && (
                      <InputField
                        label="Tenant ID"
                        value={form.tenantId}
                        onChange={(value) =>
                          updateField("tenantId", value)
                        }
                        placeholder="Enter tenant UUID"
                      />
                    )}

                    <InputField
                      label="Company Name"
                      value={form.companyName}
                      onChange={(value) =>
                        updateField("companyName", value)
                      }
                      placeholder="Enter company name"
                    />

                    <InputField
                      label="Business Type"
                      value={form.businessType}
                      onChange={(value) =>
                        updateField("businessType", value)
                      }
                      placeholder="e.g. Travel, Restaurant"
                    />

                    <InputField
                      label="Theme"
                      value={form.theme || ""}
                      onChange={(value) =>
                        updateField("theme", value)
                      }
                      placeholder="Enter theme"
                    />

                    <InputField
                      label="Plan"
                      value={form.plan || ""}
                      onChange={(value) =>
                        updateField("plan", value)
                      }
                      placeholder="e.g. basic, premium"
                    />

                    <InputField
                      label="Domain"
                      value={form.domain || ""}
                      onChange={(value) =>
                        updateField("domain", value)
                      }
                      placeholder="example.com"
                    />
                  </>
                )}

                {/* ACTION */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={
                    mode === "create"
                      ? handleCreate
                      : mode === "get"
                        ? handleGet
                        : mode === "update"
                          ? handleUpdate
                          : mode === "submit"
                            ? handleSubmit
                            : handlePreview
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      {mode === "create" && <Plus size={18} />}
                      {mode === "get" && <Search size={18} />}
                      {mode === "update" && <Pencil size={18} />}
                      {mode === "submit" && <Send size={18} />}
                      {mode === "preview" && <Eye size={18} />}

                      {mode === "create" && "Create Website"}
                      {mode === "get" && "Get Website"}
                      {mode === "update" && "Update Website"}
                      {mode === "submit" && "Submit Website"}
                      {mode === "preview" && "Load Preview"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RESULT */}
          <section className="lg:col-span-3">
            <div className="min-h-[570px] rounded-2xl border border-blue-100 bg-white shadow-sm">

              <div className="border-b border-blue-100 px-6 py-5">
                <h2 className="font-bold text-gray-950">
                  {preview
                    ? "Website Preview"
                    : "Website Details"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  API response and website information
                </p>
              </div>

              <div className="p-6">

                {preview ? (
                  <div className="space-y-5">

                    {/* PREVIEW WEBSITE */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                      <h3 className="mb-3 text-sm font-bold text-gray-900">
                        Website
                      </h3>

                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-gray-600">
                        {JSON.stringify(
                          preview.website,
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    {/* SECTIONS */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                      <h3 className="mb-3 text-sm font-bold text-gray-900">
                        Sections
                      </h3>

                      {preview.sections?.length ? (
                        <div className="space-y-3">
                          {preview.sections.map(
                            (section) => (
                              <div
                                key={section.id}
                                className="rounded-lg border border-blue-100 bg-white p-4"
                              >
                                <p className="text-sm font-semibold text-gray-900">
                                  {section.sectionName}
                                </p>

                                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-gray-500">
                                  {JSON.stringify(
                                    section.content,
                                    null,
                                    2
                                  )}
                                </pre>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No sections available.
                        </p>
                      )}
                    </div>

                    {/* THEME */}
                    {preview.theme && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                        <h3 className="text-sm font-bold text-gray-900">
                          Theme
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                          {preview.theme.themeName}
                        </p>
                      </div>
                    )}
                  </div>
                ) : website ? (
                  <div className="space-y-5">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      <InfoCard
                        label="Company"
                        value={website.companyName}
                      />

                      <InfoCard
                        label="Slug"
                        value={website.slug}
                      />

                      <InfoCard
                        label="Business Type"
                        value={website.businessType}
                      />

                      <InfoCard
                        label="Status"
                        value={website.status}
                      />

                      <InfoCard
                        label="Plan"
                        value={website.plan}
                      />

                      <InfoCard
                        label="Theme"
                        value={website.theme || "Not specified"}
                      />

                      <InfoCard
                        label="Domain"
                        value={website.domain || "Not connected"}
                      />

                      <InfoCard
                        label="Website ID"
                        value={website.id}
                      />
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                      <p className="text-xs font-medium text-gray-500">
                        Tenant ID
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-gray-800">
                        {website.tenantId}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                      <Globe size={25} />
                    </div>

                    <h3 className="mt-5 font-semibold text-gray-900">
                      No website data
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                      Select an operation and use the form to
                      interact with the Websites API.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}