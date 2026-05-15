import type { MetadataRoute } from "next"

const BASE_URL = "https://pmii-rayonteknik-unusia.vercel.app"

const ROUTES = [
  { path: "/", priority: 1, changeFreq: "weekly" as const },
  { path: "/tentang", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/berita", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/kegiatan", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/donasi", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/transparansi", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/kontak", priority: 0.7, changeFreq: "monthly" as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }))
}
