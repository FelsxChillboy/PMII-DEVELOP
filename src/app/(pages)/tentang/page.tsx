import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import { BookOpen, Lightbulb, Target } from "lucide-react"

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
      <AnimatedSection className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionTag className="mb-4">PROFIL ORGANISASI</SectionTag>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Tentang <span className="text-primary">Kami</span>
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
          <div className="max-w-3xl mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Visi
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6">
              &ldquo;Menjadikan PR PMII Rayon Teknik UNUSIA sebagai pusat
              kaderisasi intelektual yang melahirkan pemimpin berkarakter,
              berwawasan teknologi, dan berkomitmen pada nilai-nilai Ahlussunnah
              wal Jama&rsquo;ah an-Nahdliyyah.&rdquo;
            </p>
          </div>

          <div className="max-w-3xl mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Misi
            </h2>
            <ol className="space-y-4">
              {MISI.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-base text-muted-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-8">
              Nilai-Nilai <span className="text-accent">Fondasi</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {NILAI.map((nilai) => (
                <div
                  key={nilai.title}
                  className="p-6 rounded-xl border border-border bg-card"
                >
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <div className="text-accent">{nilai.icon}</div>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {nilai.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {nilai.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTag className="mb-4">KEPENGURUSAN</SectionTag>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-10">
            Struktur <span className="text-primary">Organisasi</span>
            <span className="block text-sm font-normal text-muted-foreground mt-2">
              Periode 2024/2025
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STRUKTUR.map((pos) => (
              <div
                key={pos.jabatan}
                className="p-5 rounded-xl border border-border bg-card text-center hover:border-primary/30 transition-colors"
              >
                <p className="text-xs tracking-widest uppercase text-primary font-medium mb-1">
                  {pos.jabatan}
                </p>
                <p className="font-heading font-semibold text-foreground">
                  {pos.nama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
