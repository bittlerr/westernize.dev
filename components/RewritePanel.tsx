"use client";

import { useState } from "react";
import type { Rewrites } from "@/types";

type BulletStatus = "pending" | "accepted" | "rejected" | "edited";

interface BulletState {
  original: string;
  rewritten: string;
  status: BulletStatus;
  editedText: string;
}

export function RewritePanel({
  data,
  readOnly = false,
  onAcceptedChange,
}: {
  data: Rewrites;
  readOnly?: boolean;
  onAcceptedChange?: (bullets: string[]) => void;
}) {
  const [bullets, setBullets] = useState<BulletState[]>(
    data.rewrites.map((r) => ({
      ...r,
      status: "pending",
      editedText: r.rewritten,
    })),
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function update(index: number, patch: Partial<BulletState>) {
    setBullets((prev) => {
      const next = [...prev];

      next[index] = { ...next[index], ...patch };
      onAcceptedChange?.(next.filter((b) => b.status === "accepted" || b.status === "edited").map((b) => b.editedText));

      return next;
    });
  }

  function acceptAll() {
    setBullets((prev) => {
      const next = prev.map((b) => ({ ...b, status: "accepted" as const }));

      onAcceptedChange?.(next.map((b) => b.editedText));

      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Rewritten Bullets</h3>
        {!readOnly && (
          <button
            onClick={acceptAll}
            className="text-xs bg-red text-white px-3 py-1.5 rounded-lg hover:bg-red/90 transition-colors"
          >
            Accept all
          </button>
        )}
      </div>

      <div className="space-y-3">
        {bullets.map((bullet, i) => (
          <div
            key={i}
            className={`border rounded-lg p-4 transition-colors ${
              bullet.status === "accepted" || bullet.status === "edited"
                ? "border-green-500/30 bg-green-500/5"
                : bullet.status === "rejected"
                  ? "border-red/30 bg-red-dim opacity-50"
                  : "border-border"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted mb-1">Original</p>
                <p className="text-sm leading-relaxed">{bullet.original}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Rewritten</p>
                {editingIndex === i ? (
                  <textarea
                    value={bullet.editedText}
                    onChange={(e) => update(i, { editedText: e.target.value })}
                    className="w-full text-sm bg-bg2 border border-border rounded px-2 py-1 outline-none focus:border-red resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{bullet.editedText}</p>
                )}
              </div>
            </div>

            {!readOnly && (
              <div className="flex gap-2 mt-3 justify-end">
                {editingIndex === i ? (
                  <button
                    onClick={() => {
                      update(i, { status: "edited" });
                      setEditingIndex(null);
                    }}
                    className="text-xs px-3 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => update(i, { status: "accepted" })}
                      className="text-xs px-3 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="text-xs px-3 py-1 rounded bg-bg3 text-muted hover:text-foreground transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => update(i, { status: "rejected" })}
                      className="text-xs px-3 py-1 rounded bg-red-dim text-red hover:bg-red/20 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
