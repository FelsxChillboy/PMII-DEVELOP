import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kegiatan",
  description:
    "Jadwal dan informasi kegiatan PR PMII Rayon Teknik UNUSIA Jakarta Pusat — kajian rutin, diskusi, aksi sosial, dan program kaderisasi.",
}

export default function KegiatanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
