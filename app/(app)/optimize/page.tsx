"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { OptimizeForm } from "@/components/OptimizeForm";
import type { OptimizationResult } from "@/types";

export default function OptimizePage() {
  const router = useRouter();

  const handleComplete = useCallback(
    (r: OptimizationResult) => {
      router.push(`/result/${r.id}`);
    },
    [router],
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-2xl font-bold mb-8">Optimize your CV</h1>
      <OptimizeForm onComplete={handleComplete} />
    </div>
  );
}
