import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/login"],
    },
    sitemap: "https://pmii-rayonteknik-unusia.vercel.app/sitemap.xml",
  }
}
