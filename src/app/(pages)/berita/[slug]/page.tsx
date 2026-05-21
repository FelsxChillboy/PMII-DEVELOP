import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Calendar, User } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import SectionTag from "@/components/SectionTag"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      select: { slug: true },
    })
    return news.map((item) => ({ slug: item.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await prisma.news.findUnique({
    where: { slug },
    select: { title: true, content: true },
  })
  if (!item) return {}
  return {
    title: item.title,
    description: item.content.replace(/<[^>]+>/g, "").slice(0, 160),
  }
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params

  const news = await prisma.news.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      imageUrl: true,
      published: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  })

  if (!news || !news.published) notFound()

  const date = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(news.createdAt)

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Berita
            </Link>
            <SectionTag className="mb-4">BERITA</SectionTag>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              {news.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {news.author.name ?? "Penulis"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {date}
              </span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article
            className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </AnimatedSection>
    </div>
  )
}
