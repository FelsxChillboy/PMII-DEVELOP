import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Berita",
  description:
    "Berita dan informasi terbaru dari PR PMII Rayon Teknik UNUSIA Jakarta Pusat — kegiatan kaderisasi, kajian, dan aksi sosial.",
}

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
