"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Zap,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api-client";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsappMobile, setWhatsappMobile] =
    useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreedToTerms, setAgreedToTerms] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!agreedToTerms) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        mobile: mobile.trim(),
        whatsappMobile:
          whatsappMobile.trim() || undefined,
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to create account. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b4ef9] to-[#4a3ee0] flex items-center justify-center p-6">

      <div className="w-full max-w-lg">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white mb-6 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">

            <div className="bg-[#5b4ef9] p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <span className="text-2xl font-semibold text-gray-900">
              KarobarOne
            </span>

          </div>

          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>

            <p className="text-gray-600">
              Create your KarobarOne account
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

              <div>
                <label className="block text-gray-700 mb-2">
                  First Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                />
              </div>

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="block text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                  required
                />

              </div>
            </div>

            {/* Mobile */}
            <div className="mb-5">

              <label className="block text-gray-700 mb-2">
                Mobile Number
              </label>

              <div className="relative">

                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value)
                  }
                  maxLength={15}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                  required
                />

              </div>
            </div>

            {/* WhatsApp */}
            <div className="mb-5">

              <label className="block text-gray-700 mb-2">
                WhatsApp Number
                <span className="text-gray-400 text-sm ml-1">
                  (Optional)
                </span>
              </label>

              <div className="relative">

                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="tel"
                  placeholder="9876543210"
                  value={whatsappMobile}
                  onChange={(e) =>
                    setWhatsappMobile(e.target.value)
                  }
                  maxLength={15}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                />

              </div>
            </div>

            {/* Password */}
            <div className="mb-5">

              <label className="block text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  minLength={8}
                  maxLength={128}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-5">

              <label className="block text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  minLength={8}
                  maxLength={128}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 mb-6">

              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) =>
                  setAgreedToTerms(e.target.checked)
                }
                className="mt-1 w-4 h-4 accent-[#5b4ef9]"
              />

              <p className="text-sm text-gray-600">
                I agree to the Terms of Service and
                Privacy Policy.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5b4ef9] text-white py-3 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-8 text-center">

            <p className="text-gray-600 text-sm">
              Already have an account?{" "}

              <Link
                href="/login"
                className="text-[#5b4ef9] hover:underline font-semibold"
              >
                Login
              </Link>
            </p>

          </div>

        </div>

        <p className="text-white text-center text-sm mt-6">
          Your information is securely processed.
        </p>

      </div>
    </div>
  );
}