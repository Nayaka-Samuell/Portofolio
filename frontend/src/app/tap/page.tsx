"use client";

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function TapHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const src = searchParams.get('src') || 'direct';
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;

    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const performTrackingAndRedirect = async () => {
      if (hasFired.current) return;
      hasFired.current = true;
      timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const profileRes = await fetch(`${apiUrl}/api/profile/Nayaka21060112`, {
          signal: controller.signal,
        });
        if (!profileRes.ok) throw new Error('Profile unavailable');

        const response = await fetch(`${apiUrl}/api/analytics/tap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Nayaka21060112', source: src }),
          signal: controller.signal,
          keepalive: true,
        });
        if (!response.ok) throw new Error('Tracking rejected');
      } catch {
        // Analytics failure or timeout must not block access to the portfolio.
      } finally {
        clearTimeout(timeoutId);
        router.replace('/');
      }
    };

    // Defer until after Strict Mode's setup/cleanup replay, so it cannot
    // abort the only request before it starts or send a duplicate POST.
    const startId = setTimeout(() => void performTrackingAndRedirect(), 0);
    return () => {
      clearTimeout(startId);
      clearTimeout(timeoutId);
      controller.abort();
    };
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
