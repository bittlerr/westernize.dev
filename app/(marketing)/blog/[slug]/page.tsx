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

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24">
      <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block">
        &larr; Back to blog
      </Link>
      <time className="block text-sm text-muted mb-2">{post.date}</time>
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{post.title}</h1>
      <article>
        <Content />
      </article>
      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-muted mb-4">Ready to westernize your CV?</p>
        <Link
          href="/signup"
          className="inline-block bg-red text-white px-6 py-3 rounded-lg hover:bg-red/90 transition-colors font-semibold"
        >
          Try Westernize for free &rarr;
        </Link>
      </div>
    </div>
  );
}
