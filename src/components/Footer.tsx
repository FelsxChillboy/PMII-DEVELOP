import Link from "next/link"
import { Mail, MapPin, Heart } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import BackToTop from "@/components/BackToTop"
import AnimatedLogo from "@/components/AnimatedLogo"

const FOOTER_LINKS = [
  { label: "Tentang Kami", path: "/tentang" },
  { label: "Berita", path: "/berita" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Donasi", path: "/donasi" },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-background">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      <BackToTop />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <AnimatedLogo
                src="https://media.base44.com/images/public/6a0614bbe8ea40108cd58983/6842b6f37_Logo_RayonTeknik2022.svg"
                alt="Logo PR PMII Rayon Teknik"
                width={40}
                height={40}
                className="h-10 w-10"
                invert
              />
              <div>
                <p className="font-heading font-semibold text-sm text-foreground">
                  PR PMII RAYON TEKNIK
                </p>
                <p className="text-xs text-muted-foreground">UNUSIA JAKPUS</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Platform digital terpadu untuk manajemen kader PR PMII Rayon Teknik
              UNUSIA Jakarta Pusat. Berkomitmen melahirkan kader intelektual
              yang berintegritas.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/donasi"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Heart className="h-3.5 w-3.5" />
                Dukung Kami
              </Link>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Kampus UNUSIA, Jl. Taman Amir Hamzah No. 5, Jakarta Pusat 10430
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:pmii.rayonteknik@unusia.ac.id"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  pmii.rayonteknik@unusia.ac.id
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {year} PR PMII RAYON TEKNIK UNUSIA JAKPUS.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Dibangun dengan <span className="text-primary">&#9829;</span> untuk pergerakan
          </p>
        </div>
      </div>
    </footer>
  )
}
