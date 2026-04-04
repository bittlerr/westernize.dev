import type { MetadataRoute } from "next";

const BASE_URL = process.env.BETTER_AUTH_URL ?? "https://www.westernize.dev";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/dashboard", "/optimize", "/result/", "/admin/", "/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "anthropic-ai", allow: "/", disallow },
      { userAgent: "CCBot", allow: "/", disallow },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
