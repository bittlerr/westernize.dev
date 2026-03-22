"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function CreditsBadge() {
  const { data: session } = authClient.useSession();

  if (!session) return null;

  const isLifetime = session.user.isLifetime;
  const credits = session.user.credits;
  const isLow = !isLifetime && credits <= 1;

  return (
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
        <Link href="/#pricing" className="text-xs text-red hover:underline">
          Buy more
        </Link>
      )}
    </div>
  );
}
