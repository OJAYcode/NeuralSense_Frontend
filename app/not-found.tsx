import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-bold text-calm-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-calm-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-calm-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
