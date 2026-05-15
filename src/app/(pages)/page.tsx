import HeroSection from "@/components/HeroSection"
import SectionTag from "@/components/SectionTag"
import AnimatedSection from "@/components/AnimatedSection"
import FeatureCard from "@/components/FeatureCard"
import DonationCTA from "@/components/DonationCTA"
import { Brain, Cog, ShieldCheck } from "lucide-react"

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
      <HeroSection />

      <AnimatedSection className="py-20 lg:py-28 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionTag className="mb-4">TENTANG KAMI</SectionTag>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Membangun Peradaban{" "}
                <span className="text-primary">Digital</span> dari Kampus
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                PR PMII Rayon Teknik UNUSIA Jakarta Pusat adalah wadah perjuangan
                kader pergerakan di lingkungan Fakultas Teknik Universitas Nahdlatul
                Ulama Indonesia. Berkomitmen melahirkan kader intelektual yang
                menguasai ilmu pengetahuan dan teknologi serta berakhlakul karimah.
              </p>
            </div>

            <div className="grid gap-4">
              {FEATURES.map((feature, i) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <DonationCTA />
    </>
  )
}
