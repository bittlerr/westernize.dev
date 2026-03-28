import type { MetadataRoute } from "next";
import { posts } from "./(marketing)/blog/posts";

const BASE_URL = process.env.BETTER_AUTH_URL ?? "https://www.westernize.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...blogEntries,
    { url: `${BASE_URL}/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/signup`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
