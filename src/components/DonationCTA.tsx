import Link from "next/link"
import { ArrowRight, Heart } from "lucide-react"

export default function DonationCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20 lg:py-28">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 mb-6">
          <Heart className="h-6 w-6 text-accent" />
        </div>

        <p className="text-xs tracking-[0.2em] uppercase text-accent font-medium mb-3">
          DUKUNG PERGERAKAN
        </p>

        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
          Jadilah Bagian dari{" "}
          <span className="text-accent">Perubahan</span>
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Dukungan Anda akan memperkuat program kaderisasi, kegiatan sosial, dan
          pengembangan kapasitas kader teknik UNUSIA.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/donasi"
            className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors gap-2"
          >
            Donasi Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/kontak"
            className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  )
}
