"use client";

import { useState } from "react";
import {
  Sparkles,
  WandSparkles,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { generateWebsiteAIContent } from "@/lib/api/websites";

import type { WebsiteAIGenerateRequest } from "@/types/websites";

export default function WebsiteAIGenerationPage() {
  const [form, setForm] = useState<WebsiteAIGenerateRequest>({
    storeId: "",
    contentType: "",
    instructions: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleGenerate() {
    setError("");
    setSuccess("");
    setResult("");

    if (!form.storeId.trim()) {
      setError("Store ID is required.");
      return;
    }

    if (!form.contentType.trim()) {
      setError("Content type is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await generateWebsiteAIContent({
        storeId: form.storeId.trim(),
        contentType: form.contentType.trim(),
        instructions: form.instructions?.trim() || null,
      });

      /*
       * Handles different possible response shapes
       * without changing the API contract.
       */
      if (typeof response === "string") {
        setResult(response);
      } else if (
        response &&
        typeof response === "object"
      ) {
        const data = response;

   setResult(response.content ?? "");

      setSuccess("Content generated successfully.");
    } 
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy content.");
    }
  }

  function updateField(
    field: keyof WebsiteAIGenerateRequest,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Sparkles size={17} />
            Website Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Website AI Generation
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Generate website content using AI based on your store
            and content requirements.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* GENERATION FORM */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-blue-100 bg-white shadow-sm">

              <div className="border-b border-blue-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <WandSparkles size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-950">
                      Generate Content
                    </h2>

                    <p className="text-xs text-gray-500">
                      Configure your AI generation
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-6 py-6">

                {/* STORE ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Store ID
                  </label>

                  <input
                    value={form.storeId}
                    onChange={(e) =>
                      updateField("storeId", e.target.value)
                    }
                    placeholder="Enter store UUID"
                    className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                  />
                </div>

                {/* CONTENT TYPE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Content Type
                  </label>

                  <select
                    value={form.contentType}
                    onChange={(e) =>
                      updateField("contentType", e.target.value)
                    }
                    className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white"
                  >
                    <option value="">
                      Select content type
                    </option>

                    <option value="homepage">
                      Homepage
                    </option>

                    <option value="about">
                      About Us
                    </option>

                    <option value="services">
                      Services
                    </option>

                    <option value="products">
                      Products
                    </option>

                    <option value="contact">
                      Contact
                    </option>

                    <option value="hero">
                      Hero Section
                    </option>

                    <option value="cta">
                      Call to Action
                    </option>

                    <option value="custom">
                      Custom
                    </option>
                  </select>
                </div>

                {/* INSTRUCTIONS */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Instructions
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    rows={7}
                    value={form.instructions || ""}
                    onChange={(e) =>
                      updateField(
                        "instructions",
                        e.target.value
                      )
                    }
                    placeholder="Tell AI what kind of content you want. For example: Write professional and engaging homepage copy for a modern travel business..."
                    className="w-full resize-none rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-300 focus:bg-white"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Give AI additional context, tone or requirements.
                  </p>
                </div>

                {/* GENERATE BUTTON */}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RESULT */}
          <section className="lg:col-span-3">
            <div className="min-h-[560px] rounded-2xl border border-blue-100 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
                <div>
                  <h2 className="font-bold text-gray-950">
                    Generated Content
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    AI-generated result will appear here
                  </p>
                </div>

                {result && (
                  <button
                    onClick={handleCopy}
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
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Sparkles
                        size={25}
                        className="animate-pulse"
                      />
                    </div>

                    <h3 className="mt-5 font-semibold text-gray-900">
                      AI is generating your content
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                      This may take a few moments. Please wait...
                    </p>
                  </div>
                ) : result ? (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/20 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                      {result}
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                      <WandSparkles size={24} />
                    </div>

                    <h3 className="mt-5 font-semibold text-gray-900">
                      Nothing generated yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                      Enter your Store ID, choose a content type,
                      and click Generate with AI.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* INFO */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex gap-3">
            <Sparkles
              size={19}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                AI Content Generation
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800/70">
                Use specific instructions to get better results.
                Mention the desired tone, audience, business details,
                keywords, and content requirements when necessary.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}