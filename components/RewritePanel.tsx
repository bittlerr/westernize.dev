"use client";

import { useEffect, useState } from "react";
import type { Rewrites } from "@/types";

type BulletStatus = "pending" | "accepted" | "rejected" | "edited";

interface BulletState {
  original: string;
  rewritten: string;
  status: BulletStatus;
  editedText: string;
}

export interface AcceptedBullet {
  index: number;
  text: string;
}

export function RewritePanel({
  data,
  readOnly = false,
  onAcceptedChange,
}: {
  data: Rewrites;
  readOnly?: boolean;
  onAcceptedChange?: (bullets: AcceptedBullet[]) => void;
}) {
  const [bullets, setBullets] = useState<BulletState[]>(
    data.rewrites.map((r) => ({
      ...r,
      status: "pending",
      editedText: r.rewritten,
    })),
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    onAcceptedChange?.(
      bullets
        .map((b, i) => ({ index: i, text: b.editedText, status: b.status }))
        .filter((b) => b.status === "accepted" || b.status === "edited")
        .map(({ index, text }) => ({ index, text })),
    );
  }, [bullets, onAcceptedChange]);

  function update(index: number, patch: Partial<BulletState>) {
    setBullets((prev) => {
      const next = [...prev];

      next[index] = { ...next[index], ...patch };

      return next;
    });
  }

  function acceptAll() {
    setBullets((prev) => prev.map((b) => ({ ...b, status: "accepted" as const })));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Rewritten Bullets</h3>
        {!readOnly && (
          <button
            type="button"
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
                ? "border-green-border bg-green-dim"
                : bullet.status === "rejected"
                  ? "border-red/40 bg-red/10"
                  : "border-border bg-bg2"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted mb-1">Original</p>
                <p
                  className={`text-sm leading-relaxed ${bullet.status === "accepted" || bullet.status === "edited" ? "text-muted line-through" : ""}`}
                >
                  {bullet.original}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">
                  Rewritten
                  {bullet.status === "edited" && <span className="ml-1 text-green">(edited)</span>}
                </p>
                {editingIndex === i ? (
                  <textarea
                    value={bullet.editedText}
                    onChange={(e) => update(i, { editedText: e.target.value })}
                    className="w-full text-sm bg-bg border border-border rounded px-2 py-1 outline-none focus:border-red resize-none"
                    rows={3}
                  />
                ) : (
                  <p
                    className={`text-sm leading-relaxed ${bullet.status === "rejected" ? "text-muted line-through" : ""}`}
                  >
                    {bullet.editedText}
                  </p>
                )}
              </div>
            </div>

            {!readOnly && (
              <div className="flex gap-2 mt-3 justify-end">
                {editingIndex === i ? (
                  <button
                    type="button"
                    onClick={() => {
                      update(i, { status: "edited" });
                      setEditingIndex(null);
                    }}
                    className="text-xs px-3 py-1 rounded bg-green-dim text-green hover:opacity-80 transition-colors"
                  >
                    Save
                  </button>
                ) : bullet.status === "accepted" || bullet.status === "edited" ? (
                  <button
                    type="button"
                    onClick={() => update(i, { status: "pending" })}
                    className="text-xs px-3 py-1 rounded bg-bg3 text-muted hover:text-foreground transition-colors"
                  >
                    Undo
                  </button>
                ) : bullet.status === "rejected" ? (
                  <button
                    type="button"
                    onClick={() => update(i, { status: "pending" })}
                    className="text-xs px-3 py-1 rounded bg-bg3 text-muted hover:text-foreground transition-colors"
                  >
                    Undo
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => update(i, { status: "accepted" })}
                      className="text-xs px-3 py-1.5 rounded border border-green-border text-green hover:bg-green-dim transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(i)}
                      className="text-xs px-3 py-1.5 rounded border border-border text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => update(i, { status: "rejected" })}
                      className="text-xs px-3 py-1.5 rounded border border-red/40 text-red hover:bg-red/10 transition-colors"
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
