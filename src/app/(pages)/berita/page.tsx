"use client"

import { useState } from "react"
import Image from "next/image"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import { Calendar, User } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  date: string
}

const DEMO_NEWS: NewsItem[] = []

const CATEGORIES = ["Semua", "Kaderisasi", "Diskusi", "Sosial", "Pengumuman"]

export default function BeritaPage() {
  const [activeCategory, setActiveCategory] = useState("Semua")

  const filtered =
    activeCategory === "Semua"
      ? DEMO_NEWS
      : DEMO_NEWS.filter((n) => n.category === activeCategory)

  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">INFORMASI &amp; DOKUMENTASI</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Berita &amp; <span className="text-primary">Galeri</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Informasi terbaru seputar kegiatan dan dokumentasi PR PMII Rayon
              Teknik UNUSIA.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base">
                Belum ada berita yang dipublikasikan.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300"
                >
                  <div className="aspect-[16/9] bg-secondary relative overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Calendar className="h-8 w-8" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.author}
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
