import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donasi",
  description:
    "Dukung program kaderisasi dan kegiatan sosial PR PMII Rayon Teknik UNUSIA Jakarta Pusat melalui donasi transfer bank, e-wallet, QRIS, atau tunai.",
}

export default function DonasiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
