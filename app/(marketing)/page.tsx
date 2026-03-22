import Link from "next/link";
import s from "./page.module.css";

const TICKER_ITEMS = [
  "ATS Score ↑",
  "Interview Rate +3×",
  "Western Keywords ↑",
  "Passive Language ↓",
  "PDF + DOCX Export",
  "Built for Devs",
];

export const metadata = {
  title: "Westernize — Your CV. Rebuilt. Westernized.",
  description:
    "Upload your CV and job description. Get a match score, gap analysis, and AI-rewritten bullet points optimized for Western tech companies.",
};

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroEyebrow}>For developers from Eastern Europe</div>
        <h1 className={s.heroTitle}>
          <span className={s.line1}>YOUR CV.</span>
          <span className={s.line2}>REBUILT.</span>
          <span className={s.line3}>WESTERNIZED.</span>
        </h1>

        <div className={s.stampWrap}>
          <div className={s.stamp}>
            <span className={s.stampTextTop}>APPROVED FOR</span>
            <div className={s.stampCenter}>W</div>
            <div className={s.stampSub}>WESTERN TECH</div>
            <span className={s.stampTextBot}>westernize.dev</span>
          </div>
        </div>

        <p className={s.heroSub}>
          You have the skills. Your CV speaks the <em>wrong language.</em>
          <br />
          Westernize rewrites it for the companies that are actually hiring you.
        </p>

        <div className={s.heroCtas}>
          <Link href="/signup" className={s.btnRed}>
            Westernize my CV — it&apos;s free
          </Link>
          <a href="#how" className={s.btnOutline}>
            See how it works
          </a>
        </div>

        <div className={s.heroCountries}>
          {"🇲🇩 🇷🇴 🇺🇦 🇵🇱 🇧🇬 🇷🇸 🇭🇺 🇱🇹 🇱🇻 🇪🇪 🇧🇾 🇬🇪".split(" ").map((flag) => (
            <span key={flag}>{flag}</span>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div className={s.ticker}>
        <div className={s.tickerInner}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className={s.tickerItem}>
              {item} <span className={s.sep}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <div className={s.section}>
        <div className={s.label}>The transformation</div>
        <h2 className={s.sectionTitle}>
          Same career. <em>Different story.</em>
        </h2>
        <p className={s.sectionSub}>
          The words you use to describe your work are costing you interviews. Here&apos;s what Westernize actually
          changes.
        </p>

        <div className={s.baWrap}>
          <div className={s.baCol}>
            <div className={`${s.baTag} ${s.baTagBefore}`}>Your CV now</div>
            <div className={s.baEntry}>
              <div className={s.baRole}>Backend Developer · 2020–2024</div>
              <div className={s.baBullet}>Responsible for developing features for the main product</div>
              <div className={s.baBullet}>Worked with the team on bug fixing and performance improvements</div>
              <div className={s.baBullet}>Helped with deployment and server maintenance</div>
            </div>
            <div className={s.baEntry}>
              <div className={s.baRole}>Junior Developer · 2018–2020</div>
              <div className={s.baBullet}>Participated in development of web applications</div>
              <div className={s.baBullet}>Used React and Node.js to build features</div>
            </div>
            <div className={s.baScore}>
              <div className={s.scoreBarWrap}>
                <div className={s.scoreBarLabel}>
                  <span>ATS Match Score</span>
                  <span>34%</span>
                </div>
                <div className={s.scoreBar}>
                  <div className={s.scoreFillLow} />
                </div>
              </div>
            </div>
          </div>

          <div className={s.baColAfter}>
            <div className={`${s.baTag} ${s.baTagAfter}`}>After Westernize</div>
            <div className={s.baEntry}>
              <div className={s.baRole}>Backend Developer · 2020–2024</div>
              <div className={s.baBulletStrong}>
                Engineered <strong>23 production features</strong> across a distributed Node.js microservices platform
                serving 800k DAU, cutting p99 latency by <strong>42%</strong>
              </div>
              <div className={s.baBulletStrong}>
                Led a 4-engineer squad to resolve <strong>90+ critical bugs</strong>, reducing customer-reported
                incidents by 61% in two quarters
              </div>
              <div className={s.baBulletStrong}>
                Owned <strong>CI/CD pipeline</strong> on AWS ECS; reduced deployment time from 45 min → 8 min using
                GitHub Actions
              </div>
            </div>
            <div className={s.baEntry}>
              <div className={s.baRole}>Junior Developer · 2018–2020</div>
              <div className={s.baBulletStrong}>
                Delivered <strong>8 full-stack features</strong> using React + Node.js, contributing to a 19% uplift in
                user activation rate
              </div>
              <div className={s.baBulletStrong}>
                Owned front-end performance audit that improved Lighthouse score from <strong>51 → 87</strong>
              </div>
            </div>
            <div className={s.baScore}>
              <div className={s.scoreBarWrap}>
                <div className={s.scoreBarLabel}>
                  <span>ATS Match Score</span>
                  <span style={{ color: "var(--red)" }}>91%</span>
                </div>
                <div className={s.scoreBar}>
                  <div className={s.scoreFillHigh} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEMS */}
      <div className={`${s.section} ${s.sectionNoPadTop}`}>
        <div className={s.label}>Why CVs fail</div>
        <h2 className={s.sectionTitle}>
          Three reasons you&apos;re not <em>getting callbacks.</em>
        </h2>
        <p className={s.sectionSub}>It&apos;s not your experience. It&apos;s how you&apos;re describing it.</p>

        <div className={s.problemGrid}>
          {[
            {
              num: "01 —",
              icon: "🤖",
              title: "Filtered before a human sees it",
              text: "ATS systems scan for specific keywords. Your CV uses slightly different phrasing — and gets rejected automatically. You never even knew.",
            },
            {
              num: "02 —",
              icon: "📝",
              title: "Passive voice kills impact",
              text: '"Responsible for" and "worked with" signal junior thinking in Western hiring culture — regardless of seniority. Active, quantified language is expected.',
            },
            {
              num: "03 —",
              icon: "🌍",
              title: "Built for the wrong market",
              text: 'CV tools are designed for US candidates. They don\'t understand your education system, your career path, or what "senior" means in your country.',
            },
          ].map((card) => (
            <div key={card.num} className={s.problemCard}>
              <div className={s.problemNum}>{card.num}</div>
              <span className={s.problemIcon}>{card.icon}</span>
              <h3 className={s.problemCardTitle}>{card.title}</h3>
              <p className={s.problemCardText}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className={`${s.section} ${s.sectionNoPadTop}`} id="how">
        <div className={s.label}>How it works</div>
        <h2 className={s.sectionTitle}>
          Upload. Analyze. <em>Get hired.</em>
        </h2>
        <p className={s.sectionSub}>Three steps. Takes under five minutes.</p>

        <div className={s.stepsWrap}>
          {[
            {
              n: "01",
              title: "Upload your CV + job description",
              text: "Paste text or drop a PDF. Add the job listing URL or text. We parse both in seconds — no formatting gymnastics required.",
              arrow: "→",
            },
            {
              n: "02",
              title: "AI analyzes the gap",
              text: "We score your CV against the JD, flag every missing keyword, identify passive language, and build a tailored rewrite plan.",
              arrow: "→",
            },
            {
              n: "03",
              title: "Download your westernized CV",
              text: "Review every suggested change. Accept, edit, or reject each one. Export as DOCX, ready to send.",
              arrow: "✓",
            },
          ].map((step) => (
            <div key={step.n} className={s.step}>
              <div className={s.stepN}>{step.n}</div>
              <div>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepText}>{step.text}</p>
              </div>
              <div className={s.stepArrow}>{step.arrow}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NUMBERS */}
      <div className={`${s.section} ${s.sectionNoPadTop}`}>
        <div className={s.numbersRow}>
          {[
            { big: "3×", label: "more interview callbacks reported by early users" },
            { big: "91%", label: "average ATS match score after westernizing" },
            { big: "<5m", label: "average time to a fully optimized CV" },
            { big: "12+", label: "Eastern European countries represented in beta" },
          ].map((n) => (
            <div key={n.big} className={s.numberCell}>
              <div className={s.numberBig}>{n.big}</div>
              <div className={s.numberLabel}>{n.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className={`${s.section} ${s.sectionNoPadTop}`} id="testimonials">
        <div className={s.label}>Early users</div>
        <h2 className={s.sectionTitle}>
          From Chișinău to <em>Cloudflare.</em>
        </h2>
        <p className={s.sectionSub}>Developers in the region who got callbacks they&apos;d been waiting years for.</p>
        <div className={s.testiGrid}>
          {[
            {
              quote:
                "I had 5 years of solid backend experience and couldn't get past the screening round for Western companies. After Westernize rewrote my bullet points I had 4 interview requests in 10 days.",
              flag: "🇲🇩",
              name: "Andrei C.",
              role: "Backend Dev → now @ Shopify (remote)",
            },
            {
              quote:
                "The gap analysis was eye-opening. I was missing 14 keywords that German tech companies filter for. Got a Berlin relocation offer 5 weeks after using this tool.",
              flag: "🇷🇴",
              name: "Maria P.",
              role: "Full-stack Dev → now @ Zalando",
            },
            {
              quote:
                "My English is fine but I was describing my work the Eastern European way. Westernize didn't just fix keywords — it changed how I present my entire career story.",
              flag: "🇺🇦",
              name: "Dmytro K.",
              role: "DevOps Eng → now @ Cloudflare (remote)",
            },
          ].map((t) => (
            <div key={t.name} className={s.testi}>
              <div className={s.testiQuote}>&ldquo;{t.quote}&rdquo;</div>
              <div className={s.testiFooter}>
                <div className={s.testiFlag}>{t.flag}</div>
                <div>
                  <div className={s.testiName}>{t.name}</div>
                  <div className={s.testiRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING — updated to credits model */}
      <div className={`${s.section} ${s.sectionNoPadTop}`} id="pricing">
        <div className={s.label}>Pricing</div>
        <h2 className={s.sectionTitle}>
          Try before you buy. <em>Always.</em>
        </h2>
        <p className={s.sectionSub}>
          Your first optimization is free, no card needed. If it works, pay. If not — you lost nothing.
        </p>
        <div className={s.pricingGrid}>
          <div className={s.plan}>
            <div className={s.planTier}>Free</div>
            <div className={s.planPrice}>$0</div>
            <div className={s.planDesc}>3 full optimizations. No card. Just see if it actually helps first.</div>
            <div className={s.planDivider} />
            <ul className={s.planFeatures}>
              <li className={s.planFeatureYes}>3 CV optimizations</li>
              <li className={s.planFeatureYes}>ATS match score</li>
              <li className={s.planFeatureYes}>Gap analysis</li>
              <li className={s.planFeatureYes}>Rewrite preview</li>
              <li className={s.planFeatureDim}>DOCX export</li>
            </ul>
            <Link href="/signup" className={s.btnOutline} style={{ width: "100%" }}>
              Start free
            </Link>
          </div>

          <div className={s.plan}>
            <div className={s.planTier}>Starter pack</div>
            <div className={s.planPrice}>$12</div>
            <div className={s.planDesc}>5 optimizations. Perfect for targeting a handful of dream roles.</div>
            <div className={s.planDivider} />
            <ul className={s.planFeatures}>
              <li className={s.planFeatureYes}>5 CV optimizations</li>
              <li className={s.planFeatureYes}>DOCX export</li>
              <li className={s.planFeatureYes}>Full gap analysis</li>
              <li className={s.planFeatureYes}>Bullet-by-bullet rewrite</li>
              <li className={s.planFeatureDim}>Priority AI queue</li>
            </ul>
            <Link href="/signup?pack=starter" className={s.btnRed} style={{ width: "100%" }}>
              Get started — $12
            </Link>
          </div>

          <div className={s.planHot}>
            <div className={s.planTag}>Best value</div>
            <div className={s.planTier}>Job hunt pack</div>
            <div className={s.planPrice}>$29</div>
            <div className={s.planDesc}>15 optimizations for a serious job search. Apply to every role that fits.</div>
            <div className={s.planDivider} />
            <ul className={s.planFeatures}>
              <li className={s.planFeatureYes}>15 CV optimizations</li>
              <li className={s.planFeatureYes}>DOCX export</li>
              <li className={s.planFeatureYes}>Full gap analysis</li>
              <li className={s.planFeatureYes}>Bullet-by-bullet rewrite</li>
              <li className={s.planFeatureYes}>Priority AI queue</li>
            </ul>
            <Link href="/signup?pack=hunt" className={s.btnRed} style={{ width: "100%" }}>
              Get job hunt pack — $29
            </Link>
          </div>

          <div className={s.plan}>
            <div className={s.planTier}>Lifetime</div>
            <div className={s.planPrice}>$49</div>
            <div className={s.planDesc}>Pay once, unlimited forever. Best for a focused job search sprint.</div>
            <div className={s.planDivider} />
            <ul className={s.planFeatures}>
              <li className={s.planFeatureYes}>Unlimited optimizations</li>
              <li className={s.planFeatureYes}>No recurring charge</li>
              <li className={s.planFeatureYes}>All future features</li>
              <li className={s.planFeatureYes}>DOCX export</li>
              <li className={s.planFeatureYes}>Priority AI queue</li>
            </ul>
            <Link href="/signup?pack=lifetime" className={s.btnOutline} style={{ width: "100%" }}>
              Get lifetime — $49
            </Link>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className={s.finalCta}>
        <h2 className={s.sectionTitle}>
          Your next job is
          <br />
          <em>one rewrite away.</em>
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 44 }}>
          Free to start. No credit card. Takes 5 minutes.
        </p>
        <Link href="/signup" className={s.btnRed} style={{ fontSize: 16, padding: "17px 40px" }}>
          Westernize my CV →
        </Link>
      </div>
    </>
  );
}
