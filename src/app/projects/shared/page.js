"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SharedProjectsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve any search parameters when redirecting
    const params = new URLSearchParams(searchParams);
    router.replace(`/projects/public${params.toString() ? `?${params.toString()}` : ''}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-600">Redirecting to Public Projects...</p>
    </div>
  );
}