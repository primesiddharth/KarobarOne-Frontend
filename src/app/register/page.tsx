"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api-client";

export default function RegisterPage() {
  const { register, verifyRegister } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp">("form");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsappMobile, setWhatsappMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpId, setOtpId] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        mobile: `+91${mobile.trim()}`,
        whatsappMobile: whatsappMobile.trim() ? `+91${whatsappMobile.trim()}` : undefined,
        password,
      });
      setOtpId(result.otpId);
      setStep("otp");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await verifyRegister(otpId, otpCode.trim());
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Invalid or expired code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b4ef9] to-[#4a3ee0] flex items-center justify-center p-6 relative overflow-y-auto">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      <div className="w-full max-w-md py-4">
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="bg-[#5b4ef9] p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">KarobarOne</span>
          </div>

          {step === "form" ? (
            <>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600 text-sm">Sign up to get started</p>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                  />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                      +91
                    </span>
                    <input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Mobile Number"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      className="w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                      +91
                    </span>
                    <input
                      value={whatsappMobile}
                      onChange={(e) => setWhatsappMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="WhatsApp (optional)"
                      inputMode="numeric"
                      maxLength={10}
                      className="w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                    />
                  </div>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 8 characters)"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                />

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#5b4ef9] text-white py-3 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-[#5b4ef9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-[#5b4ef9]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                <p className="text-gray-600 text-sm">
                  We sent a 6-digit code to <span className="font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                />

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length !== 6}
                  className="w-full bg-[#5b4ef9] text-white py-3 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Verifying..." : "Verify & Continue"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back to edit details
                </button>
              </form>
            </>
          )}

          <div className="mt-5 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#5b4ef9] hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}