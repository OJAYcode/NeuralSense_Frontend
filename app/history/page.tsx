"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useHistoryStore, useAuthStore } from "@/lib/store";
import StressBadge from "@/components/StressBadge";
import Loader from "@/components/Loader";
import type { StressLevel, HistorySession } from "@/types";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { sessions, isLoading, error, fetchHistory } = useHistoryStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.isGuest) {
      router.push("/");
      return;
    }

    fetchHistory();
  }, [isAuthenticated, user, fetchHistory, router]);

  if (!isAuthenticated || user?.isGuest) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center">
        <Loader size="lg" message="Loading your history..." />
      </div>
    );
  }

  // Prepare chart data
  const chartData = sessions
    .slice()
    .reverse()
    .map((session, index) => ({
      index: index + 1,
      date: new Date(session.timestamp).toLocaleDateString(),
      stressValue:
        session.stressLevel === "low"
          ? 1
          : session.stressLevel === "moderate"
          ? 2
          : 3,
      confidence: session.confidence * 100,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 via-white to-primary-50">
      {/* Header */}
      <nav className="container mx-auto px-6 py-6 border-b border-calm-200 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
              NS
            </div>
            <span className="text-2xl font-bold text-calm-900">
              NeuralSense
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/session"
              className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              New Session
            </Link>
            <button
              onClick={() => {
                clearAuth();
                router.push("/auth/login");
              }}
              className="px-4 py-2 bg-calm-100 text-calm-700 font-medium rounded-lg hover:bg-calm-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-calm-900 mb-4">
              Your Stress History
            </h1>
            <p className="text-calm-600">
              Track your stress levels over time and identify patterns
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {sessions.length === 0 && !error && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-calm-100 to-calm-200 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-calm-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-calm-900 mb-4">
                No Sessions Yet
              </h2>
              <p className="text-calm-600 mb-8">
                Start your first stress check to begin tracking your well-being
              </p>
              <Link
                href="/session"
                className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start First Session
              </Link>
            </div>
          )}

          {/* Content */}
          {sessions.length > 0 && (
            <>
              {/* Summary Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl p-6 shadow-lg border border-primary-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-calm-600 mb-1">
                    Total Sessions
                  </p>
                  <p className="text-3xl font-bold text-calm-900">
                    {sessions.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-white to-calm-50 rounded-xl p-6 shadow-lg border border-calm-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-calm-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-calm-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-calm-600 mb-1">
                    Latest Session
                  </p>
                  <p className="text-lg font-semibold text-calm-900">
                    {new Date(sessions[0].timestamp).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-calm-600 mb-1">
                    Average Level
                  </p>
                  <p className="text-lg font-semibold text-calm-900 capitalize">
                    {(() => {
                      const avg =
                        sessions.reduce(
                          (sum, s) =>
                            sum +
                            (s.stressLevel === "low"
                              ? 1
                              : s.stressLevel === "moderate"
                              ? 2
                              : 3),
                          0
                        ) / sessions.length;
                      return avg < 1.5
                        ? "Low"
                        : avg < 2.5
                        ? "Moderate"
                        : "High";
                    })()}
                  </p>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-calm-200">
                <h2 className="text-xl font-bold text-calm-900 mb-6">
                  Stress Trend Over Time
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      domain={[0, 4]}
                      ticks={[1, 2, 3]}
                      tickFormatter={(value) =>
                        value === 1 ? "Low" : value === 2 ? "Moderate" : "High"
                      }
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === "stressValue") {
                          return [
                            value === 1
                              ? "Low"
                              : value === 2
                              ? "Moderate"
                              : "High",
                            "Stress Level",
                          ];
                        }
                        return [value.toFixed(0) + "%", "Confidence"];
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="stressValue"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      name="Stress Level"
                      dot={{ fill: "#0ea5e9", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Session List */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-calm-200">
                <h2 className="text-xl font-bold text-calm-900 mb-6">
                  Session History
                </h2>
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div
                      key={session.id || `session-${index}`}
                      className="flex items-center justify-between p-4 bg-calm-50 rounded-lg hover:bg-calm-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <StressBadge level={session.stressLevel} size="sm" />
                          <span className="text-sm text-calm-600">
                            {new Date(session.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-calm-700">
                          {session.feedback}
                        </p>
                      </div>
                      <Link
                        href={`/results?sessionId=${session.id}`}
                        className="ml-4 px-4 py-2 text-primary-600 font-medium hover:text-primary-700 text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
