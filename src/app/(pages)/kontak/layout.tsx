import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi PR PMII Rayon Teknik UNUSIA Jakarta Pusat — alamat, email, telepon, dan form pesan untuk informasi lebih lanjut.",
}

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
