"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Zap,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
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
          "Unable to login. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b4ef9] to-[#4a3ee0] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white mb-8 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-[#5b4ef9] p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <span className="text-2xl font-semibold text-gray-900">
              KarobarOne
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>

            <p className="text-gray-600">
              Login to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin}>

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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9] focus:border-transparent"
                  required
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9] focus:border-transparent"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-6">
              <Link
                href="/forgot-password"
                className="text-sm text-[#5b4ef9] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5b4ef9] text-white py-3 rounded-lg hover:bg-[#4a3ee0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}

              <Link
                href="/register"
                className="text-[#5b4ef9] hover:underline font-semibold"
              >
                Sign up free
              </Link>
            </p>
          </div>

        </div>

        <p className="text-white text-center text-sm mt-6">
          By continuing, you agree to our Terms of Service
          and Privacy Policy
        </p>

      </div>
    </div>
  );
}