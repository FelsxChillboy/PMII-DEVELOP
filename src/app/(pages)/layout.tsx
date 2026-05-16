import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageTransition from "@/components/PageTransition"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" className="min-h-screen pt-16 outline-none">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  )
}
