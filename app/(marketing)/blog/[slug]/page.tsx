import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../posts";

type Params = { slug: string };

async function loadPost(slug: string) {
  try {
    return await import(`../content/${slug}.mdx`);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const mdx = await loadPost(slug);

  if (!mdx) notFound();

  const Content = mdx.default;
  const relatedPosts = posts.filter((p) => p.slug !== slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updated && { dateModified: post.updated }),
    author: {
      "@type": "Person",
      name: post.author ?? "Constantin Cuciurca",
      url: "https://www.westernize.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "Westernize",
      url: "https://www.westernize.dev",
      logo: { "@type": "ImageObject", url: "https://www.westernize.dev/icon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.westernize.dev/blog/${slug}` },
  };

  const howToJsonLd =
    slug === "how-to-write-cv-for-remote-western-jobs"
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: post.title,
          description: post.description,
          step: [
            { "@type": "HowToStep", position: 1, name: "Fix the format", text: "Follow the Western CV structure: name, summary, experience, skills, education. Drop photos, date of birth, and marital status." },
            { "@type": "HowToStep", position: 2, name: "Write a professional summary", text: "Communicate what you do, how long you've done it, and what makes you relevant for the role in 2-3 sentences." },
            { "@type": "HowToStep", position: 3, name: "Rewrite every bullet point", text: "Use the formula: strong verb + what you did + scale/context + measurable result." },
            { "@type": "HowToStep", position: 4, name: "Optimize for ATS", text: "Match keywords from the job description. Use the same phrasing. Ensure each keyword appears at least once in an experience bullet." },
            { "@type": "HowToStep", position: 5, name: "Add remote-specific signals", text: "Mention async collaboration, time zone experience, and tools like Slack, Notion, Linear, and GitHub." },
            { "@type": "HowToStep", position: 6, name: "Update LinkedIn", text: "Mirror your CV headline, summary, and keyword-rich bullets on your LinkedIn profile." },
          ],
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westernize.dev" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.westernize.dev/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.westernize.dev/blog/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      {howToJsonLd && <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>}
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24">
        <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block">
          &larr; Back to blog
        </Link>
        <time className="block text-sm text-muted mb-2">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{post.title}</h1>
        <article>
          <Content />
        </article>
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-lg font-semibold mb-4">Related articles</h2>
            <div className="space-y-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="block p-4 rounded-lg border border-border hover:border-red/30 hover:bg-bg2 transition-colors"
                >
                  <p className="font-medium text-sm">{rp.title}</p>
                  <p className="text-xs text-muted mt-1">{rp.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-muted mb-4">Ready to westernize your CV?</p>
          <Link
            href="/signup"
            className="inline-block bg-red text-white px-6 py-3 rounded-lg hover:bg-red/90 transition-colors font-semibold"
          >
            Try Westernize for free &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
