"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft, Building2, Store as StoreIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { tenantApi } from "@/lib/api/tenant";
import { storeApi } from "@/lib/api/store";
import { ApiError } from "@/lib/api-client";
import { TenantCreatePayload } from "@/types/tenant";

interface FormState {
  businessName: string;
  legalName: string;
  panNumber: string;
  ownerName: string;
  email: string;
  mobile: string;
  businessAddressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  businessType: string;
  storeName: string;
  storeSlug: string;
}

const initialState: FormState = {
  businessName: "",
  legalName: "",
  panNumber: "",
  ownerName: "",
  email: "",
  mobile: "",
  businessAddressLine1: "",
  city: "",
  state: "",
  postalCode: "",
  businessType: "",
  storeName: "",
  storeSlug: "",
};

export default function CreateBusinessPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const tenantPayload: TenantCreatePayload = {
        businessName: form.businessName,
        legalName: form.legalName,
        panNumber: form.panNumber,
        ownerName: form.ownerName,
        email: form.email,
        mobile: form.mobile,
        businessAddressLine1: form.businessAddressLine1,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        businessType: form.businessType,
      };
      const tenant = await tenantApi.create(tenantPayload, token);

      const store = await storeApi.create(
        {
          tenantId: tenant.id,
          storeName: form.storeName,
          storeSlug: form.storeSlug,
          email: form.email,
          mobile: form.mobile,
        },
        token
      );

      router.push(`/dashboard?storeId=${store.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#5b4ef9] to-[#4a3ee0]">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4a3ee0]/40 rounded-full blur-3xl" />

      <div className="w-full max-w-xl relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white mb-6 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-[#5b4ef9] p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-white">KarobarOne</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Business & Store
            </h1>
            <p className="text-white/70">
              Set up your business profile and storefront
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4 text-white/90">
                <Building2 className="w-5 h-5" />
                <h2 className="font-semibold">Business Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Business Name" value={form.businessName} onChange={(v) => update("businessName", v)} />
                <Field label="Legal Name" value={form.legalName} onChange={(v) => update("legalName", v)} />
                <Field label="PAN Number" value={form.panNumber} onChange={(v) => update("panNumber", v)} />
                <Field label="Owner Name" value={form.ownerName} onChange={(v) => update("ownerName", v)} />
                <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} />
                <Field label="Mobile" value={form.mobile} onChange={(v) => update("mobile", v)} />
                <Field
                  label="Address Line 1"
                  value={form.businessAddressLine1}
                  onChange={(v) => update("businessAddressLine1", v)}
                  full
                />
                <Field label="City" value={form.city} onChange={(v) => update("city", v)} />
                <Field label="State" value={form.state} onChange={(v) => update("state", v)} />
                <Field label="Postal Code" value={form.postalCode} onChange={(v) => update("postalCode", v)} />
                <Field label="Business Type" value={form.businessType} onChange={(v) => update("businessType", v)} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 text-white/90">
                <StoreIcon className="w-5 h-5" />
                <h2 className="font-semibold">Store Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Store Name" value={form.storeName} onChange={(v) => update("storeName", v)} />
                <Field
                  label="Store Slug"
                  placeholder="e.g. my-shop"
                  value={form.storeSlug}
                  onChange={(v) => update("storeSlug", v)}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-200 text-sm bg-red-500/20 border border-red-300/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-[#5b4ef9] py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Business & Store"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-white/80 mb-1.5 text-sm">{label}</label>
      <input
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
      />
    </div>
  );
}