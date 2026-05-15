import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transparansi",
  description:
    "Laporan keuangan transparan PR PMII Rayon Teknik UNUSIA Jakarta Pusat — pemasukan, pengeluaran, donasi publik, dan grafik keuangan.",
}

export default function TransparansiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
