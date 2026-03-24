import Link from "next/link";

export default function VerifiedPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
            <path d="M5 10l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold">Email verified</h1>
        <p className="text-muted">Your account is ready. Start optimizing your CV.</p>
        <Link
          href="/optimize"
          className="inline-block bg-red text-white font-medium rounded-lg px-6 py-3 text-sm hover:bg-red/90 transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
