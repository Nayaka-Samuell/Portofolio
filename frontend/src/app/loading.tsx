export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-base px-6">
      {/* Elegant Spinner / Shimmer */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-blue-main/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-main rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 border-4 border-blue-light/50 rounded-full border-b-transparent animate-pulse" style={{ animationDuration: '2s' }}></div>
      </div>

      {/* Shimmer Text */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <div className="h-8 bg-blue-dark/40 rounded-full w-48 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-blue-main/20 to-transparent"></div>
        </div>
        <div className="h-4 bg-blue-dark/30 rounded-full w-64 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-blue-main/10 to-transparent" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
