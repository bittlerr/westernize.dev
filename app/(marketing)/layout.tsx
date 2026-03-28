import { headers } from "next/headers";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth } from "@/lib/auth";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <Link href="/" className="font-display text-lg md:text-xl font-bold tracking-tight text-red">
            WESTERNIZE
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/#how" className="text-sm text-muted hover:text-foreground transition-colors hidden md:block">
              How it works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm text-muted hover:text-foreground transition-colors hidden md:block"
            >
              Pricing
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm text-muted hover:text-foreground transition-colors hidden md:block"
            >
              Testimonials
            </Link>
            <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors hidden md:block">
              Blog
            </Link>
            <ThemeToggle />
            {session ? (
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm bg-red text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red/90 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-xs sm:text-sm bg-red text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red/90 transition-colors"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span>&copy; {new Date().getFullYear()} Westernize</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
