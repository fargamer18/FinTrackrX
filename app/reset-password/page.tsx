"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const qs = params.toString();
    const href = qs ? `/auth/reset-password?${qs}` : "/auth/reset-password";
    router.replace(href);
  }, [params, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-300 bg-black px-4">
      Redirecting to password reset…
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-300 bg-black px-4">Loading…</div>}>
      <RedirectInner />
    </Suspense>
  );
}
