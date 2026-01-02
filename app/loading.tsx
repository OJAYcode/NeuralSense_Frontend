export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-calm-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-calm-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
