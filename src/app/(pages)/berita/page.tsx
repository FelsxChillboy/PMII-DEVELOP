import Image from "next/image"
import { prisma } from "@/lib/prisma"
import SectionTag from "@/components/SectionTag"
import AnimatedSection, { StaggerItem } from "@/components/AnimatedSection"
import Card3D from "@/components/Card3D"
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const PER_PAGE = 9

export const revalidate = 60

interface Props {
  searchParams?: Promise<{ page?: string }>
}

export default async function BeritaPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp?.page) || 1)

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
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
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.news.count({ where: { published: true } }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d)

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 section-grid-light opacity-[0.05]" />
        <div className="absolute -top-40 -right-40 h-100 w-100 rounded-full bg-primary/3 blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">INFORMASI &amp; DOKUMENTASI</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Berita &amp; <span className="text-gradient">Galeri</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Informasi terbaru seputar kegiatan dan dokumentasi PR PMII Rayon
              Teknik UNUSIA.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="staggerContainer" className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base">
                Belum ada berita yang dipublikasikan.
              </p>
            </div>
          ) : (
            <>
              {totalPages > 1 && (
                <div className="mb-6 text-xs text-muted-foreground">
                  {total} berita &middot; Halaman {page} dari {totalPages}
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <StaggerItem key={item.id}>
                    <Card3D asLink href={`/berita/${item.slug}`} className="h-full">
                      <div className="aspect-[16/9] bg-secondary relative overflow-hidden flex items-center justify-center">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <Image
                            src="/og-image.svg"
                            alt={item.title}
                            fill
                            className="object-cover opacity-40"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {item.content.replace(/<[^>]+>/g, "").slice(0, 200)}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.author.name || "Penulis"}
                          </span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Baca selengkapnya <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Card3D>
                  </StaggerItem>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Link
                    href={`/berita?page=${page - 1}`}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
                    aria-disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/berita?page=${p}`}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
                    >
                      {p}
                    </Link>
                  ))}
                  <Link
                    href={`/berita?page=${page + 1}`}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
                    aria-disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
