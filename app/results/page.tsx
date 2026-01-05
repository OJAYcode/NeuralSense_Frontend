"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import {
  getEmotionDisplayName,
  getEmotionEmoji,
  getEmotionColor,
  getEmotionBgColor,
} from "@/lib/emotions";
import StressBadge from "@/components/StressBadge";
import FeedbackCard from "@/components/FeedbackCard";
import Loader from "@/components/Loader";
import type { StressAnalysisResult } from "@/types";

function ResultsContent() {
  const router = useRouter();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const facialScore = parseFloat(searchParams.get("facialScore") || "0");
  const voiceScore = parseFloat(searchParams.get("voiceScore") || "0");

  const [result, setResult] = useState<StressAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setIsLoading(false);
      return;
    }

    if (!facialScore || !voiceScore) {
      setError("Missing stress scores. Please restart the session.");
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const data = await apiClient.getStressAnalysis(
          sessionId,
          facialScore,
          voiceScore
        );
        console.log("Received stress analysis result:", data);
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to load results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [sessionId, facialScore, voiceScore]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center">
        <Loader size="lg" message="Loading your results..." />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-calm-900 mb-4">
            Unable to Load Results
          </h1>
          <p className="text-calm-600 mb-8">{error}</p>
          <Link
            href="/session"
            className="inline-block px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            Start New Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 via-white to-primary-50">
      {/* Header */}
      <nav className="container mx-auto px-6 py-6 border-b border-calm-200">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            <span className="text-2xl font-bold text-calm-900">
              NeuralSense
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link
                href="/history"
                className="px-4 py-2 text-calm-600 font-medium hover:text-calm-800"
              >
                View History
              </Link>
            )}
            <Link
              href="/session"
              className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              New Session
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  clearAuth();
                  router.push("/auth/login");
                }}
                className="px-4 py-2 bg-calm-100 text-calm-700 font-medium rounded-lg hover:bg-calm-200 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Results Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-calm-900 mb-4">
              Your Stress Analysis
            </h1>
            <p className="text-calm-600">
              Based on your facial expression and voice analysis
            </p>
          </div>

          {/* Stress Level Badge */}
          <div className="flex justify-center">
            <StressBadge
              level={result.stressLevel}
              confidence={result.confidence}
              size="lg"
            />
          </div>

          {/* Feedback Card */}
          <FeedbackCard
            stressLevel={result.stressLevel}
            feedback={result.message || result.feedback || ""}
            confidence={result.confidence}
          />

          {/* Analysis Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Face Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-calm-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-calm-900">
                  Facial Expression
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-calm-600">Stress Score</span>
                  <span className="font-semibold text-calm-900">
                    {result.breakdown?.facialScore
                      ? (result.breakdown.facialScore * 100).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-calm-100">
                  <span className="text-sm text-calm-600">Weight</span>
                  <span className="font-semibold text-calm-900">
                    {result.breakdown?.facialWeight
                      ? (result.breakdown.facialWeight * 100).toFixed(0)
                      : 50}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-calm-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-calm-900">
                  Voice Pattern
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-calm-600">Stress Score</span>
                  <span className="font-semibold text-calm-900">
                    {result.breakdown?.voiceScore
                      ? (result.breakdown.voiceScore * 100).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-calm-100">
                  <span className="text-sm text-calm-600">Weight</span>
                  <span className="font-semibold text-calm-900">
                    {result.breakdown?.voiceWeight
                      ? (result.breakdown.voiceWeight * 100).toFixed(0)
                      : 50}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-calm-50 rounded-xl p-6 border border-calm-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-calm-600">Session Date</p>
                <p className="font-semibold text-calm-900">
                  {result.timestamp
                    ? new Date(result.timestamp).toLocaleString()
                    : new Date().toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-calm-600">Session ID</p>
                <p className="font-mono text-xs text-calm-700">
                  {result.sessionId}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/session"
              className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg text-center"
            >
              Take Another Check
            </Link>
            {isAuthenticated && (
              <Link
                href="/history"
                className="px-8 py-3 border-2 border-calm-300 text-calm-700 font-semibold rounded-lg hover:bg-calm-50 transition-colors text-center"
              >
                View All Sessions
              </Link>
            )}
          </div>

          {/* Share/Help Resources */}
          <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
            <h3 className="font-bold text-calm-900 mb-3">Need Support?</h3>
            <p className="text-sm text-calm-700 mb-4">
              If you're experiencing persistent stress or mental health
              concerns, please reach out to:
            </p>
            <ul className="space-y-2 text-sm text-calm-700">
              <li>• Your university counseling center</li>
              <li>• Student support services</li>
              <li>• Mental health professionals</li>
              <li>• Crisis hotlines available 24/7</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center">
          <Loader size="lg" message="Loading your results..." />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
