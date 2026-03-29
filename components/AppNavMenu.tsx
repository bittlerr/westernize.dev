"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AppNavMenu({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="text-muted hover:text-foreground transition-colors p-1"
        aria-label="Menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <>
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-bg2 border-b border-border z-50">
          <div className="flex flex-col px-4 py-3 gap-1">
            <Link
              href="/optimize"
              onClick={() => setOpen(false)}
              className="text-sm text-muted hover:text-foreground transition-colors py-2"
            >
              Optimize
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-sm text-muted hover:text-foreground transition-colors py-2"
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-sm text-red hover:text-red/80 transition-colors py-2"
              >
                Admin
              </Link>
            )}
            <div className="h-px bg-border my-1" />
            <button
              onClick={async () => {
                await authClient.signOut();
                router.push("/login");
              }}
              className="text-sm text-muted hover:text-foreground transition-colors py-2 text-left"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
