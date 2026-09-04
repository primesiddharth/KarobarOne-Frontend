"use client";

import { useState } from "react";
import {
  BookOpenText,
  Sparkles,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { generateBlog } from "@/lib/api/websites";

import type { BlogGenerationRequest } from "@/types/websites";

export default function BlogWriterPage() {
  const [form, setForm] = useState<BlogGenerationRequest>({
    topic: "",
    as_of: "",
    tenantId: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof BlogGenerationRequest,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleGenerate() {
    setError("");
    setSuccess("");
    setResult("");

    if (!form.topic.trim()) {
      setError("Blog topic is required.");
      return;
    }

    try {
      setLoading(true);

      const data: BlogGenerationRequest = {
        topic: form.topic.trim(),
        as_of: form.as_of?.trim() || null,
        tenantId: form.tenantId?.trim() || null,
      };

      const response = await generateBlog(data);

      // API returns string directly
      setResult(response);
      setSuccess("Blog generated successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to generate blog. Please try again.");
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
      setError("Unable to copy blog content.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Sparkles size={17} />
            AI Content
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Blog Writer AI Agent
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Generate high-quality blog posts with AI using a topic
            and optional publishing context.
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

        {/* SUCCESS */}
        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* FORM */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-blue-100 bg-white shadow-sm">

              {/* CARD HEADER */}
              <div className="border-b border-blue-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BookOpenText size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-950">
                      Blog Configuration
                    </h2>

                    <p className="text-xs text-gray-500">
                      Configure your AI-generated blog
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-6 py-6">

                {/* TOPIC */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Blog Topic
                  </label>

                  <textarea
                    rows={5}
                    value={form.topic}
                    onChange={(e) =>
                      updateField("topic", e.target.value)
                    }
                    placeholder="Enter the topic for your blog..."
                    className="w-full resize-none rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-300 focus:bg-white"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Be specific for better AI-generated content.
                  </p>
                </div>

                {/* AS OF */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    As Of
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    value={form.as_of || ""}
                    onChange={(e) =>
                      updateField("as_of", e.target.value)
                    }
                    placeholder="e.g. August 2026"
                    className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Useful when the blog should reflect a specific
                    date or information context.
                  </p>
                </div>

                {/* TENANT ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Tenant ID
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    value={form.tenantId || ""}
                    onChange={(e) =>
                      updateField("tenantId", e.target.value)
                    }
                    placeholder="Enter tenant UUID"
                    className="w-full rounded-xl border border-blue-100 bg-blue-50/20 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="button"
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
                      Generating Blog...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate Blog
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RESULT */}
          <section className="lg:col-span-3">
            <div className="min-h-[600px] rounded-2xl border border-blue-100 bg-white shadow-sm">

              {/* RESULT HEADER */}
              <div className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
                <div>
                  <h2 className="font-bold text-gray-950">
                    Generated Blog
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Your AI-generated blog will appear here
                  </p>
                </div>

                {result && (
                  <button
                    type="button"
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

              {/* RESULT BODY */}
              <div className="p-6">
                {loading ? (
                  <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Sparkles
                        size={25}
                        className="animate-pulse"
                      />
                    </div>

                    <h3 className="mt-5 font-semibold text-gray-900">
                      AI is writing your blog
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                      Please wait while the AI creates your blog
                      post.
                    </p>
                  </div>
                ) : result ? (
                  <article className="rounded-xl border border-blue-100 bg-blue-50/20 p-6">
                    <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                      {result}
                    </div>
                  </article>
                ) : (
                  <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                      <BookOpenText size={24} />
                    </div>

                    <h3 className="mt-5 font-semibold text-gray-900">
                      No blog generated yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                      Enter a blog topic and click Generate Blog
                      to create your AI-powered article.
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
                Blog Writer AI
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800/70">
                Provide a clear topic and optional date or tenant
                context to generate a more relevant blog post.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}