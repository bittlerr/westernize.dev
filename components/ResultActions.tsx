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
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);

    const res = await fetch("/api/export", {
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
      a.download = `${cvParsed.name.replace(/\s+/g, "_")}_westernized.docx`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setDownloading(false);
  }

  return (
    <>
      <RewritePanel data={rewrites} onAcceptedChange={setAcceptedBullets} />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading || acceptedBullets.length === 0}
          className="bg-red text-white font-medium rounded-lg px-6 py-3 text-sm hover:bg-red/90 transition-colors disabled:opacity-50"
        >
          {downloading ? "Generating..." : "Download DOCX"}
        </button>
      </div>
    </>
  );
}
