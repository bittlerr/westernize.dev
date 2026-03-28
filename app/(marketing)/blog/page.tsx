import Link from "next/link";
import { posts } from "./posts";

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Blog</h1>
      <p className="text-muted mb-12">CV tips, ATS strategies, and career advice for Eastern European developers.</p>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <time className="text-sm text-muted">{post.date}</time>
              <h2 className="text-xl font-display font-bold mt-1 group-hover:text-red transition-colors">
                {post.title}
              </h2>
              <p className="text-muted mt-2 leading-relaxed">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
