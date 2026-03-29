"use client";

import { useState } from "react";
import type { AcceptedBullet } from "@/components/RewritePanel";
import { RewritePanel } from "@/components/RewritePanel";
import type { CvParsed, Rewrites } from "@/types";

export function ResultActions({
  optimizationId,
  rewrites,
  cvParsed,
}: {
  optimizationId: string;
  rewrites: Rewrites;
  cvParsed: CvParsed;
}) {
  const [acceptedBullets, setAcceptedBullets] = useState<AcceptedBullet[]>([]);
  const [downloading, setDownloading] = useState<"docx" | "pdf" | null>(null);

  async function handleDownload(format: "docx" | "pdf") {
    setDownloading(format);

    const endpoint = format === "pdf" ? "/api/export-pdf" : "/api/export";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        optimizationId,
        acceptedBullets,
        cvParsed,
      }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${cvParsed.name.replace(/\s+/g, "_")}_westernized.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setDownloading(null);
  }

  return (
    <>
      <RewritePanel data={rewrites} onAcceptedChange={setAcceptedBullets} />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleDownload("docx")}
          disabled={downloading !== null || acceptedBullets.length === 0}
          className="bg-red text-white font-medium rounded-lg px-6 py-3 text-sm hover:bg-red/90 transition-colors disabled:opacity-50"
        >
          {downloading === "docx" ? "Generating..." : "Download DOCX"}
        </button>
        <button
          type="button"
          onClick={() => handleDownload("pdf")}
          disabled={downloading !== null || acceptedBullets.length === 0}
          className="border border-border text-muted font-medium rounded-lg px-6 py-3 text-sm hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
        >
          {downloading === "pdf" ? "Generating..." : "Download PDF"}
        </button>
      </div>
    </>
  );
}
