"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-calm-900 mb-4">
          Something Went Wrong
        </h1>
        <p className="text-calm-600 mb-8">
          We encountered an unexpected error. Please try again or return to the
          home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 border-2 border-calm-300 text-calm-700 font-semibold rounded-lg hover:bg-calm-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left p-4 bg-red-50 rounded-lg">
            <summary className="cursor-pointer text-sm font-semibold text-red-800 mb-2">
              Error Details (Dev Mode)
            </summary>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
