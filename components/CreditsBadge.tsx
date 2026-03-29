"use client";

import { useState } from "react";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import { authClient } from "@/lib/auth-client";

export function CreditsBadge() {
  const { data: session } = authClient.useSession();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!session) return null;

  const isLifetime = session.user.isLifetime;
  const credits = session.user.credits;
  const isLow = !isLifetime && credits <= 1;

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <span className={isLow ? "text-red" : "text-muted"}>
          {isLifetime ? (
            <span className="text-green-400">Unlimited</span>
          ) : (
            <>
              {credits} credit{credits !== 1 ? "s" : ""}
            </>
          )}
        </span>
        {isLow && (
          <button type="button" onClick={() => setShowUpgrade(true)} className="text-xs text-red hover:underline">
            Buy more
          </button>
        )}
      </div>
      <UpgradeDialog open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
