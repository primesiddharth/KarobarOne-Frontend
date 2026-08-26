"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MapPin,
  Star,
  StickyNote,
  Activity,
  ShieldCheck,
  Pencil,
  Check,
  X,
  Monitor,
  LogOut,
  User,
  Upload,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getUserIdFromToken } from "@/lib/jwt";
import { customerApi, customerAddressApi } from "@/lib/api/customer";
import {
  noteApi,
  activityLogApi,
  consentApi,
  customerSessionApi,
} from "@/lib/api/customer-extras";
import { customerEngineApi } from "@/lib/api/customer-engine";
import { ApiError } from "@/lib/api-client";
import { Customer, CustomerAddress } from "@/types/customer";
import {
  CustomerNote,
  CustomerActivityLog,
  CustomerConsentLog,
  CustomerSession,
} from "@/types/customer-extras";
import { CustomerEngineProfile } from "@/types/customer-engine";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "consents", label: "Consents", icon: ShieldCheck },
  { id: "sessions", label: "Sessions", icon: Monitor },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CustomerDetailPage() {
  const { token } = useAuth();
  const userId = getUserIdFromToken(token);
  const params = useParams();
  const searchParams = useSearchParams();
  const customerId = params.customerId as string;
  const tenantId = searchParams.get("tenantId") || "";
  const storeId = searchParams.get("storeId") || "";

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tab, setTab] = useState<TabId>("addresses");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !customerId) return;
    customerApi
      .getById(customerId, token)
      .then(setCustomer)
      .finally(() => setIsLoading(false));
  }, [token, customerId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/customers?tenantId=${tenantId}&storeId=${storeId}`}
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {isLoading ? "Loading..." : `${customer?.firstName || ""} ${customer?.lastName || ""}`}
        </h1>
        <p className="text-gray-500 mb-6">{customer?.email}</p>

        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-[#5b4ef9] text-[#5b4ef9]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "profile" && <ProfileTab customerId={customerId} token={token} />}
        {tab === "addresses" && <AddressesTab customerId={customerId} token={token} />}
        {tab === "notes" && (
          <NotesTab customerId={customerId} token={token} userId={userId} />
        )}
        {tab === "activity" && (
          <ActivityTab customerId={customerId} token={token} />
        )}
        {tab === "consents" && (
          <ConsentsTab customerId={customerId} token={token} />
        )}
        {tab === "sessions" && (
          <SessionsTab customerId={customerId} token={token} />
        )}
      </div>
    </div>
  );
}

// ---------------- Addresses Tab ----------------
function AddressesTab({ customerId, token }: { customerId: string; token: string | null }) {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    customerAddressApi
      .list(customerId, token)
      .then(setAddresses)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, customerId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !line1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) return;
    setIsAdding(true);
    try {
      const created = await customerAddressApi.create(
        customerId,
        { line1, city, state, postalCode },
        token
      );
      setAddresses((prev) => [...prev, created]);
      setLine1("");
      setCity("");
      setState("");
      setPostalCode("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDelete(addressId: string) {
    if (!token) return;
    setDeletingId(addressId);
    try {
      await customerAddressApi.remove(addressId, token);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          placeholder="Address line 1"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        />
        <div className="grid grid-cols-3 gap-3">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal code" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
        </div>
        <button type="submit" disabled={isAdding} className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </form>

      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5b4ef9]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#5b4ef9]" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{address.line1}</p>
                  <p className="text-xs text-gray-500">{address.city}, {address.state} - {address.postalCode}</p>
                </div>
                {address.isDefault && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#5b4ef9]/10 text-[#5b4ef9] flex items-center gap-1">
                    <Star className="w-3 h-3" /> Default
                  </span>
                )}
              </div>
              <button onClick={() => handleDelete(address.id)} disabled={deletingId === address.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Notes Tab ----------------
function NotesTab({
  customerId,
  token,
  userId,
}: {
  customerId: string;
  token: string | null;
  userId: string;
}) {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    noteApi
      .listByCustomer(customerId, token)
      .then(setNotes)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, customerId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !text.trim() || !userId) return;
    setIsAdding(true);
    try {
      const created = await noteApi.create(
        { customerId, noteText: text.trim(), createdBy: userId },
        token
      );
      setNotes((prev) => [created, ...prev]);
      setText("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDelete(noteId: string) {
    if (!token) return;
    try {
      await noteApi.remove(noteId, token);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  }

  function startEdit(note: CustomerNote) {
    setEditingId(note.id);
    setEditText(note.noteText);
  }

  async function saveEdit(noteId: string) {
    if (!token || !editText.trim()) return;
    setBusyId(noteId);
    try {
      const updated = await noteApi.update(noteId, editText.trim(), token);
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      setEditingId(null);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Add an internal note about this customer..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        />
        <button type="submit" disabled={isAdding || !text.trim()} className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50">
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </form>

      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No notes yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {notes.map((note) =>
            editingId === note.id ? (
              <div key={note.id} className="flex items-center gap-2 px-5 py-3.5">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                  className="flex-1 px-2 py-1.5 border border-[#5b4ef9] rounded-lg text-sm focus:outline-none"
                />
                <button onClick={() => saveEdit(note.id)} disabled={busyId === note.id} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div key={note.id} className="flex items-start justify-between px-5 py-3.5 gap-3">
                <p className="text-sm text-gray-700">{note.noteText}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(note)} className="p-1.5 text-gray-400 hover:text-[#5b4ef9] hover:bg-gray-100 rounded-lg transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ---------------- Activity Tab ----------------
function ActivityTab({ customerId, token }: { customerId: string; token: string | null }) {
  const [logs, setLogs] = useState<CustomerActivityLog[]>([]);
  const [activityType, setActivityType] = useState("LOGIN");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    activityLogApi
      .listByCustomer(customerId, token)
      .then(setLogs)
      .finally(() => setIsLoading(false));
  }, [token, customerId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsAdding(true);
    try {
      const created = await activityLogApi.create({ customerId, activityType }, token);
      setLogs((prev) => [created, ...prev]);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        >
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="PROFILE_UPDATE">Profile Update</option>
          <option value="ORDER_PLACED">Order Placed</option>
        </select>
        <button
          type="submit"
          disabled={isAdding}
          className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Log Activity
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading activity...</p>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {logs.map((log) => (
            <div key={log.id} className="px-5 py-3.5">
              <p className="text-sm font-medium text-gray-900">{log.activityType}</p>
              {log.entityType && (
                <p className="text-xs text-gray-500">
                  {log.entityType} {log.entityId ? `· ${log.entityId}` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Consents Tab ----------------
function ConsentsTab({ customerId, token }: { customerId: string; token: string | null }) {
  const [consents, setConsents] = useState<CustomerConsentLog[]>([]);
  const [consentType, setConsentType] = useState("TERMS");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    consentApi
      .listByCustomer(customerId, token)
      .then(setConsents)
      .finally(() => setIsLoading(false));
  }, [token, customerId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsAdding(true);
    try {
      const created = await consentApi.create({ customerId, consentType, accepted: true }, token);
      setConsents((prev) => [created, ...prev]);
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3">
        <select
          value={consentType}
          onChange={(e) => setConsentType(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        >
          <option value="TERMS">Terms of Service</option>
          <option value="PRIVACY">Privacy Policy</option>
          <option value="MARKETING">Marketing Communications</option>
        </select>
        <button
          type="submit"
          disabled={isAdding}
          className="inline-flex items-center gap-2 bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Record Consent
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading consents...</p>
      ) : consents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No consent records yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {consents.map((consent) => (
            <div key={consent.id} className="flex items-center justify-between px-5 py-3.5">
              <p className="text-sm font-medium text-gray-900">{consent.consentType}</p>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  consent.accepted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {consent.accepted ? "Accepted" : "Declined"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Sessions Tab ----------------
function SessionsTab({ customerId, token }: { customerId: string; token: string | null }) {
  const [sessions, setSessions] = useState<CustomerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endingId, setEndingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    customerSessionApi
      .listByCustomer(customerId, token)
      .then(setSessions)
      .finally(() => setIsLoading(false));
  }, [token, customerId]);

  async function handleEnd(sessionId: string) {
    if (!token) return;
    setEndingId(sessionId);
    try {
      await customerSessionApi.remove(sessionId, token);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    } finally {
      setEndingId(null);
    }
  }

  if (isLoading) return <p className="text-gray-400 text-center py-8">Loading sessions...</p>;
  if (sessions.length === 0)
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <Monitor className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No active sessions.</p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
      {sessions.map((session) => (
        <div key={session.id} className="flex items-center justify-between px-5 py-3.5">
          <div>
            <p className="text-sm text-gray-900">{session.userAgent || "Unknown device"}</p>
            <p className="text-xs text-gray-500">
              {session.ipAddress || "Unknown IP"} · {new Date(session.loginAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleEnd(session.id)}
            disabled={endingId === session.id}
            className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            End
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------- Profile Tab (customer-engine) ----------------
function ProfileTab({ customerId, token }: { customerId: string; token: string | null }) {
  const [profile, setProfile] = useState<CustomerEngineProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [activationPassword, setActivationPassword] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    customerEngineApi
      .getProfile(customerId, token)
      .then((p) => {
        setProfile(p);
        setFirstName(p.firstName);
        setLastName(p.lastName || "");
        setEmail(p.email);
        setMobile(p.mobile);
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [token, customerId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await customerEngineApi.updateProfile(
        customerId,
        { firstName, lastName: lastName || null, email, mobile },
        token
      );
      setProfile(updated);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setIsUploading(true);
    setError(null);
    try {
      const result = await customerEngineApi.uploadProfileImage(customerId, file, token);
      setProfile((prev) => (prev ? { ...prev, profileImage: result.profileImage } : prev));
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || activationPassword.length < 6) return;
    setIsActivating(true);
    setError(null);
    try {
      const updated = await customerEngineApi.activate(
        customerId,
        { password: activationPassword },
        token
      );
      setProfile(updated);
      setActivationPassword("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsActivating(false);
    }
  }

  if (isLoading) return <p className="text-gray-400 text-center py-8">Loading profile...</p>;

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* Profile photo */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#5b4ef9]/10 flex items-center justify-center overflow-hidden shrink-0">
          {profile?.profileImage ? (
            <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-[#5b4ef9]" />
          )}
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-[#5b4ef9] hover:bg-[#5b4ef9]/10 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Change Photo"}
          <input type="file" accept="image/*" onChange={handleUploadPhoto} disabled={isUploading} className="hidden" />
        </label>
      </div>

      {/* Edit profile form */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
          />
        </div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        />
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* Activation status / form */}
      {profile?.status === "ACTIVE" ? (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <Check className="w-4 h-4" />
          Account is active
        </div>
      ) : (
        <form onSubmit={handleActivate} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <KeyRound className="w-4 h-4 text-[#5b4ef9]" />
            Activate this account with a password (enables direct login)
          </div>
          <div className="flex gap-2">
            <input
              value={activationPassword}
              onChange={(e) => setActivationPassword(e.target.value)}
              type="password"
              placeholder="Set a password (min 6 characters)"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
            />
            <button
              type="submit"
              disabled={isActivating || activationPassword.length < 6}
              className="bg-[#5b4ef9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
            >
              {isActivating ? "Activating..." : "Activate"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}