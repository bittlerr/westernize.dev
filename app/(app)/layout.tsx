import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNavMenu } from "@/components/AppNavMenu";
import { CreditsBadge } from "@/components/CreditsBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border bg-bg2">
        <div className="relative mx-auto max-w-6xl flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <Link href="/dashboard" className="font-display text-lg md:text-xl font-bold tracking-tight text-red">
            WESTERNIZE
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/optimize" className="text-sm text-muted hover:text-foreground transition-colors">
              Optimize
            </Link>
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {session.user.role === "admin" && (
              <Link href="/admin" className="text-sm text-red hover:text-red/80 transition-colors">
                Admin
              </Link>
            )}
            <ThemeToggle />
            <CreditsBadge />
            <form
              action={async () => {
                "use server";
                const h = await headers();
                await auth.api.signOut({ headers: h });
                redirect("/login");
              }}
            >
              <button type="submit" className="text-sm text-muted hover:text-foreground transition-colors">
                Log out
              </button>
            </form>
          </div>
          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-3">
            <CreditsBadge />
            <ThemeToggle />
            <AppNavMenu isAdmin={session.user.role === "admin"} />
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
