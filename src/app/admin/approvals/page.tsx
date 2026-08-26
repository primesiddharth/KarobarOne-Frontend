"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Undo2, ClipboardList, UserPlus, Plus } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getUserIdFromToken } from "@/lib/jwt";
import { approvalRequestApi, reviewQueueApi } from "@/lib/api/customer-extras";
import { ApiError } from "@/lib/api-client";
import { ApprovalRequest, ReviewQueueItem } from "@/types/customer-extras";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function AdminApprovalsContent() {
  const { token } = useAuth();
  const userId = getUserIdFromToken(token);
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [queueItems, setQueueItems] = useState<ReviewQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showDraftForm, setShowDraftForm] = useState(false);
  const [draftEntityType, setDraftEntityType] = useState("PRODUCT");
  const [draftEntityId, setDraftEntityId] = useState("");
  const [draftData, setDraftData] = useState("{}");
  const [isDrafting, setIsDrafting] = useState(false);
  const [assigneeInputs, setAssigneeInputs] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!token || !tenantId) return;
    setIsLoading(true);
    try {
      const [reqs, queue] = await Promise.all([
        approvalRequestApi.list(tenantId, token),
        reviewQueueApi.list(tenantId, token),
      ]);
      setRequests(reqs);
      setQueueItems(queue);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(requestId: string) {
    if (!token) return;
    setBusyId(requestId);
    try {
      const updated = await approvalRequestApi.approve(requestId, token);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(requestId: string) {
    if (!token) return;
    const reason = prompt("Reason for rejection:");
    if (reason === null) return;
    setBusyId(requestId);
    try {
      const updated = await approvalRequestApi.reject(requestId, reason, token);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleWithdraw(requestId: string) {
    if (!token) return;
    setBusyId(requestId);
    try {
      const updated = await approvalRequestApi.withdraw(requestId, token);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleCreateDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !tenantId || !draftEntityId.trim()) return;
    let parsedData: Record<string, unknown>;
    try {
      parsedData = JSON.parse(draftData || "{}");
    } catch {
      alert("Version data must be valid JSON.");
      return;
    }
    setIsDrafting(true);
    try {
      const created = await approvalRequestApi.draft(
        {
          tenantId,
          entityType: draftEntityType,
          entityId: draftEntityId.trim(),
          versionData: parsedData,
          createdBy: userId,
        },
        token
      );
      setRequests((prev) => [created, ...prev]);
      setDraftEntityId("");
      setDraftData("{}");
      setShowDraftForm(false);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setIsDrafting(false);
    }
  }

  async function handleSubmitForReview(requestId: string) {
    if (!token) return;
    setBusyId(requestId);
    try {
      const updated = await approvalRequestApi.submit(requestId, token);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleAssign(queueId: string) {
    if (!token) return;
    const assignedTo = assigneeInputs[queueId];
    if (!assignedTo?.trim()) return;
    setBusyId(queueId);
    try {
      const updated = await reviewQueueApi.assign(queueId, assignedTo.trim(), token);
      setQueueItems((prev) => prev.map((q) => (q.id === queueId ? updated : q)));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href={`/customers?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
          <button
            onClick={() => setShowDraftForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Draft
          </button>
        </div>
        <p className="text-gray-500 mb-6">
          Review pending changes across products, brands, and other entities before they go live.
        </p>

        {showDraftForm && (
          <form
            onSubmit={handleCreateDraft}
            className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 mb-6"
          >
            <div className="grid grid-cols-2 gap-3">
              <select
                value={draftEntityType}
                onChange={(e) => setDraftEntityType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
              >
                <option value="PRODUCT">Product</option>
                <option value="BRAND">Brand</option>
                <option value="CATEGORY">Category</option>
              </select>
              <input
                value={draftEntityId}
                onChange={(e) => setDraftEntityId(e.target.value)}
                placeholder="Entity ID"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
              />
            </div>
            <textarea
              value={draftData}
              onChange={(e) => setDraftData(e.target.value)}
              rows={3}
              placeholder='{"field": "new value"}'
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
            />
            <button
              type="submit"
              disabled={isDrafting || !draftEntityId.trim()}
              className="bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
            >
              {isDrafting ? "Creating..." : "Create Draft"}
            </button>
          </form>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading approvals...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No approval requests yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-gray-900">{req.entityType}</p>
                  <p className="text-xs text-gray-400">{req.entityId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[req.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={busyId === req.id}
                        title="Approve"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={busyId === req.id}
                        title="Reject"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {req.status === "DRAFT" && (
                    <button
                      onClick={() => handleSubmitForReview(req.id)}
                      disabled={busyId === req.id}
                      className="text-xs font-medium text-[#5b4ef9] hover:bg-[#5b4ef9]/10 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Submit for review
                    </button>
                  )}
                  {(req.status === "DRAFT" || req.status === "PENDING") && (
                    <button
                      onClick={() => handleWithdraw(req.id)}
                      disabled={busyId === req.id}
                      title="Withdraw"
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {queueItems.length > 0 && (
          <>
            <h2 className="font-semibold text-gray-900 mt-8 mb-3">Review Queue</h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {queueItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                  <p className="text-sm text-gray-900">{item.entityType}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        STATUS_STYLES[item.approvalStatus] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.approvalStatus}
                    </span>
                    {item.assignedTo ? (
                      <span className="text-xs text-gray-400">→ {item.assignedTo}</span>
                    ) : (
                      <>
                        <input
                          value={assigneeInputs[item.id] || ""}
                          onChange={(e) =>
                            setAssigneeInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          placeholder="Assign to (user ID)"
                          className="w-32 px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
                        />
                        <button
                          onClick={() => handleAssign(item.id)}
                          disabled={busyId === item.id || !assigneeInputs[item.id]?.trim()}
                          className="p-1.5 text-[#5b4ef9] hover:bg-[#5b4ef9]/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default function AdminApprovalsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <AdminApprovalsContent />
    </Suspense>
  );
}
