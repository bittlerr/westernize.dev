import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <div className="font-display text-7xl font-bold text-red">404</div>
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
        <p className="text-muted text-sm max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-red text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="border border-border text-sm px-5 py-2.5 rounded-lg text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
