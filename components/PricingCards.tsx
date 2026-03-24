import Link from "next/link";

const plans = [
  {
    tier: "Free",
    price: "$0",
    desc: "3 full optimizations. No card needed.",
    features: [
      { text: "3 CV optimizations", included: true },
      { text: "ATS match score", included: true },
      { text: "Gap analysis", included: true },
      { text: "Rewrite preview", included: true },
      { text: "DOCX export", included: false },
    ],
    cta: "Start free",
    href: "/signup",
    hot: false,
  },
  {
    tier: "Starter Pack",
    price: "$12",
    desc: "5 optimizations for a focused job search.",
    features: [
      { text: "5 CV optimizations", included: true },
      { text: "DOCX export", included: true },
      { text: "Full gap analysis", included: true },
      { text: "Bullet-by-bullet rewrite", included: true },
      { text: "Priority AI queue", included: false },
    ],
    cta: "Get started — $12",
    href: "/signup?pack=starter",
    hot: false,
  },
  {
    tier: "Hunt Pack",
    price: "$49",
    desc: "50 optimizations. Apply to every role that fits.",
    features: [
      { text: "50 CV optimizations", included: true },
      { text: "DOCX export", included: true },
      { text: "Full gap analysis", included: true },
      { text: "Bullet-by-bullet rewrite", included: true },
      { text: "Priority AI queue", included: true },
    ],
    cta: "Get hunt pack — $49",
    href: "/signup?pack=hunt",
    hot: true,
  },
];

export function PricingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div
          key={plan.tier}
          className={`relative rounded-xl border p-8 transition-colors ${
            plan.hot ? "border-red bg-bg3" : "border-border bg-bg2 hover:border-foreground/15"
          }`}
        >
          {plan.hot && (
            <span className="absolute -top-3 left-8 bg-red text-white font-display text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm">
              Best value
            </span>
          )}
          <div className="font-display text-[9px] uppercase tracking-[0.2em] text-muted mb-5">{plan.tier}</div>
          <div className="font-display text-5xl font-black tracking-tighter mb-1.5">{plan.price}</div>
          <p className="text-sm text-muted mb-8 leading-relaxed">{plan.desc}</p>
          <div className="h-px bg-border mb-7" />
          <ul className="space-y-3 mb-8">
            {plan.features.map((f) => (
              <li key={f.text} className={`text-sm flex items-start gap-2.5 ${f.included ? "" : "text-muted"}`}>
                <span className={`text-xs mt-0.5 ${f.included ? "text-red" : "text-muted"}`}>
                  {f.included ? "✓" : "✕"}
                </span>
                {f.text}
              </li>
            ))}
          </ul>
          <Link
            href={plan.href}
            className={`block w-full text-center rounded py-3.5 text-sm font-semibold transition-colors ${
              plan.hot
                ? "bg-red text-white hover:bg-red/90"
                : "border border-border text-muted hover:text-foreground hover:border-foreground/20"
            }`}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
