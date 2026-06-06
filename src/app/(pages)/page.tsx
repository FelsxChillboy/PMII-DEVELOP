import type { Metadata } from "next"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import FeatureCard from "@/components/FeatureCard"
import LazyLottie from "@/components/LazyLottie"
import { HeroSection as ClientHero } from "./ClientSections"
import { Brain, Cog, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "PR PMII Rayon Teknik UNUSIA Jakarta Pusat — Organisasi pergerakan mahasiswa di Fakultas Teknik UNUSIA. Kaderisasi intelektual berbasis Ahlussunnah wal Jama'ah.",
}

const FEATURES = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Kaderisasi Intelektual",
    description:
      "Membentuk kader yang kritis, analitis, dan berkomitmen pada nilai-nilai Ahlussunnah wal Jama'ah.",
  },
  {
    icon: <Cog className="h-5 w-5" />,
    title: "Presisi Teknik",
    description:
      "Mengintegrasikan kompetensi teknik dengan semangat pergerakan mahasiswa yang progresif.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Integritas Organisasi",
    description:
      "Menjunjung tinggi transparansi, akuntabilitas, dan tata kelola organisasi yang profesional.",
  },
]

export default function HomePage() {
  return (
    <>
      <ClientHero />

      <AnimatedSection className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 section-grid-light opacity-[0.04]" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/1.5 via-transparent to-accent/1.5 animate-gradient" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionTag className="mb-4">TENTANG KAMI</SectionTag>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Membangun Peradaban{" "}
                <span className="text-gradient">Digital</span> dari Kampus
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                PR PMII Rayon Teknik UNUSIA Jakarta Pusat adalah wadah perjuangan
                kader pergerakan di lingkungan Fakultas Teknik dan Ilmu Komputer Universitas Nahdlatul
                Ulama Indonesia. Berkomitmen melahirkan kader intelektual yang
                menguasai ilmu pengetahuan dan teknologi serta berakhlakul karimah.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <LazyLottie type="pulse" className="mb-2" />
              <div className="grid gap-4 w-full">
                {FEATURES.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

    </>
  )
}
