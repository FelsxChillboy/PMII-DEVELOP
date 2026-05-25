import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { BookOpen, Lightbulb, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Profil organisasi PR PMII Rayon Teknik UNUSIA Jakarta Pusat — visi, misi, nilai-nilai, dan struktur kepengurusan. Wadah kaderisasi intelektual pergerakan mahasiswa teknik.",
}

const MISI = [
  "Menyelenggarakan kaderisasi yang berkualitas dan berkelanjutan.",
  "Membangun budaya akademik dan diskusi intelektual.",
  "Mengembangkan potensi kader di bidang teknik dan teknologi.",
  "Memperkuat jaringan alumni dan kemitraan strategis.",
  "Mengelola organisasi secara transparan dan profesional.",
]

const NILAI = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Ahlussunnah wal Jama'ah",
    description:
      "Berpegang teguh pada nilai-nilai Islam moderat Nahdlatul Ulama.",
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Intelektualitas",
    description:
      "Mengasah ketajaman berpikir kritis dan analitis.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Profesionalisme",
    description:
      "Tata kelola organisasi yang transparan dan akuntabel.",
  },
]

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

async function getStruktur() {
  try {
    return await prisma.organizationMember.findMany({
      orderBy: { sortOrder: "asc" },
    })
  } catch {
    return []
  }
}

export default async function TentangPage() {
  const STRUKTUR = await getStruktur()
  return (
    <div className="divide-y divide-border">
      <AnimatedSection className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 section-grid-light opacity-[0.05]" />
        <div className="absolute -top-40 -right-40 h-100 w-100 rounded-full bg-primary/3 blur-[100px] animate-float" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">PROFIL ORGANISASI</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Tentang <span className="text-gradient">Kami</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Mengenal lebih dekat PR PMII Rayon Teknik UNUSIA Jakarta Pusat
              &mdash; wadah kaderisasi intelektual pergerakan mahasiswa.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Visi <span className="text-gradient">Kami</span>
              </h2>
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-1 rounded-full bg-linear-to-b from-primary via-accent to-primary/20 animate-gradient" />
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pl-6 italic">
                  &ldquo;Menjadikan PR PMII Rayon Teknik UNUSIA sebagai pusat
                  kaderisasi intelektual yang melahirkan pemimpin berkarakter,
                  berwawasan teknologi, dan berkomitmen pada nilai-nilai Ahlussunnah
                  wal Jama&rsquo;ah an-Nahdliyyah.&rdquo;
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Misi <span className="text-gradient">Kami</span>
              </h2>
              <ol className="space-y-4">
                {MISI.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center h-7 w-7 shrink-0 rounded-full bg-linear-to-br from-primary to-accent text-white text-sm font-bold mt-0.5 animate-gradient">
                      {i + 1}
                    </span>
                    <span className="text-base text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <SectionTag className="mb-4 mt-16 lg:mt-20">NILAI-NILAI FONDASI</SectionTag>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-8">
            Nilai <span className="text-gradient">Kami</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {NILAI.map((nilai) => (
              <Card key={nilai.title} className="p-6 border border-border/50 bg-card/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-accent/10 to-primary/10 animate-gradient flex items-center justify-center mb-4">
                    <div className="text-accent">{nilai.icon}</div>
                  </div>
                  <CardTitle className="font-heading font-semibold text-lg text-foreground mb-2">
                    {nilai.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {nilai.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTag className="mb-4">KEPENGURUSAN</SectionTag>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Struktur <span className="text-gradient">Organisasi</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-10">Periode 2025/2026</p>

          {STRUKTUR.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Belum ada data struktur organisasi.
            </div>
          ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STRUKTUR.map((member, i) => (
              <div key={member.id} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <Card className="p-6 text-center border border-border/50 bg-card/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg glass-panel glass-panel-hover">
                <CardContent className="p-0">
                  <div className="mx-auto mb-3">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary/10 to-accent/10 animate-gradient flex items-center justify-center mx-auto">
                        <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-lg">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs tracking-widest uppercase text-primary font-medium mb-0.5">
                    {member.position}
                  </p>
                  <p className="font-heading font-semibold text-foreground mb-2">
                    {member.name}
                  </p>
                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <InstagramIcon className="h-4 w-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                </CardContent>
              </Card>
              </div>
            ))}
          </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
