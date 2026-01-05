"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setGuest } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.login(formData);
      setAuth(response.user, response.token);
      router.push("/session");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    setGuest();
    router.push("/consent");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 sm:gap-3 mb-4 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:scale-105 transition-transform shadow-lg">
              NS
            </div>
            <span className="text-xl sm:text-2xl font-bold text-calm-900">
              NeuralSense
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-calm-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-calm-600">
            Sign in to your account or continue as guest
          </p>
        </div>

        {/* Guest Mode Button */}
        <button
          onClick={handleGuestMode}
          className="w-full mb-4 sm:mb-6 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Continue as Guest
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-calm-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-calm-500">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-calm-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-calm-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border border-calm-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-calm-700 text-white font-semibold rounded-lg hover:bg-calm-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-calm-600 mt-6">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Create one
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-calm-500 hover:text-calm-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
