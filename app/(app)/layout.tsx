import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-display text-xl font-bold tracking-tight text-red">
            WESTERNIZE
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/optimize" className="text-sm text-muted hover:text-foreground transition-colors">
              Optimize
            </Link>
            <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span className="text-sm text-muted">
              {session.user.isLifetime ? (
                <span className="text-green-400">Unlimited</span>
              ) : (
                <>
                  {session.user.credits} credit{session.user.credits !== 1 ? "s" : ""}
                </>
              )}
            </span>
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
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
