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

      <div className="border border-border rounded-xl bg-bg2 p-5">
        <p className="text-xs text-muted uppercase tracking-widest font-display mb-4">Export your CV</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(["docx", "pdf"] as const).map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => handleDownload(format)}
              disabled={downloading !== null || acceptedBullets.length === 0}
              className="group flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3.5 text-left transition-all hover:border-red/30 hover:bg-red/5 disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-bg"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg3 text-muted group-hover:bg-red/10 group-hover:text-red transition-colors">
                {format === "pdf" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M9 15v-2h2a1 1 0 1 1 0 2H9z" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="13" y2="17" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">{format.toUpperCase()}</div>
                <div className="text-xs text-muted">
                  {downloading === format ? "Generating..." : format === "pdf" ? "Ready to print" : "Editable document"}
                </div>
              </div>
            </button>
          ))}
        </div>
        {acceptedBullets.length === 0 && (
          <p className="text-xs text-muted mt-3 text-center">Accept at least one rewrite to export</p>
        )}
      </div>
    </>
  );
}
