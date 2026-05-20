import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin } from "lucide-react"
import BackToTop from "@/components/BackToTop"

const FOOTER_LINKS = [
  { label: "Tentang Kami", path: "/tentang" },
  { label: "Berita", path: "/berita" },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Donasi", path: "/donasi" },
  { label: "Transparansi", path: "/transparansi" },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <BackToTop />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://media.base44.com/images/public/6a0614bbe8ea40108cd58983/6842b6f37_Logo_RayonTeknik2022.svg"
                alt="Logo PR PMII Rayon Teknik"
                width={40}
                height={40}
                className="h-10 w-10 brightness-0 invert"
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
              UNUSIA Jakarta Pusat.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="relative text-sm text-muted-foreground hover:text-primary transition-colors group inline-block"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Kampus UNUSIA, Jl. Taman Amir Hamzah No. 5, Jakarta Pusat 10430
                </span>
              </li>
              <li className="flex items-center gap-2">
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

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} PR PMII RAYON TEKNIK UNUSIA JAKPUS.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
