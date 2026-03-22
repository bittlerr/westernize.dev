import type { MetadataRoute } from "next";

const BASE_URL = process.env.BETTER_AUTH_URL ?? "https://westernize.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/optimize", "/result/", "/admin/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
