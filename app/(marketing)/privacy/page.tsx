export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-sm text-muted space-y-6 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3">
        <p>Last updated: March 2026</p>

        <h2>What we collect</h2>
        <p>
          We collect your email address and name when you sign up. When you use the optimization feature, we process the
          CV text and job description you provide. We store optimization results so you can access them later.
        </p>

        <h2>How we use your data</h2>
        <p>
          Your CV and job description text are sent to the Anthropic API for analysis. We do not share your data with
          any other third parties. Payment processing is handled by Lemon Squeezy — we never see your card details.
        </p>

        <h2>Data retention</h2>
        <p>
          Your account data and optimization history are retained until you request deletion. You can delete your
          account at any time by contacting us.
        </p>

        <h2>Contact</h2>
        <p>For privacy questions, email privacy@westernize.dev.</p>
      </div>
    </div>
  );
}
