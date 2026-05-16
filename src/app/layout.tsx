import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import ServiceWorker from "@/components/ServiceWorker"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
})

const siteTitle = "PR PMII Rayon Teknik UNUSIA Jakarta Pusat"
const siteDescription =
  "Platform digital terpadu untuk manajemen kader PR PMII Rayon Teknik UNUSIA Jakarta Pusat."
const siteUrl = "https://pmii-rayonteknik-unusia.vercel.app"

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.svg"],
  },
  other: {
    "google-site-verification": "",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PR PMII Rayon Teknik UNUSIA Jakarta Pusat",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: siteDescription,
  contactPoint: {
    "@type": "ContactPoint",
    email: "pmii.rayonteknik@unusia.ac.id",
    contactType: "customer service",
  },
  sameAs: [],
}

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
                document.documentElement.dataset.reducedMotion = mq.matches;
                mq.addEventListener("change", function(e) {
                  document.documentElement.dataset.reducedMotion = e.matches;
                });
              } catch(e) {}
            `,
          }}
        />
        <a href="#main-content" className="skip-to-content">
          Langsung ke konten utama
        </a>
        <Providers>
          <ServiceWorker />
          <div className="contents">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
