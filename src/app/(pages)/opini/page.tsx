import { ArrowRight } from "lucide-react"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"

export default function OpiniPage() {
  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">WACANA</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Opini <span className="text-primary">Publik</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Ruang opini untuk berbagi ide, kritik, dan perspektif tentang gerakan kaderisasi, kegiatan sosial, dan arah organisasi.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "Kaderisasi yang Berkelanjutan",
                description:
                  "Membangun masa depan organisasi melalui pelatihan dan pengalaman nyata yang responsif terhadap perubahan zaman.",
              },
              {
                title: "Peran Generasi Muda",
                description:
                  "Merespon tantangan masyarakat saat ini dengan gagasan segar dan aksi terukur demi kemajuan bersama.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Opini
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
