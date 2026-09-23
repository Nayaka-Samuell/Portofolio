"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function TapHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const src = searchParams.get('src') || 'direct';

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const performTrackingAndRedirect = async () => {
      try {
        // Fetch profile to get the dynamic profile ID
        const profileRes = await fetch(`${apiUrl}/api/profile/nayaka`);
        if (profileRes.ok) {
          const profile = await profileRes.json();
          
          // Send tap analytics with the dynamic profile ID
          await fetch(`${apiUrl}/api/analytics/tap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: profile.id, source: src }),
            keepalive: true,
          });
        }
      } catch (err) {
        console.error("Tracking failed:", err);
      } finally {
        // Brief delay for UI feedback before replacing history
        setTimeout(() => {
          router.replace('/');
        }, 500);
      }
    };

    performTrackingAndRedirect();
  }, [src, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-base">
      <div className="w-16 h-16 border-4 border-blue-main/30 border-t-blue-light rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-medium text-white font-space animate-pulse">
        Connecting...
      </h2>
      <p className="text-blue-light/70 text-sm mt-2">Redirecting to portfolio</p>
    </div>
  );
}

export default function TapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blue-base"></div>}>
      <TapHandler />
    </Suspense>
  );
}
