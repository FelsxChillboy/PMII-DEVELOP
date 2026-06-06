import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

const BASE_URL = "https://pmii-rayonteknik-unusia.vercel.app"

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFreq: "weekly" as const },
  { path: "/tentang", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/berita", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/kegiatan", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/kontak", priority: 0.7, changeFreq: "monthly" as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, events] = await Promise.allSettled([
    prisma.news.findMany({ select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" } }),
    prisma.event.findMany({ select: { id: true, updatedAt: true }, orderBy: { updatedAt: "desc" } }),
  ])

  const newsRoutes =
    news.status === "fulfilled"
      ? news.value.map((n) => ({
          url: `${BASE_URL}/berita/${n.slug}`,
          lastModified: n.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      : []

  const eventRoutes =
    events.status === "fulfilled"
      ? events.value.map((e) => ({
          url: `${BASE_URL}/kegiatan/${e.id}`,
          lastModified: e.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      : []

  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }))

  return [...staticRoutes, ...newsRoutes, ...eventRoutes]
}
