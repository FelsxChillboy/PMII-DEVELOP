import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PR PMII Rayon Teknik UNUSIA Jakarta Pusat",
  description:
    "Platform digital terpadu untuk manajemen kader PR PMII Rayon Teknik UNUSIA Jakarta Pusat.",
  openGraph: {
    title: "PR PMII Rayon Teknik UNUSIA",
    description:
      "Platform digital terpadu untuk manajemen kader PR PMII Rayon Teknik UNUSIA Jakarta Pusat.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
