"use client";

import { useEffect, useState } from "react";
import {
  getPendingWebsites,
  getAdminWebsite,
  approveWebsite,
  rejectWebsite,
  publishWebsite,
} from "@/lib/api/websites";

import type {
  WebsiteResponse,
  WebsiteStatusRequest,
} from "@/types/websites";

type ActionType = "approve" | "reject" | "publish" | null;

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<WebsiteResponse[]>([]);
  const [selectedWebsite, setSelectedWebsite] =
    useState<WebsiteResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [action, setAction] = useState<ActionType>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadPendingWebsites();
  }, []);

  async function loadPendingWebsites() {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingWebsites();
      setWebsites(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending websites.");
    } finally {
      setLoading(false);
    }
  }

  async function handleView(websiteId: string) {
    try {
      setError("");

      const website = await getAdminWebsite(websiteId);
      setSelectedWebsite(website);
    } catch (err) {
      console.error(err);
      setError("Failed to load website details.");
    }
  }

  function openAction(type: ActionType, website: WebsiteResponse) {
    setSelectedWebsite(website);
    setAction(type);
    setReason("");
    setSuccess("");
    setError("");
  }

  function closeAction() {
    setAction(null);
    setReason("");
  }

  async function handleAction() {
    if (!selectedWebsite || !action) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const payload: WebsiteStatusRequest = {
        websiteId: selectedWebsite.id,
        reason: reason.trim() || null,
      };

      if (action === "approve") {
        await approveWebsite(payload);
        setSuccess("Website approved successfully.");
      }

      if (action === "reject") {
        await rejectWebsite(payload);
        setSuccess("Website rejected successfully.");
      }

      if (action === "publish") {
        await publishWebsite(payload);
        setSuccess("Website published successfully.");
      }

      closeAction();
      setSelectedWebsite(null);

      await loadPendingWebsites();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} website.`);
    } finally {
      setActionLoading(false);
    }
  }

  const statusClass = (status: string) => {
    const value = status?.toLowerCase();

    if (value === "approved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (value === "published") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (value === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Website Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Admin Websites
            </h1>

            <p className="mt-2 text-base text-gray-500">
              Review website submissions and manage approval, rejection and
              publishing.
            </p>
          </div>

          <button
            onClick={loadPendingWebsites}
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Websites</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">
              {websites.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Approval Queue</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">
              {websites.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Actions</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">3</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Queue */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-950">
              Website Approval Queue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review submitted websites before approving or publishing them.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              Loading websites...
            </div>
          ) : websites.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                ✓
              </div>

              <h3 className="text-base font-semibold text-gray-900">
                No pending websites
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are currently no websites waiting for review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Company
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Business
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Domain
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Plan
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {websites.map((website) => (
                    <tr
                      key={website.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {website.companyName}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {website.slug}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {website.businessType}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {website.domain || "—"}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {website.plan}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusClass(
                            website.status
                          )}`}
                        >
                          {website.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(website.id)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </button>

                          <button
                            onClick={() => openAction("approve", website)}
                            className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => openAction("reject", website)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => openAction("publish", website)}
                            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                          >
                            Publish
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

      {/* Website Details Modal */}
      {selectedWebsite && !action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Website Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review website information.
                </p>
              </div>

              <button
                onClick={() => setSelectedWebsite(null)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">
              <Detail
                label="Company"
                value={selectedWebsite.companyName}
              />

              <Detail
                label="Business Type"
                value={selectedWebsite.businessType}
              />

              <Detail
                label="Slug"
                value={selectedWebsite.slug}
              />

              <Detail
                label="Domain"
                value={selectedWebsite.domain || "—"}
              />

              <Detail
                label="Theme"
                value={selectedWebsite.theme || "—"}
              />

              <Detail
                label="Plan"
                value={selectedWebsite.plan}
              />

              <Detail
                label="Status"
                value={selectedWebsite.status}
              />

              <Detail
                label="Created"
                value={new Date(
                  selectedWebsite.createdAt
                ).toLocaleDateString()}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => openAction("reject", selectedWebsite)}
                className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Reject
              </button>

              <button
                onClick={() => openAction("approve", selectedWebsite)}
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Approve
              </button>

              <button
                onClick={() => openAction("publish", selectedWebsite)}
                className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {selectedWebsite && action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-xl font-bold text-gray-950">
                {action === "approve" && "Approve Website"}
                {action === "reject" && "Reject Website"}
                {action === "publish" && "Publish Website"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedWebsite.companyName}
              </p>
            </div>

            <div className="px-6 py-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reason
                {action === "reject" && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  action === "reject"
                    ? "Enter rejection reason..."
                    : "Optional note..."
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeAction}
                disabled={actionLoading}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAction}
                disabled={
                  actionLoading ||
                  (action === "reject" && !reason.trim())
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${
                  action === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-black hover:bg-gray-800"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {actionLoading
                  ? "Processing..."
                  : action === "approve"
                  ? "Approve"
                  : action === "reject"
                  ? "Reject"
                  : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}