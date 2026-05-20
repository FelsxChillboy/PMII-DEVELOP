import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BarbaTransition from "@/components/BarbaTransition"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" className="min-h-screen pt-16 outline-none">
        <BarbaTransition>{children}</BarbaTransition>
      </main>
      <Footer />
    </>
  )
}
