"use client";

import { useCallback, useEffect, useState } from "react";

const PACKS = [
  {
    id: "starter",
    name: "Starter Pack",
    price: "$12",
    credits: 5,
    desc: "Focused job search — 5 positions",
  },
  {
    id: "hunt",
    name: "Hunt Pack",
    price: "$49",
    credits: 50,
    desc: "Serious job hunt — 50 positions",
    hot: true,
  },
];

export function UpgradeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleBuy = useCallback(async (packId: string) => {
    setLoading(packId);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });

      if (!res.ok) return;

      const { url } = await res.json();

      window.location.href = url;
    } finally {
      setLoading(null);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm border-none cursor-default"
        tabIndex={-1}
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative bg-bg border border-border rounded-t-xl sm:rounded-xl max-w-md w-full sm:mx-4 p-5 sm:p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors text-lg"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <h2 className="font-display text-xl font-bold mb-1">You're out of credits</h2>
          <p className="text-sm text-muted">Pick a pack to keep optimizing.</p>
        </div>

        <div className="space-y-3">
          {PACKS.map((pack) => (
            <button
              type="button"
              key={pack.id}
              onClick={() => handleBuy(pack.id)}
              disabled={loading !== null}
              className={`w-full text-left rounded-lg border p-5 transition-all ${
                pack.hot ? "border-red bg-red/5 hover:bg-red/10" : "border-border bg-bg2 hover:border-foreground/15"
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold">{pack.name}</span>
                  {pack.hot && (
                    <span className="text-[10px] uppercase tracking-widest bg-red text-white px-2 py-0.5 rounded-sm font-display">
                      Best value
                    </span>
                  )}
                </div>
                <span className="font-display text-xl font-black">{pack.price}</span>
              </div>
              <p className="text-sm text-muted mt-1">
                {pack.credits} optimizations — {pack.desc}
              </p>
              {loading === pack.id && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted">
                  <span className="w-3 h-3 border-2 border-red border-t-transparent rounded-full animate-spin" />
                  Redirecting to checkout...
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
