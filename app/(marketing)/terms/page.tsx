export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-sm text-muted space-y-6 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3">
        <p>Last updated: March 2026</p>

        <h2>Service</h2>
        <p>
          Westernize provides AI-powered CV optimization tools. The service analyzes your CV against job descriptions
          and suggests improvements. Results are AI-generated and should be reviewed before use.
        </p>

        <h2>Credits</h2>
        <p>
          Free accounts receive 1 optimization credit. Additional credits can be purchased. Lifetime plans provide
          unlimited optimizations. Credits are non-refundable and non-transferable.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Do not use this service to generate misleading or fraudulent content. The tool is designed to improve how you
          present your genuine experience, not to fabricate qualifications.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          Westernize is provided &ldquo;as is&rdquo;. We make no guarantees about job outcomes. AI-generated suggestions
          may not always be accurate and should be reviewed.
        </p>

        <h2>Contact</h2>
        <p>For questions about these terms, email legal@westernize.dev.</p>
      </div>
    </div>
  );
}
