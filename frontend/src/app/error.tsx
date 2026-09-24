"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-base px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] -z-10"></div>

      <div className="glassmorphism p-10 rounded-3xl max-w-lg w-full text-center border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-white font-space mb-4">Oops! Something went wrong</h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected error while trying to process your request. 
          Please try refreshing the page or come back later.
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-3 px-8 py-3 bg-blue-main hover:bg-blue-light text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(96,165,250,0.5)] transform hover:-translate-y-1"
        >
          <RefreshCcw size={18} /> Try Again
        </button>
      </div>
    </div>
  );
}
