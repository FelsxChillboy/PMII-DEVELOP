import type { Metadata } from "next"
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

const STRUKTUR = [
  { jabatan: "Ketua", nama: "-" },
  { jabatan: "Wakil Ketua", nama: "-" },
  { jabatan: "Sekretaris", nama: "-" },
  { jabatan: "Bendahara", nama: "-" },
  { jabatan: "Dept. Kaderisasi", nama: "-" },
  { jabatan: "Dept. Kajian", nama: "-" },
  { jabatan: "Dept. Minat Bakat", nama: "-" },
  { jabatan: "Dept. Humas", nama: "-" },
]

export default function TentangPage() {
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STRUKTUR.map((pos, i) => (
              <div key={pos.jabatan} className="animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <Card className="p-5 text-center border border-border/50 bg-card/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg glass-panel glass-panel-hover">
                <CardContent className="p-0">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary/10 to-accent/10 animate-gradient flex items-center justify-center mx-auto mb-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-xs tracking-widest uppercase text-primary font-medium mb-1">
                    {pos.jabatan}
                  </p>
                  <p className="font-heading font-semibold text-foreground">
                    {pos.nama}
                  </p>
                </CardContent>
              </Card>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
