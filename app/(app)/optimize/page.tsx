"use client";

import { useCallback, useState } from "react";
import { GapAnalysis } from "@/components/GapAnalysis";
import { OptimizeForm } from "@/components/OptimizeForm";
import { RewritePanel } from "@/components/RewritePanel";
import { ScoreCard } from "@/components/ScoreCard";
import type { OptimizationResult } from "@/types";

export default function OptimizePage() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [acceptedBullets, setAcceptedBullets] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);

  const handleComplete = useCallback((r: OptimizationResult) => {
    setResult(r);
    setAcceptedBullets(r.rewrites.rewrites.map((b: { original: string; rewritten: string }) => b.rewritten));
  }, []);

  async function handleDownload() {
    if (!result) return;
    setDownloading(true);

    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        optimizationId: result.id,
        acceptedBullets,
        cvParsed: result.cvParsed,
      }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.cvParsed.name.replace(/\s+/g, "_")}_westernized.docx`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setDownloading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-2xl font-bold mb-8">Optimize your CV</h1>

      {!result ? (
        <OptimizeForm onComplete={handleComplete} />
      ) : (
        <div className="space-y-10">
          <div className="flex items-start gap-10">
            <ScoreCard score={result.matchScore} />
            <div className="flex-1">
              <GapAnalysis data={result.gapAnalysis} />
            </div>
          </div>

          <RewritePanel data={result.rewrites} onAcceptedChange={setAcceptedBullets} />

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              disabled={downloading || acceptedBullets.length === 0}
              className="bg-red text-white font-medium rounded-lg px-6 py-3 text-sm hover:bg-red/90 transition-colors disabled:opacity-50"
            >
              {downloading ? "Generating..." : "Download DOCX"}
            </button>
            <button
              onClick={() => setResult(null)}
              className="border border-border rounded-lg px-6 py-3 text-sm text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
